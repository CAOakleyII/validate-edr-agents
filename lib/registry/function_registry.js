'use strict';

module.exports = class FunctionRegistry {
  constructor() {
    this.values = {};
  }
  /**
   * 
   * @param {string} name - Key to the function being stored
   * @param {*} value - The function object to be invoked
   * 
   */
  register(name, value) {
    this.values[name] = value;
  }
  /**
   * 
   * @param {string} name - The key of the function to be invoked
   * @param {Array of Objects} args - Argument(s) to be passed to the invoked function
   */
  invoke(name, ...args) {
    var value = this.values[name];
    if (value) {
      value(...args);
    } else {
      throw new Error(`${name} is not registered within the function registry.`);
    }
  }
}