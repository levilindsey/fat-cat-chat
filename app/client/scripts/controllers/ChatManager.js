/**
 * This module defines a constructor for ChatManager objects.
 * @module ChatManager
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var he, params, util, log, Room, User, Message, ChatBot, ChatBotManager;

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
    var chatManager, i, count, room;
    chatManager = this;

    for (i = 0, count = chatManager.allRooms.length; i < count; i++) {
      room = chatManager.allRooms[i];
      text = text.replace(room.nameRegex, '<code class=\"room\" onclick=\"app.chatManager.onRoomNameClick(\'' + room.name + '\')\" tooltip=\"Click to join chat room\">' + room.name + '</code>');
    }

    return text;
  }

  /**
   * @function ChatManager~parseUsers
   * @param {String} text
   * @returns {String}
   */
  function parseUsers(text) {
    var chatManager, i, count, user;
    chatManager = this;

    for (i = 0, count = chatManager.allUsers.length; i < count; i++) {
      user = chatManager.allUsers[i];
      if (user === chatManager.thisUser) {
        text = text.replace(user.nameRegex, '<code class=\"user thisUser\" tooltip=\"This is you!\">' + user.name + '</code>');
      } else {
        text = text.replace(user.nameRegex, '<code class=\"user\" onclick=\"app.chatManager.onUserNameClick(\'' + user.name + '\')\" tooltip=\"Click to open private chat\">' + user.name + '</code>');
      }
    }

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

  /**
   * @function ChatManager~monitorHeartbeat
   */
  function monitorHeartbeat() {
    var chatManager, currentTime, message;

    chatManager = this;
    currentTime = Date.now();

    // Check whether our connection has timed out
    if (currentTime - chatManager.lastServerHeartbeatTime > params.HEARTBEAT_TIMEOUT_DELAY) {
      if (chatManager.connectedToServer) {
        // Notify the user
        message = chatManager.parseInternalMessage('Server connection lost!', true);
        chatManager.consoles.chatRoomMessages.addMessage(message);
        chatManager.consoles.privateMessages.addMessage(message);
      }

      chatManager.connectedToServer = false;

      // Send a request for a new heartbeat
      chatManager.socketManager.outMessageManager.sendHeartbeatRequest();
    }
  }

  /**
   * @function ChatManager#isUserThisUserOrABot
   * @param {Room} user
   * @returns {Boolean}
   */
  function isUserThisUserOrABot(user) {
    var chatManager = this;
    return user === chatManager.thisUser || user instanceof ChatBot;
  }

  /**
   * @function ChatManager#doesRoomContainThisUserOrABot
   * @param {Room} room
   * @returns {Boolean}
   */
  function doesRoomContainThisUserOrABot(room) {
    var chatManager, i, count;

    chatManager = this;

    for (i = 0, count = room.users; i < count; i++) {
      if (isUserThisUserOrABot.call(chatManager, room.users[i])) {
        return true;
      }
    }

    return false;
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

    chatManager.thisUser = new User(generateRandomUserName(false), Date.now());
    chatManager.addUser(chatManager.thisUser);

    chatManager.lastServerHeartbeatTime = Date.now();
    setInterval(function () {
      monitorHeartbeat.call(chatManager);
    }, params.HEARTBEAT_REQUEST_INTERVAL);
  }

  /**
   * @function ChatManager#parseRawMessageTextForDom
   * @param {String} text
   * @returns {String}
   */
  function parseRawMessageTextForDom(text) {
    var chatManager, linkMatches;

    chatManager = this;
    linkMatches = [];

    // Encode HTML entities so that the text may be safely inserted into the HTML document
    text = he.encode(text);

    // Replace any substrings that represent commands, emoticons, current rooms, current users, or links with decorated versions
    text = preParseUrls(text, linkMatches);
    text = parseCommands(text);
    text = parseEmoticons(text);
    text = parseRooms.call(chatManager, text);
    text = parseUsers.call(chatManager, text);
    text = postParseUrls(text, linkMatches);

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
   * @function ChatManager#parseInternalMessage
   * @param {String} rawText
   * @param {Boolean} isError
   * @returns {Message}
   */
  function parseInternalMessage(rawText, isError) {
    var chatManager, time, htmlText, type;

    chatManager = this;
    time = Date.now();
    htmlText = chatManager.parseRawMessageTextForDom(rawText);
    type = isError ? 'error' : 'system';

    return new Message(rawText, htmlText, null, time, type, null, null);
  }

  /**
   * @function ChatManager#showPrivateMessage
   * @param {Message|null} message If message is null, then the private chat window will be opened to the given private user with no message sent.
   * @param {User} privateChatUser
   */
  function showPrivateMessage(message, privateChatUser) {
    var chatManager;

    chatManager = this;

    // Don't do anything if the private chat user does not exist
    if (privateChatUser) {
      if (message) {
        // Show the message
        chatManager.consoles.privateMessages.addMessage(message);
        privateChatUser.privateMessages.push(message);
      }

      // Switch out the panel state if this is not the same private chat user as the last message
      if (privateChatUser !== chatManager.thisUser.privateChatUser) {
        // TODO: it would be better to actually leave this closed, and simply add a flashy animation to the panel header (and then also add this animation for messages from the same, old user)
        // Expand the private message panel
        util.toggleClass(chatManager.uiManager.panels.privateChat.container, 'closed', false);

        // Update the panel header to match the current private user's name
        chatManager.consoles.privateMessages.setTitle(privateChatUser.name);

        // Show any previous messages from a conversation with this new private user
        chatManager.consoles.privateMessages.replaceMessages(privateChatUser.privateMessages);
      }

      // Show the private message panel
      util.toggleClass(chatManager.uiManager.panels.privateChat.container, 'hidden', false);

      chatManager.uiManager.textBoxes.privateMessages.textBox.focus();

      chatManager.thisUser.privateChatUser = privateChatUser;

      // TODO:
      // - make sure I add some way of closing the private message console (an 'X' button in the top-right corner?)
    }
  }

  /**
   * @function ChatManager#syncLocalStateToServer
   * @param {Array.<String>} allRoomNames
   * @param {Array.<String>} allUserNames
   * @param {String} currentRoomName
   * @param {Array.<String>} userNamesInRoom
   */
  function syncLocalStateToServer(allRoomNames, allUserNames, currentRoomName, userNamesInRoom) {
    var chatManager, i, count, time, currentRoom, user;

    chatManager = this;
    time = Date.now();

    // --- Sync rooms in server --- //

    // Add any rooms the client is missing
    for (i = 0, count = allRoomNames.length; i < count; i++) {
      if (!chatManager.getRoomFromName(allRoomNames[i])) {
        log.d('syncLocalStateToServer', 'Adding room: ' + allRoomNames[i]);
        chatManager.addRoom(new Room(allRoomNames[i], [], time));
      }
    }

    // Remove any extra rooms the client has
    for (i = 0; i < chatManager.allRooms.length; i++) {
      if (allRoomNames.indexOf(chatManager.allRooms[i].name) < 0 &&
          !doesRoomContainThisUserOrABot.call(chatManager, chatManager.allRooms[i])) {
        log.d('syncLocalStateToServer', 'Removing room: ' + chatManager.allRooms[i]);
        chatManager.removeRoom(chatManager.allRooms[i]);
      }
    }

    // --- Sync users in server --- //

    // Add any users the client is missing
    for (i = 0, count = allUserNames.length; i < count; i++) {
      if (!chatManager.getUserFromName(allUserNames[i])) {
        log.d('syncLocalStateToServer', 'Adding user: ' + allUserNames[i]);
        chatManager.addUser(new User(allUserNames[i], time));
      }
    }

    // Remove any extra users the client has
    for (i = 0; i < chatManager.allUsers.length; i++) {
      if (allUserNames.indexOf(chatManager.allUsers[i].name) < 0 &&
          !isUserThisUserOrABot.call(chatManager, chatManager.allUsers[i])) {
        log.d('syncLocalStateToServer', 'Removing user: ' + chatManager.allUsers[i]);
        chatManager.removeUser(chatManager.allUsers[i]);
      }
    }

    // --- Sync users in room --- //

    // Check whether the rooms match
    if (chatManager.thisUser.room && chatManager.thisUser.room.name === currentRoomName) {
      currentRoom = chatManager.getRoomFromName(currentRoomName);

      // Add any users the client is missing to the room
      for (i = 0, count = userNamesInRoom.length; i < count; i++) {
        if (!currentRoom.getUserFromName(userNamesInRoom[i])) {
          // Don't create the user if she already existed
          user = chatManager.getUserFromName(userNamesInRoom[i]);
          if (!user) {
            log.d('syncLocalStateToServer',
                'Adding NEW user to room: userName=' + userNamesInRoom[i] + ', roomName=' +
                    currentRoomName);
            user = new User(userNamesInRoom[i], time);
          } else {
            log.d('syncLocalStateToServer',
                'Adding OLD user to room: userName=' + userNamesInRoom[i] + ', roomName=' +
                    currentRoomName);
          }

          chatManager.addUserToRoom(user, currentRoom);
        }
      }

      // Remove any extra users the client has in the room
      for (i = 0; i < currentRoom.users.length; i++) {
        if (userNamesInRoom.indexOf(currentRoom.users[i].name) < 0 &&
            !isUserThisUserOrABot.call(chatManager, currentRoom.users[i])) {
          log.d('syncLocalStateToServer',
              'Removing user from room: userName=' + currentRoom.users[i].name + ', roomName=' +
                  currentRoomName);
          chatManager.removeUserFromRoom(currentRoom.users[i], currentRoom);
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
    chatManager.consoles.directoryRooms.setTitle('Rooms (' + chatManager.allRooms.length + ')');
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
    chatManager.consoles.directoryRooms.setTitle('Rooms (' + chatManager.allRooms.length + ')');
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
    chatManager.consoles.directoryUsers.setTitle('Users (' + chatManager.allUsers.length + ')');
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
    chatManager.consoles.directoryUsers.setTitle('Users (' + chatManager.allUsers.length + ')');

    if (user === chatManager.thisUser.privateChatUser) {
      chatManager.thisUser.privateChatUser = null;
    }

    if (user instanceof ChatBot) {
      chatManager.chatBotManager.removeChatBot(user);
    }
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

    if (room.users.indexOf(user) < 0) {
      room.users.push(user);

      message = parseUserMessage.call(chatManager, user.name);

      chatManager.consoles.chatRoomUsers.addMessage(message);
      chatManager.consoles.chatRoomUsers.setTitle('Users (' + room.users.length + ')');
    } else {
      log.w('addUserToRoom', 'Room already contained user');
    }
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
    chatManager.consoles.chatRoomUsers.setTitle('Users (' + room.users.length + ')');
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
    user.setName(newName);

    log.d('changeUserName', 'oldName=' + oldName + ', newName=' + newName);

    chatManager.consoles.directoryUsers.changeMessageRawText(oldName, newName);
    chatManager.consoles.chatRoomUsers.changeMessageRawText(oldName, newName);

    if (user === chatManager.thisUser.privateChatUser) {
      chatManager.consoles.privateMessages.setTitle(user.name);
    }
  }

  /**
   * @function ChatManager#onUserNameClick
   * @param {String} userName
   */
  function onUserNameClick(userName) {
    var chatManager, privateChatUser;
    chatManager = this;
    privateChatUser = chatManager.getUserFromName(userName);
    chatManager.showPrivateMessage(null, privateChatUser);
  }

  /**
   * @function ChatManager#onRoomNameClick
   * @param {String} roomName
   */
  function onRoomNameClick(roomName) {
    var chatManager = this;
    chatManager.uiManager.socketManager.outMessageManager.joinRoom(roomName, null, null);
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
    ChatBotManager = app.ChatBotManager;
    log.d('initStaticFields', 'Module initialized');
  }

  /**
   * @function ChatManager.parseCommands
   * @param {String} text
   * @returns {String}
   */
  function parseCommands(text) {
    var property;

    for (property in params.OUT_COMMANDS) {
      text =
          text.replace(params.OUT_COMMANDS[property].replacementRegex,
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
    var rawArray, html, i, j, iCount, jCount;

    for (i = 0, iCount = params.EMOTICONS.length; i < iCount; i++) {
      rawArray = params.EMOTICONS[i].replacementRegexes;
      html = params.EMOTICONS[i].html;

      for (j = 0, jCount = rawArray.length; j < jCount; j++) {
        text = text.replace(rawArray[j], html);
      }
    }

    return text;
  }

  /**
   * @function ChatManager.preParseUrls
   * @param {String} text
   * @param {Array.<Object>} linkMatches
   * @returns {String}
   */
  function preParseUrls(text, linkMatches) {
    var linkMatch;

    // Escape the characters used in our special link replacement string
    text = text.replace(params.LINK_REPLACEMENT.toEscapeRegex, params.LINK_REPLACEMENT.escapeWithString);

    // Record the links and replace them with a special character combination
    return text.replace(params.LINK_REPLACEMENT.linkRegex, function(match, group1, group2, group3) {
      if (group1) {
        linkMatch = {
          url: group1,
          linkText: group2
        };
      } else { // group3
        linkMatch = {
          url: group3,
          linkText: group3
        };
      }
      linkMatches.push(linkMatch);
      return params.LINK_REPLACEMENT.replacementString;
    });
  }

  /**
   * @function ChatManager.preParseUrls
   * @param {String} text
   * @param {Array.<Object>} linkMatches
   * @returns {String}
   */
  function postParseUrls(text, linkMatches) {
    var i, linkString;
    i = 0;

    // Replace occurrences of our special link replacement string with the actual HTML link elements
    text = text.replace(params.LINK_REPLACEMENT.replacementRegex, function() {
      linkString = '<a href=\"' + linkMatches[i].url + '\" target=\"_blank\">' + linkMatches[i].linkText + '</a>';
      i++;
      return linkString;
    });

    // Un-escape the original occurrences of our special link replacement characters
    return text.replace(params.LINK_REPLACEMENT.escapeWithRegex, params.LINK_REPLACEMENT.toEscapeString);
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
    chatManager.chatBotManager = new ChatBotManager(chatManager);
    chatManager.socketManager = null;
    chatManager.thisUser = null;
    chatManager.allUsers = [];
    chatManager.allRooms = [];
    chatManager.consoles = null;
    chatManager.lastServerHeartbeatTime = Number.NEGATIVE_INFINITY;
    chatManager.connectedToServer = false;

    chatManager.init = init;
    chatManager.getRoomFromName = getRoomFromName;
    chatManager.getUserFromName = getUserFromName;
    chatManager.parseRawMessageTextForDom = parseRawMessageTextForDom;
    chatManager.parseInternalMessage = parseInternalMessage;
    chatManager.showPrivateMessage = showPrivateMessage;
    chatManager.syncLocalStateToServer = syncLocalStateToServer;
    chatManager.addRoom = addRoom;
    chatManager.removeRoom = removeRoom;
    chatManager.addUser = addUser;
    chatManager.removeUser = removeUser;
    chatManager.addUserToRoom = addUserToRoom;
    chatManager.removeUserFromRoom = removeUserFromRoom;
    chatManager.changeUserName = changeUserName;
    chatManager.onUserNameClick = onUserNameClick;
    chatManager.onRoomNameClick = onRoomNameClick;
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
