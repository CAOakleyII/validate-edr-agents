'use strict';

const EDRService = require('./lib/services/edr_service')
const path = require('path')

// get the path to the edr agents json we want to test
let edrAgentsJsonDist = path.join(__dirname, 'dist/edr_agents.json');
let edrAgentsTemplate = path.join(__dirname, 'edr_agents_template.json');

// instantiate a new EDR service, to test our edr agents generate the needed telemetry
let edrService = new EDRService(edrAgentsJsonDist)

// initiate our application for assignment specific requirements
// using the edr_agents_template.json
edrService.init(edrAgentsTemplate);

// start a process
edrService.process();
