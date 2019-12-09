'use strict';

/**
 * @fileoverview Copies files from Glue npm package to Bracket project src.
 */

const path = require('path');
const fs = require('fs-extra');
const gluePath = 'node_modules/@google/glue/';

const copyFiles = [
  {
    src: path.join(gluePath, 'assets/icons/glue-icons.svg'),
    dest: 'src/static/img/glue-icons.svg',
  },
];

copyFiles.forEach((files) => {
  fs.copySync(path.resolve(__dirname, files.src), files.dest);
});
