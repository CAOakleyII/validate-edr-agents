const Log = require('./log')

module.exports = class ApplicationProcessLog extends Log {
  constructor(data) {
    super();
    
    this.processStartedPid = '';    
    this.processStartedPath = '';

    Object.assign(this, data)    
  }
}