const program = require('commander');
const search = require('../commands/search');
const twitterCredentials = require('../app.config.js');
const chalk = require('chalk');


// default project name used for search in case the user doen't provide any
const defaultProjectName = 'Reactive';

// Set up of the "search" command
// [project] is an optional param to the search command.
program.arguments('[project]')
// set up of the command action function with the default search term
    .action(function(project = defaultProjectName) {
      // do the searh
      search(project, twitterCredentials)
          .catch((message) => {
            // Using chalk library to give the error a nice red color and suppress stack trace
            console.error(chalk.redBright(message));
            process.exitCode = 1;
          });
    });

// parse argements passed from command line. This is how commander
program.parse(process.argv);
