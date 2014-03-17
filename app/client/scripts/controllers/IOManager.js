/**
 * This module defines a constructor for IOManager objects.
 * @module IOManager
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var params, util, log, InMessageManager, OutMessageManager;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   *
   * @function IOManager~receivedMessage
   * @param message
   */
  function receivedMessage(message) {


    log.i('receivedMessage', 'message.rawTex=' + message.rawText);

    // TODO:
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   *
   * @function IOManager#init
   * @param {UIManager} uiManager
   */
  function init(uiManager) {
    var ioManager = this;

    ioManager.uiManager = uiManager;
    ioManager.inMessageManager.init(uiManager.chatManager);
    ioManager.outMessageManager.init(uiManager.chatManager);
  }

  /**
   *
   * @function IOManager#sendMessage
   * @param message
   */
  function sendMessage(message) {


    log.i('sendMessage', 'message.rawTex=' + message.rawText);

    // TODO:
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function IOManager.initStaticFields
   */
  function initStaticFields() {
    params = app.params;
    util = app.util;
    log = new app.Log('IOManager');
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
  function IOManager() {
    var ioManager = this;

    ioManager.uiManager = null;
    ioManager.inMessageManager = new InMessageManager(ioManager);
    ioManager.outMessageManager = new OutMessageManager(ioManager);
    ioManager.init = init;
    ioManager.sendMessage = sendMessage;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.IOManager = IOManager;
  IOManager.initStaticFields = initStaticFields;

  console.log('IOManager module loaded');
})();
