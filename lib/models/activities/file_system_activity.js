'use strict';

const Activity  = require( './activity');
const ActivityTypes = require( '../enums/activity_types');
const FileCommands = require( '../enums/file_commands');

module.exports = class FileSystemActivity extends Activity {
  constructor(activity) {
    super(ActivityTypes.FILE_SYSTEM);

    this.path = '';
    this.data = '';
    this.command = FileCommands.UNKNOWN;
    
    Object.assign(this, activity); 
  }
}
