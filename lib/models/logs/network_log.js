'use strict';

const Log = require('./log');

module.exports = class NetworkLog extends Log {
  constructor(data) {
    super();

    this.destination = '';
    this.source = '';
    this.dataSize = '';
    this.protocol = '';

    Object.assign(this, data);
  }
}
