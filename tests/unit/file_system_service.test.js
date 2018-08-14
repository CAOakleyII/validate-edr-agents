const fs = require('fs-extra');
const { logger } = require('../../lib/services/logger/log_service');
const FileSystemActivity = require('../../lib/models/activities/file_system_activity');
const FileSystemService = require('../../lib/services/activity/file_system_service');
const FileSystemLog = require('../../lib/models/logs/file_system_log');
const FileCommands = require('../../lib/models/enums/file_commands');

jest.mock('fs-extra');
jest.mock('../../lib/services/logger/log_service');

describe('FileSystemService', () => {
  let fileSystemService;
  
  beforeEach(() => {
    fileSystemService = new FileSystemService();
  });

  test('process creates a file', () => {
    let createFileActivity = new FileSystemActivity({
      path: '/path/to/file.txt',
      data: 'Hello World',
      command: FileCommands.CREATE
    });

    let actualFile = {};
    let expectedFile = {
      path: '/path/to/file.txt',
      data: 'Hello World'
    };

    fs.outputFile.mockImplementation((path, data, callback) => {
      actualFile = {path, data};
    });

    fileSystemService.process(createFileActivity);

    expect(actualFile).toEqual(expectedFile);
    expect(fs.outputFile).toBeCalled();
  });

  test('procress modifies a file', () => {
    let modifyFileActivity = new FileSystemActivity({
      path: '/path/to/file.txt',
      data: 'New Data',
      command: FileCommands.MODIFY
    });
    
    let actualFile = {};
    let expectedFile = {
      path: '/path/to/file.txt',
      data: 'New Data'
    };

    fs.outputFile.mockImplementation((path, data, callback) => {
      actualFile = {path, data};
    });

    fileSystemService.process(modifyFileActivity);

    expect(actualFile).toEqual(expectedFile);
    expect(fs.outputFile).toBeCalled();
  });

  test('process deletes a file', () => {    
    let deleteFileActivity = new FileSystemActivity({
      path: '/path/to/file.txt',      
      command: FileCommands.DELETE
    });
    
    let actualFile = {};
    let expectedFile = {
      path: '/path/to/file.txt'
    };
    
    fs.existsSync.mockReturnValue(true);
    fs.unlink.mockImplementation((path, callback) => {
      actualFile = { path };  
    });

    fileSystemService.process(deleteFileActivity);

    expect(actualFile).toEqual(expectedFile);
    expect(fs.unlink).toBeCalled();
  });

  test('logs a file system log object to logger', () => {
    let deleteFileActivity = new FileSystemActivity({
      path: '/path/to/file.txt',      
      command: FileCommands.DELETE
    });

    let actual = {};
    let expected = new FileSystemLog({
        path: deleteFileActivity.path,
        activityDescriptor: deleteFileActivity.command
      });
    
    logger.log.mockImplementation(log => {
      actual = log;
      actual.timestamp = expected.timestamp;
    });

    fileSystemService.logFileSystemActivity(deleteFileActivity);

    expect(actual).toEqual(expected)
    expect(logger.log).toBeCalled();
  });
})
