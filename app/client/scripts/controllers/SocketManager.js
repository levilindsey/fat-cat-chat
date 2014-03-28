/**
 * This module defines a constructor for SocketManager objects.
 * @module SocketManager
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var params, util, log, InMessageManager, OutMessageManager;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @function SocketManager~receivedMessage
   * @param {Object} message
   */
  function receivedMessage(message) {
    var socketManager, rawText;

    log.socketIn('receivedMessage', 'message=' + message.message);
    socketManager = this;
    rawText = message.message;

    socketManager.inMessageManager.handleInComingMessage(rawText);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * @function SocketManager#init
   * @param {UIManager} uiManager
   */
  function init(uiManager) {
    var socketManager, bots, i, count;
    socketManager = this;

    socketManager.uiManager = uiManager;
    socketManager.inMessageManager.init(uiManager.chatManager);
    socketManager.outMessageManager.init(uiManager.chatManager);

    socketManager.socket = io.connect(socketManager.server.address);
    socketManager.socket.on('message', function (message) {
      receivedMessage.call(socketManager, message)
    });
    socketManager.socket.on('connect', function () {
      // Send the initial heartbeat to the server
      socketManager.outMessageManager.sendHeartbeat(socketManager.uiManager.chatManager.thisUser);

      // Send the initial heartbeat of any bots that were created before the server connection was established
      bots = socketManager.uiManager.chatManager.chatBotManager.bots;
      for (i = 0, count = bots.length; i < count; i++) {
        socketManager.outMessageManager.sendHeartbeat(bots[i]);
      }
    });
  }

  /**
   * @function SocketManager#sendMessage
   * @param {Message} message
   */
  function sendMessage(message) {
    var socketManager = this;

    log.socketOut('sendMessage', 'message.rawText=' + message.rawText);

    socketManager.socket.emit('message', { message: message.rawText });
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function SocketManager.initStaticFields
   */
  function initStaticFields() {
    params = app.params;
    util = app.util;
    log = new app.Log('SocketManager');
    InMessageManager = app.InMessageManager;
    OutMessageManager = app.OutMessageManager;
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {String} address The server's IP address.
   * @param {String} port The server's port.
   */
  function SocketManager(address, port) {
    var socketManager = this;

    socketManager.server = {
      address: address,
      port: port
    };
    socketManager.socket = null;
    socketManager.uiManager = null;
    socketManager.inMessageManager = new InMessageManager(socketManager);
    socketManager.outMessageManager = new OutMessageManager(socketManager);
    socketManager.init = init;
    socketManager.sendMessage = sendMessage;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.SocketManager = SocketManager;
  SocketManager.initStaticFields = initStaticFields;

  console.log('SocketManager module loaded');
})();
