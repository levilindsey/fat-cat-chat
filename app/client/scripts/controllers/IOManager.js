/**
 * This module defines a constructor for IOManager objects.
 * @module IOManager
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var params, util, log;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   *
   * @function IOManager#sendMessage
   * @param message
   */
  function sendMessage(message) {
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
    log.d('initStaticFields', 'Module initialized');
  }


  function parseOutGoingMessage(text, thisUser, activeRoom, privateChatUser, isPrivateMessage) {

  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   */
  function IOManager() {
    var ioManager = this;

    ioManager.sendMessage = sendMessage;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.IOManager = IOManager;
  IOManager.initStaticFields = initStaticFields;
  IOManager.parseOutGoingMessage = parseOutGoingMessage;

  console.log('IOManager module loaded');
})();
