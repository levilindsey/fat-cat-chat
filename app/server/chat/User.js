/**
 * This module defines a constructor for User objects.
 * @module User
 */

/**
 * @constructor
 * @global
 * @param {String} name The name of this user.
 * @param {Number} socketId The socket ID of this user.
 */
module.exports = function User(name, socketId) {
  var user, heartbeatRequestSentTime, heartbeatReceivedTime, latency;

  user = this;
  heartbeatRequestSentTime = Number.NEGATIVE_INFINITY;
  heartbeatReceivedTime = Number.NEGATIVE_INFINITY;
  latency = Number.POSITIVE_INFINITY;

  user.name = name;
  user.socketId = socketId;
  user.lastHeartbeatTime = Date.now();
  user.roomId = -1;
  user.id = -1;

  user.onHeartbeatRequestSent = function() {
    heartbeatRequestSentTime = Date.now();
  };
  user.onHeartbeatReceived = function() {
    heartbeatReceivedTime = Date.now();
    latency = (heartbeatReceivedTime - heartbeatRequestSentTime) / 2;
  };
  user.getLatency = function() {
    return latency;
  };
}

console.log('User module loaded');
