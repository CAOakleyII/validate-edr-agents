const Log = require('./log')

module.exports = class FileSystemLog extends Log {
  constructor(data) {
    super();
    
    this.path = '';
    this.activityDescriptor = '';

    Object.assign(this, data)    
  }
}