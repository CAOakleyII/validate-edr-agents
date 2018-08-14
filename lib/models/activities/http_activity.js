'use strict';

const Activity  = require( './activity');
const ActivityTypes = require( '../enums/activity_types');

module.exports = class HttpActivity extends Activity {
  constructor(activity) {
    super(ActivityTypes.HTTP);
    
    this.protocol = '';
    this.hostname = ''
    this.path = '';
    this.port  = '';
    this.method = '';
    this.body = {};    

    Object.assign(this, activity); 
  }
}