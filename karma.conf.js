const WrapperPlugin = require('webpack-wrapper-plugin');
module.exports = function(config) {
  const gluePath = 'node_modules/@google/glue/';

  config.set({
    // Base path that will be used to resolve all patterns (eg. files, exclude)
    // relative to the location of karma.conf.js.
    basePath: '.',

    // Available frameworks: https://npmjs.org/browse/keyword/karma-adapter.
    frameworks: ['jasmine'],

    // List of files / patterns to load in the browser.
    files: [
      // Glue library.
      gluePath +'cdn/dist/glue/glue-detect.min.js',
      gluePath +'cdn/dist/glue/glue-vanilla.min.js',
      gluePath +'cdn/dist/glue/glue-angular.min.js',

      // The tests themselves.
      'src/index_test.js',
    ],

    preprocessors: {
      'src/**/*.js': ['webpack', 'sourcemap'],
    },

    webpack: {
      cache: true,
      devtool: 'inline-source-map',
      module: {
        rules: [
          // Run babel loader through all test files to transpile code from ES6 to ES5.
          {
            enforce: 'pre',
            test: /._test\.js$/,
            include: /lib|test$/,
            exclude: /node_modules/,
            use: [{loader: 'babel-loader'}],
          },
          // Run babel loader through Glue source files to transpile code from ES6 to ES5.
          {
            test: /\.js$/,
            include: /lib$/,
            exclude: /node_modules|._test\.js$/,
            use: [{loader: 'babel-loader'}],
          },
        ],
      },
      plugins: [
        new WrapperPlugin({}),
      ],
    },
    webpackMiddleware: {
      stats: 'errors-only',
    },

    // Test results reporter to use.
    // Possible values: 'dots', 'progress'
    // Available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],

    // Level of logging.
    // Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG.
    logLevel: config.LOG_INFO,
    // Web server port.
    port: 9876,
    // Enable / disable colors in the output (reporters and logs).
    colors: true,

    // Continuous Integration mode. Enable / disable watching file and
    // executing tests whenever any file changes.
    singleRun: false,
    autoWatch: true,

    // Start these browsers.
    // Available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // Use 'Chrome' for a browser with a debuggable window.
    browsers: ['ChromeHeadless'],

    // Define custom flags.
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: ['--headless', '--disable-gpu', '--remote-debugging-port=9222'],
      },
    },

    failOnEmptyTestSuite: false,
  });
};
