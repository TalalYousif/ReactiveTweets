#! /usr/bin/env node
const program = require('commander');
const pkg = require('../package.json');

const searchCommand = 'search';
const searchCommandDesc = 'Search github project tweets';
// commander setup , hoock the search command and
program
    // To display the version number when -V option is passed
    .version(pkg.version)
    // Register the search command
    .command(searchCommand, searchCommandDesc)
    // parse commandline arguments
    .parse(process.argv);
