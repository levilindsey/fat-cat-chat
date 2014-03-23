/**
 * This module defines a constructor for ChatManager objects.
 * @module ChatManager
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var he, params, util, log, Room, User, Message, ChatBot;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Gets references to the various Consoles.
   * @function ChatManager~setUpElements
   */
  function setUpElements() {
    var chatManager = this;

    chatManager.consoles = chatManager.uiManager.consoles;
  }

  /**
   * @function ChatManager~parseRooms
   * @param {String} text
   * @returns {String}
   */
  function parseRooms(text) {
    var chatManager = this;
    chatManager.allRooms.forEach(function (room) {
      text = text.replace(room.name, '<code class=\'room\'>' + room.name + '</code>');
    });
    return text;
  }

  /**
   * @function ChatManager~parseUsers
   * @param {String} text
   * @returns {String}
   */
  function parseUsers(text) {
    var chatManager = this;
    chatManager.allUsers.forEach(function (user) {
      text = text.replace(user.name, '<code class=\'user\'>' + user.name + '</code>');
    });
    return text;
  }

  /**
   * @function ChatManager~parseUserMessage
   * @param {String} rawText
   * @returns {Message}
   */
  function parseUserMessage(rawText) {
    var chatManager, time, htmlText;

    chatManager = this;
    time = Date.now();
    htmlText = chatManager.parseRawMessageTextForDom(rawText);

    return new Message(rawText, htmlText, null, time, 'user', null, null);
  }

  /**
   * @function ChatManager~parseRoomMessage
   * @param {String} rawText
   * @returns {Message}
   */
  function parseRoomMessage(rawText) {
    var chatManager, time, htmlText;

    chatManager = this;
    time = Date.now();
    htmlText = chatManager.parseRawMessageTextForDom(rawText);

    return new Message(rawText, htmlText, null, time, 'room', null, null);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * @function ChatManager#init
   * @param {SocketManager} socketManager
   */
  function init(socketManager) {
    var chatManager = this;

    chatManager.socketManager = socketManager;

    setUpElements.call(chatManager);
  }

  /**
   * @function ChatManager#parseRawMessageTextForDom
   * @param {String} text
   * @returns {String}
   */
  function parseRawMessageTextForDom(text) {
    var chatManager = this;

    // Encode HTML entities so that the text may be safely inserted into the HTML document
    text = he.encode(text);

    // Replace any substrings that represent commands, emoticons, current rooms, current users, or links with decorated versions
    // TODO: add event handlers to the inline elements created in each of the following functions
    text = parseCommands(text);
    text = parseEmoticons(text);
    text = parseRooms.call(chatManager, text);
    text = parseUsers.call(chatManager, text);
    // TODO: parseURLs

    // TODO: add an additional class, 'thisUser':
    // - add to the code element for the user name of this user
    // - give it an underline
    // - make sure it does NOT get the pointer cursor

    return text;
  }

  /**
   * @function ChatManager#getRoomFromName
   * @param {String} roomName
   * @returns {Room}
   */
  function getRoomFromName(roomName) {
    var chatManager, i, count;

    chatManager = this;

    for (i = 0, count = chatManager.allRooms.length; i < count; i++) {
      if (chatManager.allRooms[i].name === roomName) {
        return chatManager.allRooms[i];
      }
    }

    return null;
  }

  /**
   * @function ChatManager#getUserFromName
   * @param {String} userName
   * @returns {User}
   */
  function getUserFromName(userName) {
    var chatManager, i, count;

    chatManager = this;

    for (i = 0, count = chatManager.allUsers.length; i < count; i++) {
      if (chatManager.allUsers[i].name === userName) {
        return chatManager.allUsers[i];
      }
    }

    return null;
  }

  /**
   * @function ChatManager#parseInternalSystemMessage
   * @param {String} rawText
   * @returns {Message}
   */
  function parseInternalSystemMessage(rawText) {
    var chatManager, time, htmlText;

    chatManager = this;
    time = Date.now();
    htmlText = chatManager.parseRawMessageTextForDom(rawText);

    return new Message(rawText, htmlText, null, time, 'system', null, null);
  }

  /**
   * @function ChatManager#showPrivateMessage
   * @param {Message} message
   * @param {User} privateChatUser
   */
  function showPrivateMessage(message, privateChatUser) {
    var chatManager;

    chatManager = this;

    // Show the message
    chatManager.consoles.privateMessages.addMessage(message);

    chatManager.uiManager.textBoxes.privateMessages.textBox.focus();

    chatManager.thisUser.privateChatUser = privateChatUser;
    privateChatUser.privateMessages.push(message);

    // TODO:
    // - add the logic to position the private message console onResize
    // - add the logic to toggle the private message console visibility
    // - show the private message console here
    // - change the header of the private message console to show the private chat user's name
    // - make sure I add some way of closing the private message console (an 'X' button in the top-right corner?)
    // - if this is a new private chat user, then show all of the messages contained the user's list
    // - switch out the panel state if this is not the same private chat user as the last message
  }

  /**
   * @function ChatManager#matchLocalStateToServer
   * @param {Array.<String>} allRoomNames
   * @param {Array.<String>} allUserNames
   * @param {String} currentRoomName
   * @param {Array.<String>} userNamesInRoom
   */
  function matchLocalStateToServer(allRoomNames, allUserNames, currentRoomName, userNamesInRoom) {
    var chatManager, i, count, time, currentRoom;

    chatManager = this;
    time = Date.now();

    for (i = 0, count = allRoomNames.length; i < count; i++) {
      if (!chatManager.getRoomFromName(allRoomNames[i].name)) {
        chatManager.addRoom(new User(allRoomNames[i].name, time));
      }
    }

    for (i = 0, count = allUserNames.length; i < count; i++) {
      if (!chatManager.getUserFromName(allUserNames[i].name)) {
        chatManager.addUser(new User(allUserNames[i].name, time));
      }
    }

    if (chatManager.thisUser.activeRoom.name === currentRoomName) {
      currentRoom = chatManager.getRoomFromName(currentRoomName);

      for (i = 0, count = userNamesInRoom.length; i < count; i++) {
        if (!currentRoom.getUserFromName(userNamesInRoom[i].name)) {
          chatManager.addUserToRoom(userNamesInRoom[i], currentRoom);
        }
      }
    }
  }

  /**
   * @function ChatManager#addRoom
   * @param {Room} room
   */
  function addRoom(room) {
    var chatManager, message;

    chatManager = this;
    log.d('addRoom', 'roomName=' + room.name);

    chatManager.allRooms.push(room);

    message = parseRoomMessage.call(chatManager, room.name);

    chatManager.consoles.directoryRooms.addMessage(message);
  }

  /**
   * @function ChatManager#removeRoom
   * @param {Room} room
   */
  function removeRoom(room) {
    var chatManager, index;

    chatManager = this;
    log.d('removeRoom', 'roomName=' + room.name);

    index = findIndexByPropertyValue(chatManager.allRooms, 'name', room.name);

    if (index >= 0) {
      chatManager.allRooms.splice(index, 1);
    }

    chatManager.consoles.directoryRooms.removeMessageByRawText(room.name);
  }

  /**
   * @function ChatManager#addUser
   * @param {User} user
   */
  function addUser(user) {
    var chatManager, message;

    chatManager = this;
    log.d('addUser', 'userName=' + user.name);

    chatManager.allUsers.push(user);

    message = parseUserMessage.call(chatManager, user.name);

    chatManager.consoles.directoryUsers.addMessage(message);
  }

  /**
   * @function ChatManager#removeUser
   * @param {User} user
   */
  function removeUser(user) {
    var chatManager, index;

    chatManager = this;
    log.d('removeUser', 'userName=' + user.name);

    index = findIndexByPropertyValue(chatManager.allUsers, 'name', user.name);

    if (index >= 0) {
      chatManager.allUsers.splice(index, 1);
    }

    chatManager.consoles.directoryUsers.removeMessageByRawText(user.name);
  }

  /**
   * @function ChatManager#addUserToRoom
   * @param {User} user
   * @param {Room} room
   */
  function addUserToRoom(user, room) {
    var chatManager, message;

    chatManager = this;
    log.d('addUserToRoom', 'userName=' + user.name + ', roomName=' + room.name);

    room.users.push(user);

    message = parseUserMessage.call(chatManager, user.name);

    chatManager.consoles.chatRoomUsers.addMessage(message);
  }

  /**
   * @function ChatManager#removeUserFromRoom
   * @param {User} user
   * @param {Room} room
   */
  function removeUserFromRoom(user, room) {
    var chatManager, index;

    chatManager = this;
    log.d('removeUserFromRoom', 'userName=' + user.name + ', roomName=' + room.name);

    index = findIndexByPropertyValue(room.users, 'name', user.name);

    if (index >= 0) {
      room.users.splice(index, 1);
    }

    chatManager.consoles.chatRoomUsers.removeMessageByRawText(user.name);
  }

  /**
   * @function ChatManager#changeUserName
   * @param {User} user
   * @param {String} newName
   */
  function changeUserName(user, newName) {
    var chatManager, oldName;

    chatManager = this;
    oldName = user.name;
    user.name = newName;

    log.d('changeUserName', 'oldName=' + oldName + ', newName=' + newName);

    chatManager.consoles.directoryUsers.changeMessageRawText(oldName, newName);
    chatManager.consoles.chatRoomUsers.changeMessageRawText(oldName, newName);
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * @function ChatManager~findIndexByPropertyValue
   * @param {Array.<Object>} array
   * @param {String} key
   * @param {*} value
   * @returns {Number}
   */
  function findIndexByPropertyValue(array, key, value) {
    var i, count;

    for (i = 0, count = array.length; i < count; i++) {
      if (array[i][key] === value) {
        return i;
      }
    }

    return -1;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function ChatManager.initStaticFields
   */
  function initStaticFields() {
    he = app.he;
    params = app.params;
    util = app.util;
    log = new app.Log('ChatManager');
    Room = app.Room;
    User = app.User;
    Message = app.Message;
    ChatBot = app.ChatBot;
    log.d('initStaticFields', 'Module initialized');
  }

  /**
   * @function ChatManager.parseCommands
   * @param {String} text
   * @returns {String}
   */
  function parseCommands(text) {
    var property;

    // TODO: replace /link commands with <a> elements (use params.LINK_COMMAND)

    for (property in params.OUT_COMMANDS) {
      text =
          text.replace(params.OUT_COMMANDS[property].rawString,
              params.OUT_COMMANDS[property].htmlElement);
    }

    return text;
  }

  /**
   * @function ChatManager.parseEmoticons
   * @param {String} text
   * @returns {String}
   */
  function parseEmoticons(text) {
    var property, rawArray, html, i, count;

    for (property in params.EMOTICONS) {
      rawArray = params.EMOTICONS[property].raw;
      html = params.EMOTICONS[property].html;

      for (i = 0, count = rawArray.length; i < count; i++) {
        text = text.replace(rawArray[i], html);
      }
    }

    return text;
  }

  /**
   * @function ChatManager.generateRandomUserName
   * @param {Boolean} isBot
   * @returns {String}
   */
  function generateRandomUserName(isBot) {
    var prefix = isBot ? 'catBot' : 'coolCat';
    return prefix + parseInt(Math.random() * 100000000);
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {UIManager} uiManager
   */
  function ChatManager(uiManager) {
    var chatManager = this;

    chatManager.uiManager = uiManager;
    chatManager.socketManager = null;
    chatManager.thisUser = new User(generateRandomUserName(false), Date.now());
    chatManager.allUsers = [];
    chatManager.allRooms = [];
    chatManager.consoles = null;

    chatManager.init = init;
    chatManager.getRoomFromName = getRoomFromName;
    chatManager.getUserFromName = getUserFromName;
    chatManager.parseRawMessageTextForDom = parseRawMessageTextForDom;
    chatManager.parseInternalSystemMessage = parseInternalSystemMessage;
    chatManager.showPrivateMessage = showPrivateMessage;
    chatManager.matchLocalStateToServer = matchLocalStateToServer;
    chatManager.addRoom = addRoom;
    chatManager.removeRoom = removeRoom;
    chatManager.addUser = addUser;
    chatManager.removeUser = removeUser;
    chatManager.addUserToRoom = addUserToRoom;
    chatManager.removeUserFromRoom = removeUserFromRoom;
    chatManager.changeUserName = changeUserName;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.ChatManager = ChatManager;
  ChatManager.initStaticFields = initStaticFields;
  ChatManager.parseCommands = parseCommands;
  ChatManager.parseEmoticons = parseEmoticons;
  ChatManager.generateRandomUserName = generateRandomUserName;

  console.log('ChatManager module loaded');
})();
