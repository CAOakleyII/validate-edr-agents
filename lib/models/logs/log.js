'use strict';

const os = require('os');

module.exports = class Log {
  constructor() {
    this.timestamp = new Date();
    this.username = os.userInfo().username;
    this.processName = process.title;
    this.processCommandLine = '';
    this.processId = process.pid;
  }
}