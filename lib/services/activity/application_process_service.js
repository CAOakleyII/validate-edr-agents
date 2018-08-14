'use strict';

const ApplicationProcessLog = require('../../models/logs/application_process_log');
const { logger } = require('../logger/log_service');
const child_process = require('child_process');

module.exports = class ApplicationProcessService {

  /**
   * @summary Triggers the start of an application with optional arguments process based on the provided activity.
   * 
   * @param {object} activity - the file system activity that we will generate telemetry for
   */
  process(activity) {
    let child = child_process.execFile(activity.path, activity.args, (err, stderr, stdout) => {
      if (err) {
        console.error(`Error executing file ${activity.path} in Application Process Service ${err.message}`);
      }
    });

    this.logApplicationProcessActivity(child);
  }

  /**
   * @summary Creates and logs a new application proccess log object based on the child process provided.
   * 
   * @param {object} child - the activity object
   */
  logApplicationProcessActivity(child) {
    // generate a log based on the the application activity
    logger.log(new ApplicationProcessLog({
      processStartedPath: child.spawnfile,
      processStartedPid: child.pid
    }));
  }
}