/**
 * This module defines a constructor for User objects.
 * @module User
 */

/**
 * @constructor
 * @global
 * @param {String} name The name of this user.
 * @param {Boolean} isBot True if this user represents a ChatBot.
 * @param {Number} socketId The socket ID of this user.
 */
module.exports = function User(name, isBot, socketId) {
  var user, heartbeatRequestSentTime, heartbeatReceivedTime, latency;

  user = this;
  heartbeatRequestSentTime = Number.NEGATIVE_INFINITY;
  heartbeatReceivedTime = Number.NEGATIVE_INFINITY;
  latency = Number.POSITIVE_INFINITY;

  user.name = name;
  user.isBot = isBot;
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
