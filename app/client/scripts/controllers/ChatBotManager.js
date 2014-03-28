/**
 * This module defines a constructor for ChatBotManager objects.
 * @module ChatBotManager
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var params, util, log, ChatManager, ChatBot;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @function ChatBotManager~handleHeartbeatRequest
   * @param {Message} message
   */
  function handleHeartbeatRequest(message) {
    var inMessageManager, userName, user;

    inMessageManager = this;
    userName = message.arguments[0];

    log.v('handleHeartbeatRequest', 'userName=' + userName);

    user = inMessageManager.chatManager.getUserFromName(userName);

    inMessageManager.socketManager.outMessageManager.sendHeartbeat(user);
  }

  /**
   *
   * @function InMessageManager~getBotByName
   * @param {String} name
   * @returns {ChatBot}
   */
  function getBotByName(name) {
    var chatBotManager, i, count;
    chatBotManager = this;

    for (i = 0, count = chatBotManager.bots.length; i < count; i++) {
      if (chatBotManager.bots[i].name === name) {
        return chatBotManager.bots[i];
      }
    }

    return null;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * @function ChatBotManager#addChatBot
   */
  function addChatBot() {
    var chatBotManager, botName, bot;

    chatBotManager = this;
    botName = ChatManager.generateRandomUserName(true);

    log.d('addChatBot', 'name=' + botName);

    bot = new ChatBot(botName, chatBotManager);
    chatBotManager.bots.push(bot);
  }

  /**
   * @function ChatBotManager#removeChatBot
   * @params {ChatBot} chatBot
   */
  function removeChatBot(chatBot) {
    var chatBotManager, i, count;
    chatBotManager = this;

    log.d('removeChatBot', 'name=' + chatBot.name);

    for (i = 0, count = chatBotManager.bots.length; i < count; i++) {
      if (chatBotManager.bots[i] === chatBot) {
        chatBotManager.bots.splice(i, 1);
        return;
      }
    }
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
    ChatManager = app.ChatManager;
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
    chatBotManager.removeChatBot = removeChatBot;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.ChatBotManager = ChatBotManager;
  ChatBotManager.initStaticFields = initStaticFields;

  console.log('ChatBotManager module loaded');
})();
