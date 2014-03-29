/**
 * This module defines a constructor for ChatBot objects.
 * @module ChatBot
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var params, util, log, actions, messageChoices, ChatManager, Message, Room, User;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @function ChatBot~actionLoop
   */
  function actionLoop() {
    var bot, delay;

    bot = this;
    delay = Math.random() * (params.BOT.ACTION_DELAY_MAX - params.BOT.ACTION_DELAY_MIN) + params.BOT.ACTION_DELAY_MIN;

    setTimeout(function() {
      actionLoop.call(bot);
      doSomething.call(bot);
    }, delay);
  }

  /**
   * @function ChatBot~doSomething
   */
  function doSomething() {
    var bot, r, index;

    bot = this;
    r = Math.random();
    index = 0;

    while (r >= actions[index].probabilityThreshold) {
      index++;
    }

    // If this wasn't a valid action for the current system state, then do something else
    if (!actions[index].action.call(bot)) {
      doSomething.call(bot);
    }
  }

  /**
   * @function ChatBot~sendPrivateMessage
   * @returns {Boolean}
   */
  function sendPrivateMessage() {
    var bot, thisUser, rawText, message;

    log.v('sendPrivateMessage');
    bot = this;

    thisUser = bot.chatBotManager.chatManager.thisUser;
    rawText = '/msg ' + bot.name + ' ' + thisUser.name + ' (' + chooseMessageText() + ')';
    message = new Message(rawText, null, bot, Date.now(), 'command', 'msg', null);
    sendMessage.call(bot, message);

    bot.privateChatUser = thisUser;

    return true;
  }

  /**
   * @function ChatBot~leaveRoom
   * @returns {Boolean}
   */
  function leaveRoom() {
    var bot, rawText, message;

    log.v('leaveRoom');
    bot = this;

//    if (bot.room) {
//      rawText = '/leave ' + bot.name + ' ' + bot.room.name;
//      message = new Message(rawText, null, bot, Date.now(), 'command', 'quit', null);
//      sendMessage.call(bot, message);
//
//      return true;
//    } else {
//      return false;
//    }
    return true;
  }

  /**
   * @function ChatBot~quit
   * @returns {Boolean}
   */
  function quit() {
    var bot, rawText, message;

    log.v('quit');
    bot = this;

//    rawText = '/quit ' + bot.name;
//    message = new Message(rawText, null, bot, Date.now(), 'command', 'quit', null);
//    sendMessage.call(bot, message);
//
//    clearInterval(bot.actionLoop);
//    bot.chatBotManager.removeChatBot(bot);
//    bot.chatBotManager.chatManager.removeUser(bot);

    return true;
  }

  /**
   * @function ChatBot~sendRoomMessage
   * @returns {Boolean}
   */
  function sendRoomMessage() {
    var bot, rawText, message;

    log.v('sendRoomMessage');
    bot = this;

    if (bot.room) {
      rawText = '/pubmsg ' + bot.name + ' ' + bot.room.name + ' (' + chooseMessageText() + ')';
      message = new Message(rawText, null, bot, Date.now(), 'command', 'pubmsg', null);
      sendMessage.call(bot, message);

      return true;
    } else {
      return false;
    }
  }

  /**
   * @function ChatBot~joinRoom
   * @returns {Boolean}
   */
  function joinRoom() {
    var bot, roomName, rawText, message, room;

    log.v('joinRoom');
    bot = this;

    roomName = chooseRoomNameToJoin.call(bot);
    rawText = '/join ' + bot.name + ' ' + roomName;
    message = new Message(rawText, null, bot, Date.now(), 'command', 'join', null);
    sendMessage.call(bot, message);

    // Create a new room if a room of this name did not already exist
    room = bot.chatBotManager.chatManager.getRoomFromName(roomName);
    if (!room) {
      room = new Room(roomName, [], Date.now());
      bot.chatBotManager.chatManager.addRoom(room);
    }

    bot.chatBotManager.chatManager.addUserToRoom(bot, room);

    return true;
  }

  /**
   * @function ChatBot~changeOwnNickname
   * @returns {Boolean}
   */
  function changeOwnNickname() {
    var bot, newName, rawText, message;

    log.v('changeOwnNickname');
    bot = this;

//    newName = ChatManager.generateRandomUserName(true);
//    rawText = '/nick ' + bot.name + ' ' + newName;
//    message = new Message(rawText, null, bot, Date.now(), 'command', 'nick', null);
//    sendMessage.call(bot, message);

    return true;
  }

  /**
   * @function ChatBot~getRandomRoom
   * @returns {Room}
   */
  function getRandomRoom() {
    var bot, index;
    bot = this;
    index = parseInt(Math.random() * bot.chatBotManager.chatManager.allRooms.length);
    return bot.chatBotManager.chatManager.allRooms[index];
  }

  /**
   * @function ChatBot~chooseRoomNameToJoin
   * @returns {String}
   */
  function chooseRoomNameToJoin() {
    var bot, room;
    bot = this;

    if (bot.chatBotManager.chatManager.allRooms.length === 0 ||
        Math.random() < params.BOT.JOIN_CREATE_NEW_ROOM_PROB) {
      return generateRandomRoomName();
    } else {
      room = getRandomRoom.call(bot);

      // Bots will only join rooms that they are not already in
      if (room !== bot.room) {
        return room.name;
      } else {
        return chooseRoomNameToJoin.call(bot);
      }
    }
  }

  /**
   * @function ChatBot~sendMessage
   * @param {Message} message
   */
  function sendMessage(message) {
    var bot = this;
    bot.chatBotManager.chatManager.socketManager.sendMessage(message);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * @function ChatBot~initActions
   */
  function initActions() {
    var probabilityThreshold;

    actions = [];
    probabilityThreshold = params.BOT.ACTION_PROBABILITIES.MSG;
    actions.push({ probabilityThreshold: probabilityThreshold, action: sendPrivateMessage });
    probabilityThreshold += params.BOT.ACTION_PROBABILITIES.LEAVE;
    actions.push({ probabilityThreshold: probabilityThreshold, action: leaveRoom });
    probabilityThreshold += params.BOT.ACTION_PROBABILITIES.QUIT;
    actions.push({ probabilityThreshold: probabilityThreshold, action: quit });
    probabilityThreshold += params.BOT.ACTION_PROBABILITIES.PUBMSG;
    actions.push({ probabilityThreshold: probabilityThreshold, action: sendRoomMessage });
    probabilityThreshold += params.BOT.ACTION_PROBABILITIES.JOIN;
    actions.push({ probabilityThreshold: probabilityThreshold, action: joinRoom });
    probabilityThreshold += params.BOT.ACTION_PROBABILITIES.NICK;
    actions.push({ probabilityThreshold: probabilityThreshold, action: changeOwnNickname });

    messageChoices = [];
    probabilityThreshold = params.BOT.MSG_CAT_GIF_PROB;
    messageChoices.push({ probabilityThreshold: probabilityThreshold, action: chooseCatGif });
    probabilityThreshold += params.BOT.MSG_EMOTICON_PROB;
    messageChoices.push({ probabilityThreshold: probabilityThreshold, action: chooseEmoticon });
    probabilityThreshold += params.BOT.MSG_TEXT_PROB;
    messageChoices.push({ probabilityThreshold: probabilityThreshold, action: chooseCatFact });
  }

  /**
   * @function ChatBot~generateRandomRoomName
   */
  function generateRandomRoomName() {
    return 'room' + parseInt(Math.random() * 100000000);
  }

  /**
   * @function ChatBot~chooseMessageText
   * @returns {String}
   */
  function chooseMessageText() {
    var r, index;
    r = Math.random();
    index = 0;

    while (r >= messageChoices[index].probabilityThreshold) {
      index++;
    }

    return messageChoices[index].action();
  }

  /**
   * @function ChatBot~chooseCatGif
   * @returns {String}
   */
  function chooseCatGif() {
    var index, gifInfo;
    index = parseInt(Math.random() * params.CAT_GIFS.length);
    gifInfo = params.CAT_GIFS[index];
    return '/link ' + gifInfo.url + ' (' + gifInfo.description + ')';
  }

  /**
   * @function ChatBot~chooseEmoticon
   * @returns {String}
   */
  function chooseEmoticon() {
    var index = parseInt(Math.random() * params.EMOTICONS.length);
    return params.EMOTICONS[index].rawString;
  }

  /**
   * @function ChatBot~chooseCatFact
   * @returns {String}
   */
  function chooseCatFact() {
    var index = parseInt(Math.random() * params.CAT_FACTS.length);
    return params.CAT_FACTS[index];
  }

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
    ChatManager = app.ChatManager;
    Message = app.Message;
    User = app.User;
    Room = app.Room;

    // ChatBot inherits from User
    ChatBot.prototype = new User('username', Date.now());

    initActions();

    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {String} name
   * @param {ChatBotManager} chatBotManager
   */
  function ChatBot(name, chatBotManager) {
    var bot = this;

    User.initUserInstance(bot, name, Date.now());

    bot.chatBotManager = chatBotManager;

    // Send an initial heartbeat to let the server know this bot exists
    bot.chatBotManager.chatManager.socketManager.outMessageManager.sendHeartbeat(bot);

    // Start doing stuff
    actionLoop.call(bot);
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.ChatBot = ChatBot;
  ChatBot.initStaticFields = initStaticFields;

  console.log('ChatBot module loaded');
})();
