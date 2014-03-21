/**
 * This module defines a constructor for User objects.
 * @module User
 */

// ------------------------------------------------------------------------------------------- //
// Private static variables

// ------------------------------------------------------------------------------------------- //
// Public static functions

// ------------------------------------------------------------------------------------------- //
// Expose this module's constructor

/**
 * @constructor
 * @global
 * @param {String} name The name of this user.
 */
function User(name) {
  var user = this;

  user.name = name;
  user.activeRoom = null;
  user.latency = Number.POSITIVE_INFINITY;
}

// Expose this module
exports = User;

console.log('User module loaded');
