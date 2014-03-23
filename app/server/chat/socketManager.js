/**
 * This module defines a constructor for socketManager objects.
 * @module socketManager
 */

// ------------------------------------------------------------------------------------------- //
// Private static variables

var broadcast, unicast;

// ------------------------------------------------------------------------------------------- //
// Private static functions

/**
 * @function socketManager~onNewMessage
 * @param {Object} socket
 * @param {Object} message
 */
function onNewMessage(socket, message) {
  var text = message.message;

  console.log('-->onNewMessage: text=' + text);

  socketManager.chatManager.handleNewMessage(socket.fatCatChatSocketId, text);
}

// ------------------------------------------------------------------------------------------- //
// Public static functions

/**
 * @function socketManager.init
 */
function init(chatManager) {
  socketManager.chatManager = chatManager;
}

/**
 * @function socketManager.connectionHandler
 * @param {Object} socket
 */
function connectionHandler(socket) {
  var address, socketId;

  address = socket.handshake.address;
  console.log('|-|connectionHandler: ' + address.address + ':' + address.port);

  socket.on('message', function(message) {
    onNewMessage(socket, message);
  });
  socketId = socketManager.chatManager.handleNewConnection(socket);
  socket.fatCatChatSocketId = socketId;
}

/**
 * @function socketManager.unicastMessage
 * @param {Object} socket
 * @param {String} text
 */
function unicastMessage(socket, text) {
  var message;

  console.log('<--unicastMessage: socketId=' + socket.fatCatChatSocketId + ', text=' + text);

  message = {
    message: text
  };

  unicast(socket, message);
}

/**
 * @function socketManager.broadcastMessage
 * @param {String} text
 */
function broadcastMessage(text) {
  var message;

  console.log('<--broadcastMessage: text=' + text);

  message = {
    message: text
  };

  broadcast(message);
}

/**
 * @function socketManager.setBroadcastFunction
 * @param {Function} broadcastFunction
 */
function setBroadcastFunction(broadcastFunction) {
  broadcast = broadcastFunction;
}

/**
 * @function socketManager.setUnicastFunction
 * @param {Function} unicastFunction
 */
function setUnicastFunction(unicastFunction) {
  unicast = unicastFunction;
}

// ------------------------------------------------------------------------------------------- //
// Expose this static module

/**
 * @global
 */
var socketManager = {
  chatManager: null,
  init: init,
  unicastMessage: unicastMessage,
  broadcastMessage: broadcastMessage,
  connectionHandler: connectionHandler,
  setBroadcastFunction: setBroadcastFunction,
  setUnicastFunction: setUnicastFunction
};

// Expose this module
module.exports = socketManager;

console.log('socketManager module loaded');
