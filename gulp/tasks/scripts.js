'use strict';

/**
 * @fileoverview Defines the `gulp js` task which compiles all the minified js
 * for the project.
 *
 * No flags:
 *    Builds dependencies file that allows the browser to fetch/run
 *    source files uncompiled.
 *
 * `--prod` flag:
 *    Build a compiled js file suitable for production.
 *
 * `--prod --js-sourcemaps` flags:
 *    Will build a compiled file with a sourcemap base64 encoded into the end
 *    of the file.
 */

const gulp = require('gulp');
const util = require('gulp-util');
const closureCompiler = require('google-closure-compiler').gulp();
const tap = require('gulp-tap');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const gap = require('gulp-append-prepend');
const webpack = require('webpack-stream');
const merge = require('merge-stream');
const size = require('gulp-size2');

const inlineSourceMapComment = require('inline-source-map-comment');
const path = require('path');
const moment = require('moment');
require('moment-duration-format');
const colors = require('colors');
const _ = require('lodash');
const fs = require('fs-extra');
const crypto = require('crypto');

const bs = require('browser-sync').get('bs');
const logger = require('../logger');
const constants = require('../constants');
const webpackConfig = require('../webpack.config');

const compilationLevel = {
  WHITESPACE_ONLY: 'WHITESPACE_ONLY',
  SIMPLE_OPTIMIZATIONS: 'SIMPLE_OPTIMIZATIONS',
  ADVANCED_OPTIMIZATIONS: 'ADVANCED_OPTIMIZATIONS',
};

// TODO (mosney): Look into converting this file to use the Glue gulp plugins.
// https://webmaster.googlesource.com/bs/glue/+/master/releases/latest/gulp/index.js

/**
 * Registers the `gulp js` task that compiles js with local closure compiler.
 * @return A Gulp stream object.
 */
module.exports = () => {
  // Default "prod" compile step.
  gulp.task('js', () => {
    // If we are in dev mode, do the uncompiled setup.
    if (constants.isDevMode) {
      return buildUncompiled();

    // Else, compile the code, but check for source map flag.
    } else if (util.env['js-sourcemaps']) {
      return compileAllConfigs({sourcemaps: true});

    // If no sourcemap flag, just do a regular production compilation.
    } else {
      return compileAllConfigs();
    }
  });
};


/**
 * Compiles all configured JS bundles.
 * @return A Gulp stream object.
 */
const compileAllConfigs = (options) => {
  options = options || {};

  const sourcemaps = options.sourcemaps || false;
  const configs = constants.jsSrc;
  const start = moment();

  // Creates an array of gulp streams from each js compile config.
  const streams = _.map(configs, compileSingleConfig);

  const mergedStream = merge(streams)
      .pipe(bs.reload({stream: true}))
      .on('end', () => {

        // Diff and format the time.
        const diff = moment().diff(start, 'milliseconds');
        const formatted = moment.duration(diff).format('s[ s]', 2);
        const total = configs.length;

        // Count any errors.
        const errors = _.filter(configs, function(config) {
          return !!config.error;
        }).length;

        // Count successes.
        const successes = total - errors;

        const data = {
          success: successes.toString().magenta,
          count: total.toString().magenta,
          duration: formatted.magenta,
          errors: errors.toString().magenta
        };

        const slog = _.template(
            'Compiled ${count} js files in ${duration} ' +
            'with ${errors} errors')(data);

        const elog = _.template(
            '${success} ${"out of"} ${count} ' +
            'js files compiled without errors')(data);

        if (errors === 0) {
          logger.success('js', slog, null, true);
          if (util.env['js-sourcemaps']) {
            appendSourceMaps();
          }
        } else {
          logger.log('js', elog, null, true) && util.beep();
        }

        _.each(constants.jsSrc, function(js) {
          js.error = false;
        });

      });

  return mergedStream;
};


/**
 * Appends sourcemap comments to all configured js bundles.
 */
const appendSourceMaps = () => {
  // For each one, take the sourcemap ".map" file, convert it to an inline
  // comment, and append it to the original source file.
  _.map(constants.jsSrc, (options) => {

    // Get the hash used to write the file to .tmp directory.
    const filenameHash = hashString(options.dist);

    // Get the full path/filename to the map.
    const sourceMapFilePath = path.join('.tmp/', filenameHash + '.map');

    // Read the source map, synchronously because it makes things simpler.
    const sourceMapBuffer = fs.readFileSync(sourceMapFilePath);

    // Parse the source map into a Javascript object.
    const sourceMapObject = JSON.parse(sourceMapBuffer.toString());

    // Generate the sourcemap comment.
    const sourceMapComment = inlineSourceMapComment(sourceMapObject, {
      sourcesContent: true
    });

    // Write the comment to the minified js file on a new line.
    fs.appendFileSync(options.dist, '\n' + sourceMapComment);

    logger.log('js', 'Sourcemap comments appended to compiled js.', null, false);
  });
};


/**
 * Creates an object with configurations for the closure compiler.
 * @param {Object<string,*>} settings Declares an `entryPoint`, `filename`, and
 *                                    an optional `compLevel` for the compiler.
 * @return {Object<string,*>} Closure compiler configuration settings object.
 */
const compilerConfigFactory = (settings) => {
  const compLevel =
      constants.compLevel || compilationLevel.ADVANCED_OPTIMIZATIONS;

  if (!settings.filename) {
    throw new Error('No destination filename for js compiler.');
  }

  if (!settings.entryPoint) {
    throw new Error('No entry point for js compiler.');
  }

  fs.mkdirpSync(path.join(process.cwd(), '.tmp'));

  const filenameHash = hashString(settings.filename);

  return {
    compilerPath: constants.paths.COMPILER,
    fileName: settings.filename,
    continueWithWarnings: true,
    compilerFlags: {
      assume_function_wrapper: true,
      angular_pass: true,
      export_local_property_definitions: true,
      compilation_level: compLevel,
      create_source_map: `.tmp/${filenameHash}.map`,
      source_map_include_content: true,
      generate_exports: true,
      output_wrapper: '(function(){%output%}).call(window)',
      dependency_mode: 'STRICT',
      entry_point: settings.entryPoint,
      warning_level: 'VERBOSE',
      language_in: 'ECMASCRIPT_2017',
      language_out: 'ECMASCRIPT5',
      externs: constants.externs,
      rewrite_polyfills: true,
      module_resolution: 'NODE',
      js_output_file: settings.filename,
      // conformance_configs: path.join(constants.paths.CLOSURE,
      //     'conformance_proto.txt'),
      // jscomp_error: 'conformanceViolations',
      // These options appear to increase the output file size with no benefit.
      // manage_closure_dependencies: true,
      // only_closure_dependencies: true,
    }
  };
};


/**
 * Compiles a directory of js files based on an entry point namespace and
 * a directory of javascript source files.
 *
 * @param {Object} options Compiler settings and deps.
 * @return A Gulp stream object.
 */
const compileSingleConfig = (options) => {
  let start;

  const files = [];

  options.deps = options.deps || [];

  const compilerConfig = compilerConfigFactory({
    filename: options.dist,
    entryPoint: options.entry,
  });

  const gulpSrc = options.deps.concat(options.src, constants.deps);

  // Create the destination directory if it doesn't exist.
  fs.mkdirpSync(path.dirname(options.dist));

  return gulp.src(gulpSrc, {base: './'})
    // Push each file path to files array.
    .pipe(tap(function(file) {
      files.push(file.path);
    }))

    // Then log some progress.
    .on('end', function() {
      // Counts source and deps files separately.
      const split = _.partition(files, function(file) {
        return file.indexOf('node_modules') != -1;
      });

      const data = {
        count: files.length.toString(),
        dest: options.dist.toString(),
        deps: split[0].length.toString(),
        source: split[1].length.toString(),
        entry: options.entry.toString()
      };

      const log = _.template(
          'Compiling ${entry.cyan} from ${count.magenta} files to ' +
          '${dest.cyan} (${deps.magenta} deps, ' +
          '${source.magenta} source)')(data);

      logger.log('js', log);

      start = moment();
    })
    .pipe(
      closureCompiler(compilerConfig.compilerFlags).on('error', function(err) {
      options.error = true;
      logger.error('js', options.dist, err.message, true);
      this.emit('end');
    }))
    // Log compilation.
    .on('end', function() {

      if (options.error) { return; };
      const diff = moment().diff(start, 'milliseconds');
      const formatted = moment.duration(diff).format('s[ s]', 2);

      const data = {
        entry: options.entry.toString(),
        duration: formatted,
      };

      const log = _.template(
          'Compiled ${entry.cyan} js module in ${duration.magenta}')(data);

      logger.log('js', log, null, false);
    })
    .pipe(size({
      gzip: true,
      showFiles: true,
      log: (title, what, size, gzip) => {
        const sizeKb = Math.round(size / 1000 * 100) / 100;

        const data = {
          what: what,
          size: `${sizeKb} Kb`,
        };

        const log = _.template(
            'gZipped size of ${what.cyan} is ${size.magenta}')(data);

        logger.log('size', log, null, false);
      }
    }))
    .pipe(gulp.dest('./'));
};


/**
 * Generates closure deps file for async module loading. https://goo.gl/tvxSji
 * @return A Gulp stream object.
 */
const buildUncompiled = () => {
  // Just to keep track of time.
  const start = moment();

  let jsSrc = [];

  let streams = _.map(constants.jsSrc, (srcObj) => {
    jsSrc = _.concat(jsSrc, srcObj.src);
    const paths = [].concat(constants.deps, jsSrc);
    return gulp.src(paths)
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('./src/static/js'));
  });

  // Return a merged stream of all our generated files and log on end.
  return merge(streams)
      .pipe(bs.reload({stream: true}))
      .on('end', function() {

        // Diff and format the time.
        const diff = moment().diff(start, 'milliseconds');
        const formatted = moment.duration(diff).format('s[ s]', 2);

        logger.success('js',
            `Finished building async js dependencies in ${formatted.magenta}.`,
            null, true);

      });
};


/**
 * Generates an md5 hash from a string value.
 * @param {string} str A string to hash.
 * @return {string} An md5 hash.
 */
const hashString = (str) => {
  return crypto.createHash('md5').update(str).digest('hex');
};
