'use strict';

const http = require('http');
const https = require('https');
const { logger } = require('../logger/log_service');
const NetworkLog = require('../../models/logs/network_log');

module.exports = class HttpService {

  /**
   * @summary Trigger async http request for the provided activity
   * 
   * @param {object} activity - the http network activity that we will generate telemetry for
   */
  process(activity) {

    // set up the options for the http request
    let body = JSON.stringify(activity.data),
      options = {
        hostname: activity.hostname,
        path: activity.path,
        port: activity.port,
        method: activity.method
      },
      protocol = activity.protocol == 'HTTPS' ? https : http;

    // create the request object
    let req = protocol.request(options, res => {
      this.logNetworkActivity(req);
    });

    // handle if theres an error when trying to make a network call
    req.on('error', e => {
      console.error(`Error within HttpService: ${e.message}`);
    });

    // write data to request body
    req.end(body);
  }

  /**
   * @summary Creates and logs a new network log object based on the request object provided.
   * 
   * @param {object} req - the http request object
   */
  logNetworkActivity(req) {
    // generate a log based on the request of this activity
    logger.log(new NetworkLog({
      destination: `${req.socket.remoteAddress}:${req.socket.remotePort}`,
      source: `${req.socket.localAddress}:${req.socket.localPort}`,
      dataSize: `${req.socket.bytesWritten} bytes`,
      protocol: req.agent.protocol
    }));
  }
}