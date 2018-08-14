const fs = require('fs-extra');
const path = require('path');

class LogService {
  constructor() {
    this.path = path.join(__dirname, '../../../logs/activity-log.json')
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
  log(logObject) {
    this.logs.push(logObject);

    // create or overwrite log file.
    fs.outputFile(this.path, JSON.stringify(this.logs), function(err) {
      if (err) {
        console.error(`Error logging activity. \n\n Log Object: ${logObject} \n\n ${err}`)
      }
    })
  }
}

let logger = new LogService();
module.exports = { logger };