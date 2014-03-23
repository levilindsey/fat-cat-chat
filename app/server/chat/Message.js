/**
 * This module defines a constructor for Message objects.
 * @module Message
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
 * @param {String} text The text of this message.
 * @param {Number} fromUserId The ID of the user who sent this message (0 if the message is from the server).
 * @param {Number} toUserId The ID of the user to whom this message was sent (0 if the message is to the server).
 * @param {Number} roomId The ID of the room the message was sent to (0 if the message was not sent to a room).
 * @param {'none'|'help'|'rooms'|'join'|'nick'|'ping'|'ignore'|'leave'|'quit'|'heartbeat'|'msg'|'pubmsg'|'userleftroom'|'userjoinedroom'|'userleftserver'|'userjoinedserver'|'userchangedname'|'roomcreated'|'roomdestroyed'|'pong'|'heartbeatrequest'|'error'} command The message command type.
 * @param {Array.<String>} [arguments] The different arguments used with this command.
 */
module.exports = function Message(text, fromUserId, toUserId, roomId, command, arguments) {
  var message = this;

  message.text = text;
  message.fromUserId = fromUserId;
  message.toUserId = toUserId;
  message.roomId = roomId;
  message.command = command;
  message.arguments = arguments;
  message.time = Date.now();
  message.id = -1;
}

console.log('Message module loaded');
