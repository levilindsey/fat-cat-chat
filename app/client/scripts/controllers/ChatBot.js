/**
 * This module defines a constructor for ChatBot objects.
 * @module ChatBot
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var params, util, log, User;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  function sendCatGif() {
    // TODO:
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function ChatBot.initStaticFields
   */
  function initStaticFields() {
    params = app.params;
    util = app.util;
    log = new app.Log('ChatBot');
    User = app.User;
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {String} name
   * @param {ConsoleManager} consoleManager
   */
  function ChatBot(name, consoleManager) {
    var chatBot = this;

    chatBot.user = new User(name, Date.now());
    chatBot.consoleManager = consoleManager;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.ChatBot = ChatBot;
  ChatBot.initStaticFields = initStaticFields;

  console.log('ChatBot module loaded');
})();
