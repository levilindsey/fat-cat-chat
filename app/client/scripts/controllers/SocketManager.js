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
   *
   * @function SocketManager~receivedMessage
   * @param {Object} message
   */
  function receivedMessage(message) {
    var rawText;

    rawText = message.message;

    log.i('receivedMessage', 'rawText=' + rawText);

    // TODO:
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   *
   * @function SocketManager#init
   * @param {UIManager} uiManager
   */
  function init(uiManager) {
    var socketManager = this;

    socketManager.uiManager = uiManager;
    socketManager.inMessageManager.init(uiManager.chatManager);
    socketManager.outMessageManager.init(uiManager.chatManager);

    socketManager.socket = io.connect(socketManager.server.address);
    socketManager.socket.on('message', receivedMessage);
  }

  /**
   *
   * @function SocketManager#sendMessage
   * @param {Message} message
   */
  function sendMessage(message) {
    var socketManager = this;

    log.i('sendMessage', 'message.rawText=' + message.rawText);

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

  /**
   *
   * @function SocketManager.extractHostNameFromUrl
   * @param {String} url
   */
  function extractHostNameFromUrl(url) {
    var index;

    index = url.indexOf(':');

    return index >= 0 ? url.substr(0, index) : url;
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
      address: extractHostNameFromUrl(address),
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