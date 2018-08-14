const child_process = require('child_process');
const { logger } = require('../../lib/services/logger/log_service');
const ApplicationProcessActivity = require('../../lib/models/activities/application_process_activity');
const ApplicationProcessService = require('../../lib/services/activity/application_process_service');
const ApplicationProcessLog = require('../../lib/models/logs/application_process_log');

jest.mock('child_process');
jest.mock('../../lib/services/logger/log_service');

describe('ApplicationProcessService', () => {
  let applicationProcessService;
  beforeEach(() => {
    applicationProcessService = new ApplicationProcessService();
  });

  test('process executes an executable without arguments', () => {
    let programProcessActivity = new ApplicationProcessActivity({
      path: '/path/to/program.exe'
    });
    let child = {
      spawnfile: '/path/to/program.exe',
      pid: 12345
    };
    let actual = {};
    let expected = {
      path: '/path/to/program.exe',
      args: []
    };

    child_process.execFile.mockImplementation((path, args) => {
      actual = {path, args};
      return child;
    });

    applicationProcessService.process(programProcessActivity);

    expect(actual).toEqual(expected);
    expect(child_process.execFile).toBeCalled();
  });

  test('process executes an executable with arguments', () => {
    let programProcessActivity = new ApplicationProcessActivity({
      path: '/path/to/program.exe',
      args: ['--flag-for-high-ground']
    });
    let child = {
      spawnfile: '/path/to/program.exe',
      pid: 12345
    };
    let actual = {};
    let expected = {
      path: '/path/to/program.exe',
      args: ['--flag-for-high-ground']
    };

    child_process.execFile.mockImplementation((path, args) => {
      actual = {path, args};
      return child;
    });

    applicationProcessService.process(programProcessActivity);

    expect(actual).toEqual(expected);
    expect(child_process.execFile).toBeCalled();
  });

  test('logs an application process log object to logger', () => {
    let child = {
      spawnfile: '/path/to/wow.exe',
      pid: 12345
    };

    let actual = {};
    let expected = new ApplicationProcessLog({
      processStartedPath: child.spawnfile,
      processStartedPid: child.pid
    });

    logger.log.mockImplementation(log => {
      actual = log;
      actual.timestamp = expected.timestamp;
    });

    applicationProcessService.logApplicationProcessActivity(child);

    expect(actual).toEqual(expected)
    expect(logger.log).toBeCalled();
  });
});