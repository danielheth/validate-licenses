/*
 * validate-licenses
 * https://github.com/danielheth/validate-licenses
 *
 * Copyright (c) 2016 Daniel Moran
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var cp = require('child_process'),
    f = require('util').format,
    _ = grunt.util._,
    log = grunt.log,
    path = require('path'),
    verbose = grunt.verbose;


  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('validate_licenses', 'Validate licenses of npm modules and fail builds if unapproved licenses exist.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      blacklist: [],
      whitelist: {}
    });

    var cmdPath = null;
    var binPath = path.resolve(__dirname + '/../../.bin');
    log.ok('binPath=' + binPath);
    if (!grunt.file.exists(binPath, '/license-checker.cmd')) {
      binPath = path.resolve(__dirname + '/../node_modules/.bin');
      log.ok('binPath=' + binPath);
      if (!grunt.file.exists(binPath, '/license-checker.cmd')) {
        log.error('Unable to find license-checker.cmd');
        return done(false);
      }
    }

    //1. generate licenses report based on project
    var data = {},
        outputReport = (this.target === 'out' && this.data !== undefined) ? this.data : '.licenses.json',
        execOptions = {},
        stdout = true,
        stderr = true,
        callback = function() {},
        exitCodes = [0],
        command = '"' + binPath + '/license-checker.cmd"' +
                  ' --production' +  //only show production dependencies.
                  ' --json ' +  //output in json format.
                  ' --out ' + outputReport,
        childProcess,
        args = [].slice.call(arguments, 0),
        done = this.async();

    data.cwd = execOptions.cwd;
    data.maxBuffer = execOptions.maxBuffer;

    if (_.isFunction(command)) {
      command = command.apply(grunt, args);
    }

    childProcess = cp.exec(command, execOptions, callback.bind(grunt));

    if (stdout) {
      childProcess.stdout.on('data', function (d) { log.write(d); });
    }
    if (stderr) {
      childProcess.stderr.on('data', function (d) { log.error(d); });
    }

    // Catches failing to execute the command at all (eg spawn ENOENT),
    // since in that case an 'exit' event will not be emitted.
    childProcess.on('error', function (err) {
      log.error(f('Failed to generate licenses report: %s', err));
      done(false);
    });

    childProcess.on('exit', function(code) {
      if (exitCodes.indexOf(code) < 0) {
        log.error(f('Exited with code: %d.', code));
        return done(false);
      }

      //2. process the report
      if (!grunt.file.exists(outputReport)) {
        grunt.fail.fatal('Missing licenses report file.');
      }
      var licenses = grunt.file.readJSON(outputReport);

      var hasFailures = false;
      for(var nodeModule in licenses) {
        var license = String(licenses[nodeModule].licenses);
        for (var i = 0; i < options.blacklist.length; i++) {
          if (license.match(options.blacklist[i])) {
            if (!options.whitelist.hasOwnProperty(nodeModule)) {
              hasFailures = true;
              log.error(nodeModule + ': ' + license);
            }
          }
        }
      }
      if (hasFailures) {
        grunt.fail.fatal('One or more licenses have failed our validation checks.');
      } else {
        log.ok('All licenses have passed our validation checks.');
      }
      done();
    });

  });
};
