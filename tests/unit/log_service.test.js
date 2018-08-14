const fs = require('fs-extra');
const { LogService } = require('../../lib/services/logger/log_service');

jest.mock('fs-extra');

describe('LogService', () => {
  // Describe without Existing File
  describe('LogService without existing file', () => {

    beforeAll(() => {
      fs.existsSync.mockReturnValue(false);
    })

    test('log writes objects to file', () => {
      let logger = new LogService('/path/to/log');
      let actual,
        logObject = {
          test: 'data'
        };

      let expected = [logObject];

      fs.outputFile.mockImplementation((path, data) => {
        actual = JSON.parse(data);
      });

      logger.log(logObject);

      expect(actual).toEqual(expected);
    });

    test('log appends objects to file', () => {
      let logger = new LogService('/path/to/log');
      let actual,
        firstObject = {
          first: 'data'
        },
        secondObject = {
          second: 'data'
        };

      let expected = [firstObject, secondObject];

      fs.outputFile.mockImplementation((path, data) => {
        actual = JSON.parse(data);
      });

      logger.log(firstObject);
      logger.log(secondObject);

      expect(actual).toEqual(expected);
    });
  });

  // Describe with valid existing file 
  describe('LogService with valid existing file', () => {
    let existingFile;

    beforeAll(() => {
      let firstObject = { first: 'data' };
      let secondObject = { second: 'data' };
      existingFile = [firstObject, secondObject];

      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(existingFile));
    });

    test('log appends objects to an existing file', () => {
      let logger = new LogService('/path/to/log');
      let actual,
        newObject = {
          third: 'data'
        };
      
      let expected = [...existingFile, newObject];

      fs.existsSync.mockReturnValue(true);
      
      fs.outputFile.mockImplementation((path, data) => {
        actual = JSON.parse(data);
      });

      logger.log(newObject);

      expect(actual).toEqual(expected);
    });
  });

  // Describe with invalid existing file 
  describe('LogService with invalid existing file', () => {

    beforeAll(() => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('');
    });

    test('log writes objects to a new file with an invalid existing file', () => {
      let logger = new LogService('/path/to/log');
      let actual,
        newObject = {
          third: 'data'
        };
      
      let expected = [newObject];

      fs.existsSync.mockReturnValue(true);
      
      fs.outputFile.mockImplementation((path, data) => {
        actual = JSON.parse(data);
      });

      logger.log(newObject);

      expect(actual).toEqual(expected);
    });
  });
});
