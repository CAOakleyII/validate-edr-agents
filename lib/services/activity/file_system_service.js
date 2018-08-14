'use strict';

const FileCommands = require('../../models/enums/file_commands');
const FunctionRegistry = require('../../registry/function_registry');
const FileSystemLog = require('../../models/logs/file_system_log');
const { logger } = require('../logger/log_service');
const fs = require('fs-extra');

module.exports = class FileSystemService {
  constructor() {
    this.fileSystemRegistry = new FunctionRegistry();
    this.fileSystemRegistry.register(FileCommands.CREATE, this.createModifyFile.bind(this));
    this.fileSystemRegistry.register(FileCommands.MODIFY, this.createModifyFile.bind(this));
    this.fileSystemRegistry.register(FileCommands.DELETE, this.deleteFile.bind(this));
  }

  /**
   * @summary Trigger async file system commands (Create, Modify or Delete) for the provided activity.
   * 
   * @param {object} activity - the file system activity that we will generate telemetry for
   */
  process(activity) {
    this.fileSystemRegistry.invoke(activity.command, activity);
  }

  /**
   * @summary Creates or Modifies a file if it exists.
   * 
   * @param {object} activity - the file system activity that we will generate telemetry for
   */
  createModifyFile(activity) {
    // currently the behavior for creating and modifying a file is the same.
    // unless business logic denotes not to overwrite a file when told to create one
    // or behavior between creating and modifying a file changes
    // we can use an UPSERT behavior to write the data.    
    fs.outputFile(activity.path, activity.data, err => {
      if (err) {
        console.error(`Error writing to file within FileSystemService, ${err.message}`);
      }
      this.logFileSystemActivity(activity);
    });
  }

  /**
   * @summary Deletes a file if it exists
   * 
   * @param {object} activity - the file system activity that we will generate telemetry for
   */
  deleteFile(activity) {
    if (!fs.existsSync(activity.path)) {
      return;
    }
    
    fs.unlink(activity.path, err => {
      if (err) {
        console.error(`Error deleting file within FileSystemService, ${err.message}`);
      }
      this.logFileSystemActivity(activity);
    });
  }

  /**
   * @summary Creates and logs a new file system log object based on the activity object provided.
   * 
   * @param {*} activity - the activity object associated with the request
   */
  logFileSystemActivity(activity) {
    logger.log(new FileSystemLog({
      path: activity.path,
      activityDescriptor: activity.command
    }));
  }
}
