'use strict';

const Activity  = require( './activity');
const ActivityTypes = require( '../enums/activity_types');

module.exports = class ApplicationProcessActivity extends Activity {
  constructor(activity) {
    super(ActivityTypes.APPLICATION_PROCESS);

    this.path = '';
    this.args = [];

    Object.assign(this, activity); 
  }
}
