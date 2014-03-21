/**
 * This module defines a constructor for messageManager objects.
 * @module messageManager
 */

// ------------------------------------------------------------------------------------------- //
// Private static variables

// ------------------------------------------------------------------------------------------- //
// Private static functions

/**
 *
 * @function messageManager#receivedMessage
 * @param {Object} message
 */
function receivedMessage(message) {
  var rawText;

  rawText = message.message;

  console.log('messageManager.receivedMessage: rawText=' + rawText);

  // TODO:
}

// ------------------------------------------------------------------------------------------- //
// Public static functions

/**
 *
 * @function messageManager.init
 */
function init(chatManager) {
  messageManager.chatManager = chatManager;

  // TODO: set up the socket.io logic
}

/**
 *
 * @function messageManager.connectionHandler
 * @param {Object} socket
 */
function connectionHandler(socket) {
  var address;

  address = socket.handshake.address;
  console.log('messageManager.connectionHandler: ' + address.address + ':' + address.port);

  socket.on('message', receivedMessage);
  messageManager.chatManager.onNewConnection(socket);
}

/**
 *
 * @function messageManager.sendMessage
 * @param {socket} socket
 * @param {String} text
 */
function sendMessage(socket, text) {
  var message;

  console.log('messageManager.sendMessage: socket=' + socket + ', text=' + text);

  // TODO:

  message = {
    message: text
  };

  // unicast(socket, message);
  messageManager.broadcast(message);
}

// ------------------------------------------------------------------------------------------- //
// Expose this static module

/**
 * @global
 */
var messageManager = {
  chatManager: null,
  init: init,
  sendMessage: sendMessage,
  connectionHandler: connectionHandler,
  broadcast: null,
  unicast: null
};

// Expose this module
module.exports = messageManager;

console.log('messageManager module loaded');
