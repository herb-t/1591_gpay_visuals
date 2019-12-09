'use strict';

const argv = require('yargs').argv;
const path = require('path');
const util = require('gulp-util');

const settings = require('../package.json');

const compilerPath = 'node_modules/google-closure-compiler/compiler.jar';
const closurePath = 'node_modules/google-closure-library/closure/goog/';
const gluePath = 'node_modules/@google/glue/';
const glueLibPath = `${gluePath}lib/`;
const glueCdnPath = `${gluePath}cdn/src/`;
const glueExternsPath = `${gluePath}externs/`;
const externsPath = 'node_modules/google-closure-compiler/contrib/externs/';

module.exports = {
  deps: [
    path.join(closurePath, '**/*.js'),
    '!' + path.join(closurePath, '**/*_test.js'),
    path.join(glueLibPath, '**/*.js'),
    '!' + path.join(glueLibPath, '**/*_test.js'),
    `${gluePath}/index.js`
  ],
  externs: [
    path.join(externsPath, 'angular-1.6.js'),
    path.join(externsPath, 'angular-1.6-q_templated.js'),
    path.join(externsPath, 'angular-1.6-http-promise_templated.js'),
    path.join(externsPath, 'angular-1.6-resource.js'),
    path.join(externsPath, 'google_youtube_iframe.js'),
    path.join(glueExternsPath, 'hammerjs-2.0.2.js'),
  ],
  paths: {
    COMPILER: compilerPath,
    CLOSURE: closurePath,
  },
  jsSrc: [
    {
      entry:  './src/index',
      dist:   './src/static/js/index.min.js',
      src:    [
        'src/**/*.js',
        '!src/static/**/*.js',
      ],
    },
    {
      entry:  './src/detect/detect',
      dist:   './src/static/js/detect.min.js',
      src:    [
        'src/**/*.js',
        '!src/static/**/*.js',
      ],
    },
  ],
  sassSrc: [{
    src: 'src/index.scss',
    dist: 'src/static/css',
  }],
  root: '/',
  isDevMode: !util.env.prod,
  isProdMode: !!util.env.prod,
  startPath: '/',
};
