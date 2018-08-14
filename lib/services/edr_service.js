'use strict';

const FunctionRegistry = require('../registry/function_registry');
const ActivityTypes = require('../models/enums/activity_types');
const ApplicationProcessService = require('./activity/application_process_service');
const HttpService = require('./activity/http_service');
const FileSystemService = require('./activity/file_system_service');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

/**
 * @summary Defines a class that tests EDR Agents data is accurate to allow for core telemetry to be emitted.
 * 
 */
module.exports = class EDRService {
  /**
   * @summary Constructs a new instance of EDRService.
   * 
   * @constructs EDRService
   * @param {string} path - the default path to the EDR agent data to be used
   */
  constructor(path) {

    // defines the path to the EDR Agents we want to test
    this.path = path;

    // defines the service to handle any file system activities
    this.fileSystemService = new FileSystemService();

    // defines the service to handle any application process activities
    this.applicationProcessService = new ApplicationProcessService();

    // defines the service to handle any http activities
    this.httpService = new HttpService();

    // defines a registry used to invoke the correct services based on our activity
    this.activityServiceRegistry = new FunctionRegistry();

    // register our activities
    this.activityServiceRegistry.register(ActivityTypes.FILE_SYSTEM, this.fileSystemService.process.bind(this.fileSystemService));
    this.activityServiceRegistry.register(ActivityTypes.APPLICATION_PROCESS, this.applicationProcessService.process.bind(this.applicationProcessService));
    this.activityServiceRegistry.register(ActivityTypes.HTTP, this.httpService.process.bind(this.httpService));
  }

  /**
   * @summary In order to fullfil the requirements for this assignment, 
   *          we will create the initial files needed for setup of modification and deletion
   */
  init(template) {
    process.title = 'validate-edr-agents';

    // define the edr_agents to use the users homedir for our test cases
    var edrAgents = JSON.parse(fs.readFileSync(template));
    edrAgents.filter(agent => agent.os.includes(process.platform)).forEach(agent => {
      agent.activities.filter(a => a.activityType == ActivityTypes.FILE_SYSTEM).forEach(activity => {
        if (!activity.path.includes(os.homedir())) {
          activity.path = os.homedir() + activity.path;
        }
      })
    });

    fs.outputFileSync(this.path, JSON.stringify(edrAgents));

    // we need to write out files sync so 
    // that way we know they are there before we do the test
    fs.outputFileSync(path.join(os.homedir(), '/EDR_Test/to-be-deleted.txt'), 'You should not see this.');
    fs.outputFileSync(path.join(os.homedir(), '/EDR_Test/modify-me.txt'), 'Hello World');
  }

  /**
   * @summary Processes the agents and their activities.
   * 
   */
  process() {
    // retrieve edrs asynchronously
    fs.readFile(this.path, this.generateTelemetry.bind(this))
  }

  /**
   * @summary Callback to generate telemetry based on the agents provided.
   * 
   * @param {*} err - error object exists if the agents file cannot be read
   * @param {*} data - the data from the EDR agents file
   */
  generateTelemetry(err, data) {
    if (err) {
      console.error('EDR Agents file provided is not valid. \n\n', err)
      return;
    }

    let agents = JSON.parse(data);

    // test each edr agent for this OS
    // and run the activities for it
    agents.filter(agent => agent.os.includes(process.platform)).forEach(agent => {
      agent.activities.forEach(activity => {
        try {
          this.activityServiceRegistry.invoke(activity.activityType, activity);
        } catch (err) {
          console.error(`Error invoking activity: \n\n ${JSON.stringify(activity)} \n\n Error: ${err.message}`);
        }
      });
    });
  }
}