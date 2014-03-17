/**
 * This module defines a constructor for ChatBotManager objects.
 * @module ChatBotManager
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var params, util, log, ChatBot;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   *
   * @function ChatBotManager#addChatBot
   */
  function addChatBot() {
    var chatBotManager, botName, bot;

    chatBotManager = this;
    botName = ChatManager.generateRandomUserName(true);

    log.d('addChatBot', 'name=' + botName);

    bot = new ChatBot(chatBotManager, botName);
    chatBotManager.bots.push(bot);
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function ChatBotManager.initStaticFields
   */
  function initStaticFields() {
    params = app.params;
    util = app.util;
    log = new app.Log('ChatBotManager');
    ChatBot = app.ChatBot;
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {ChatManager} chatManager
   */
  function ChatBotManager(chatManager) {
    var chatBotManager = this;

    chatBotManager.chatManager = chatManager;
    chatBotManager.bots = [];
    chatBotManager.addChatBot = addChatBot;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.ChatBotManager = ChatBotManager;
  ChatBotManager.initStaticFields = initStaticFields;

  console.log('ChatBotManager module loaded');
})();
