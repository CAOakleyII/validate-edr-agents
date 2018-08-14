'use strict';

const ActivityTypes = require('../enums/activity_types');

module.exports = class Activity {
  constructor(activityType) {
    this.activityType = activityType ? activityType : ActivityTypes.UNKNOWN;
  }
}