'use strict';

const fs = require('fs-extra');
const path = require('path');

class LogService {
  /**
   * @summary Constructs a new instance of LogService and preloads an existing log if one exists.
   * 
   * @constructs LogService
   * @param {string} path - the default path to the activity log
   */
  constructor(path) {
    this.path = path;
    this.logs = [];

    // perserve old logs 
    // if we wanted to we could perserve them by copying to a new file appending a date.
    // but keeping in file for easy reading
    let fileExists = fs.existsSync(this.path);
    if (fileExists) {
      let file = fs.readFileSync(this.path);
      this.logs = JSON.parse(file);
    }
  }

  /**
   * @summary Adds a log to the log services array, and writes it to file.
   * 
   * @param {*} logObject - an object containing log information.
   */
  log(logObject) {
    this.logs.push(logObject);

    // create or overwrite log file.
    fs.outputFile(this.path, JSON.stringify(this.logs), function (err) {
      if (err) {
        console.error(`Error logging activity. \n\n Log Object: ${logObject} \n\n ${err}`);
      }
    });
  }
}

let loggerPath = path.join(__dirname, '../../../dist/logs/activity-log.json');
let logger = new LogService(loggerPath);

module.exports = {
  logger
};