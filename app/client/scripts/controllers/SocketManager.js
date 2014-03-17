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
   * @param {Message} message
   */
  function receivedMessage(message) {


    log.i('receivedMessage', 'message.rawText=' + message.rawText);

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
  }

  /**
   *
   * @function SocketManager#sendMessage
   * @param {Message} message
   */
  function sendMessage(message) {


    log.i('sendMessage', 'message.rawText=' + message.rawText);

    // TODO:
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
   */
  function SocketManager() {
    var socketManager = this;

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
