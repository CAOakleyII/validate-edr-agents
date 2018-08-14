const http = require('http');
const { logger } = require('../../lib/services/logger/log_service');
const HttpService = require('../../lib/services/activity/http_service');
const HttpActivity = require('../../lib/models/activities/http_activity');
const NetworkLog = require('../../lib/models/logs/network_log')

jest.mock('http');
jest.mock('../../lib/services/logger/log_service');

describe('HttpService', () => {
  let request,
  req = { 
    socket: {
      remoteAddress : '123.123.123.123',
      remotePort : '8080',
      localAddress: '127.0.0.1',
      localPort: '6543',
      bytesWritten: 500
    },
    agent: {
      protocol: 'https'
    }
  },
  httpActivity =  new HttpActivity({ 
    protocol : 'http',
    hostname : 'fakehost.com',
    path : '/posts',
    port : '8080',
    method : 'POST',
    body :  { 'title':'foo', 'body':'bar', 'userId': 1 }
  });

  beforeAll(() => {
    request = jest.fn();
    request.on = jest.fn();
    request.end = jest.fn();    

    Object.assign(request, req);
  })

  test('process sends http request', () => {
    let actual;
    let httpService = new HttpService(); 

    http.request.mockImplementation((options, callback)=> {
      actual = options;
      return request;
    })

    httpService.process(httpActivity);

    let expected = {
      hostname: httpActivity.hostname,
      path: httpActivity.path,
      port: httpActivity.port,
      method: httpActivity.method
    };

    expect(actual).toEqual(expected);
    expect(request.end).toBeCalled();
  });

  test('process logs network object', () => {
    let actual;
    let httpService = new HttpService();
    let expected = new NetworkLog({
      destination: `${req.socket.remoteAddress}:${req.socket.remotePort}`,
      source: `${req.socket.localAddress}:${req.socket.localPort}`,
      dataSize: `${req.socket.bytesWritten} bytes`,
      protocol: req.agent.protocol,
    });

    let callback;

    http.request.mockImplementation((options, cb) => {
      callback = cb;
      return request;      
    });  

    logger.log.mockImplementation(log => {      
      actual = log;
      actual.timestamp = expected.timestamp;
    });

    httpService.process(httpActivity);

    callback();

    expect(actual).toMatchObject(expected);    
    expect(logger.log).toBeCalled();
  });

  test('logs network log object to logger', () => {
    let actual;
    let httpService = new HttpService();
    
    let expected = new NetworkLog({
      destination: `${req.socket.remoteAddress}:${req.socket.remotePort}`,
      source: `${req.socket.localAddress}:${req.socket.localPort}`,
      dataSize: `${req.socket.bytesWritten} bytes`,
      protocol: req.agent.protocol,
    });

    logger.log.mockImplementation(log => {      
      actual = log;
      actual.timestamp = expected.timestamp;
    });

    httpService.logNetworkActivity(req);

    expect(actual).toMatchObject(expected);
    expect(logger.log).toBeCalled();
  });    
});
