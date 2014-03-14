/**
 * This module defines a constructor for ConsoleManager objects.
 * @module ConsoleManager
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var he, params, util, log, Room, User, Message, IOManager, helpMessages;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Gets references to the various Consoles.
   * @function ConsoleManager~setUpElements
   */
  function setUpElements() {
    var consoleManager = this;

    consoleManager.consoles = consoleManager.uiManager.consoles;
  }

  /**
   *
   * @function ConsoleManager~printHelp
   * @param {ChatConsole} console
   */
  function printHelp(console) {
    var consoleManager = this;

    helpMessages.forEach(function (helpMessage) {
      console.addMessage(helpMessage);
    });
  }

  /**
   *
   * @function ConsoleManager~printRooms
   * @param {ChatConsole} console
   */
  function printRooms(console) {
    var consoleManager, time, message, text;

    consoleManager = this;
    time = Date.now();

    if (consoleManager.allRooms.length > 0) {
      consoleManager.allRooms.forEach(function (room) {
        message = new Message(room.name, room.name, null, time, 'room');
        console.addMessage(message);
      });
    } else {
      text = 'There are no open rooms right now.';
      message = new Message(text, text, null, time, 'system');
    }
  }

  /**
   *
   * @function ConsoleManager~showPrivateMessage
   * @param {Message} message
   */
  function showPrivateMessage(message) {
    var consoleManager = this;

    // TODO:

    consoleManager.ioManager.sendMessage(message);

    consoleManager.textBoxes.privateMessages.focus();
  }

  /**
   *
   * @function ConsoleManager~pingUser
   * @param {String} userName
   * @param {Message} message
   * @param {ChatConsole} console
   */
  function pingUser(userName, message, console) {
    var consoleManager, time, rawText, parsedText, clientMessage;
    consoleManager = this;
    time = Date.now();

    if (getUserFromName(userName) === null) {
      // There is no user with this name

      rawText = 'There is no user with the name ' + userName;
    } else {
      // Ping the user

      consoleManager.ioManager.sendMessage(message);

      rawText = 'Pinging ' + userName + '...';
    }

    // Notify the user that we did something
    parsedText = parseUsers.call(consoleManager, rawText);
    clientMessage = new Message(rawText, parsedText, null, time, 'system');
    console.addMessage(clientMessage);
  }

  /**
   *
   * @function ConsoleManager~ignoreUser
   * @param {String} userName
   * @param {ChatConsole} console
   */
  function ignoreUser(userName, console) {
    var consoleManager, time, ignoredUser, rawText, parsedText, clientMessage;
    consoleManager = this;
    time = Date.now();

    ignoredUser = getUserFromName(userName);

    if (ignoredUser === null) {
      // There is no user with this name

      rawText = 'There is no user with the name ' + userName;
    } else if (!ignoredUser.isIgnored) {
      // Start ignoring this other user

      ignoredUser.isIgnored = true;

      // TODO: remove all previously displayed messages from the ignored user

      rawText = 'You are now ignoring all messages from ' + userName;
    } else {
      // Stop ignoring this other user

      ignoredUser.isIgnored = false;

      // TODO: show all previously hidden messages from the ignored user

      rawText = 'You are now receiving messages from ' + userName;
    }

    // Notify the user that we did something
    parsedText = parseUsers.call(consoleManager, rawText);
    clientMessage = new Message(rawText, parsedText, null, time, 'system');
    console.addMessage(clientMessage);
  }

  /**
   *
   * @function ConsoleManager~leaveRoom
   * @param {Message} [message]
   * @param {ChatConsole} console
   */
  function leaveRoom(message, console) {
    var consoleManager, time, rawText, parsedText;
    consoleManager = this;
    time = Date.now();

    // Hide the panel
    util.toggleClass(console.elements.container, 'hidden', true);

    // We do not need to inform the server when "leaving" a private chat
    if (console === consoleManager.consoles.chatRoomMessages) {
      // Create the message if it does not already exist
      if (!message) {
        rawText = '/leave';
        parsedText = '<code class=\'command\'>' + rawText + '</code>';
        message = new Message(rawText, parsedText, consoleManager.thisUser, time, 'out', 'leave');
      }

      consoleManager.ioManager.sendMessage(message);

      consoleManager.activeRoom.users.splice(consoleManager.activeRoom.users.indexOf(consoleManager.thisUser),
          1);
      consoleManager.activeRoom = null;
    }
  }

  /**
   *
   * @function ConsoleManager~quit
   * @param {Message} [message]
   * @param {ChatConsole} console
   */
  function quit(message, console) {
    var consoleManager, time, rawText, parsedText, clientMessage;
    consoleManager = this;
    time = Date.now();

    // Create the message if it does not already exist
    if (!message) {
      rawText = '/quit';
      parsedText = '<code class=\'command\'>' + rawText + '</code>';
      message = new Message(rawText, parsedText, consoleManager.thisUser, time, 'out', 'quit');
    }

    consoleManager.ioManager.sendMessage(message);

    // Notify the user that we did something
    rawText = 'Goodbye ' + consoleManager.thisUser + '!';
    parsedText = parseUsers.call(consoleManager, rawText);
    clientMessage = new Message(rawText, parsedText, null, time, 'system');
    console.addMessage(clientMessage);

    // Close this window
    setTimeout(function () {
      open(location, '_self').close();
    }, 1500);
  }

  /**
   *
   * @function ConsoleManager~sendMessage
   * @param {Message} message
   * @param {ChatConsole} console
   */
  function sendMessage(message, console) {
    var consoleManager;
    consoleManager = this;

    consoleManager.ioManager.sendMessage(message);

    console.addMessage(message);
  }

  /**
   *
   * @function ConsoleManager~getRoomFromName
   * @param {String} roomName
   * @returns {Room}
   */
  function getRoomFromName(roomName) {
    var consoleManager, i, count;

    consoleManager = this;

    for (i = 0, count = consoleManager.allRooms.length; i < count; i++) {
      if (consoleManager.allRooms[i].name === roomName) {
        return consoleManager.allRooms[i];
      }
    }

    return null;
  }

  /**
   *
   * @function ConsoleManager~getUserFromName
   * @param {String} userName
   * @returns {User}
   */
  function getUserFromName(userName) {
    var consoleManager, i, count;

    consoleManager = this;

    for (i = 0, count = consoleManager.allUsers.length; i < count; i++) {
      if (consoleManager.allUsers[i].name === userName) {
        return consoleManager.allUsers[i];
      }
    }

    return null;
  }

  /**
   *
   * @function ConsoleManager~parseOutGoingMessage
   * @param {String} rawText
   * @param {Boolean} isPrivate
   * @returns {Message}
   */
  function parseOutGoingMessage(rawText, isPrivate) {
    var consoleManager, htmlText;
    consoleManager = this;
    htmlText = parseRawMessageTextForDom(rawText);
    return IOManager.parseOutGoingMessage(rawText, htmlText, consoleManager.thisUser,
        consoleManager.privateChatUser, isPrivate);
  }

  /**
   *
   * @function ConsoleManager~parseRooms
   * @param {String} text
   * @returns {String}
   */
  function parseRooms(text) {
    var consoleManager = this;
    consoleManager.allRooms.forEach(function (room) {
      text = text.replace(room.name, '<code class=\'room\'>' + room.name + '</code>');
    });
    return text;
  }

  /**
   *
   * @function ConsoleManager~parseUsers
   * @param {String} text
   * @returns {String}
   */
  function parseUsers(text) {
    var consoleManager = this;
    consoleManager.allUsers.forEach(function (user) {
      text = text.replace(user.name, '<code class=\'user\'>' + user.name + '</code>');
    });
    return text;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   *
   * @function ConsoleManager#init
   */
  function init() {
    var consoleManager = this;

    setUpElements.call(consoleManager);
  }

  /**
   *
   * @function ConsoleManager#handleOutGoingMessage
   * @param {String} rawText
   * @param {ChatTextBox} chatTextBox
   */
  function handleOutGoingMessage(rawText, chatTextBox) {
    var consoleManager, message, isPrivateMessage, console;

    consoleManager = this;

    isPrivateMessage = chatTextBox === consoleManager.textBoxes.privateMessages;
    message = parseOutGoingMessage.call(consoleManager, rawText, isPrivateMessage);

    if (!message) {
      return;
    }

    if (chatTextBox === consoleManager.textBoxes.chatRoomMessages) {
      console = consoleManager.consoles.chatRoomMessages;
      console.addMessage(message);

      switch (message.command) {
        case 'none':
          sendMessage.call(consoleManager, message);
          break;
        case 'help':
          printHelp.call(consoleManager, console);
          break;
        case 'rooms':
          printRooms.call(consoleManager, console);
          break;
        case 'join':
          joinRoom.call(consoleManager, message.arguments[0], message);
          break;
        case 'msg':
          showPrivateMessage.call(consoleManager, message);
          break;
        case 'nick':
          changeOwnNickname.call(consoleManager, message.arguments[0], message, console);
          break;
        case 'ping':
          pingUser.call(consoleManager, message.arguments[0], message, console);
          break;
        case 'ignore':
          ignoreUser.call(consoleManager, message.arguments[0], console);
          break;
        case 'leave':
          leaveRoom.call(consoleManager, message, console);
          break;
        case 'quit':
          quit.call(consoleManager, message, console);
          break;
        default:
          break;
      }
    } else if (chatTextBox === consoleManager.textBoxes.privateMessages) {
      consoleManager.consoles.privateMessages.addMessage(message);

      // TODO: handle private chat window message
    }
  }

  /**
   *
   * @function ConsoleManager#parseRawMessageTextForDom
   * @param {String} text
   * @returns {String}
   */
  function parseRawMessageTextForDom(text) {
    var consoleManager = this;

    // Encode HTML entities so that the text may be safely inserted into the HTML document
    text = he.encode(text);

    // Replace any substrings that represent commands, emoticons, current rooms, current users, or links with decorated versions
    // TODO: add event handlers to the inline elements created in each of the following functions
    text = parseCommands(text);
    text = parseEmoticons(text);
    text = parseRooms.call(consoleManager, text);
    text = parseUsers.call(consoleManager, text);
    // TODO: parseURLs

    return text;
  }

  /**
   *
   * @function ConsoleManager~joinRoom
   * @param {String} roomName
   * @param {Message} [message]
   */
  function joinRoom(roomName, message) {
    var consoleManager, time, room, rawText, parsedText, welcomeMessage, userCountMessage;
    consoleManager = this;
    time = Date.now();

    room = getRoomFromName.call(consoleManager, message.arguments[0]);

    // Create a new room if a room of this name did not already exist
    if (room === null) {
      room = new Room(roomName, [], Date.now());
    }

    // Create the message if it does not already exist
    if (!message) {
      rawText = '/join ' + room.name;
      parsedText = '<code class=\'command\'>' + rawText + '</code>';
      IOManager.parseOutGoingMessage();// TODO!!!!
      message =
          new Message(rawText, parsedText, consoleManager.thisUser, time, 'out', 'join',
              [room.name]);
    }

    consoleManager.ioManager.sendMessage(message);

    // --- Set up the room chat console for this new room --- //

    consoleManager.activeRoom = room;
    room.users.push(consoleManager.thisUser);
    consoleManager.textBoxes.chatRoomMessages.focus();

    rawText = 'Welcome ' + consoleManager.thisUser.name + ' to room ' + room.name + '!';
    parsedText = parseRooms.call(consoleManager, rawText);
    parsedText = parseUsers.call(consoleManager, parsedText);
    welcomeMessage = new Message(rawText, parsedText, null, time, 'system');

    rawText = 'There are ' + room.users.length + ' users in this room.';
    parsedText = rawText;
    userCountMessage = new Message(rawText, parsedText, null, time, 'system');

    consoleManager.consoles.chatRoomMessages.setTitle('Room: ' + room.name);
    consoleManager.consoles.chatRoomMessages.clearMessages();
    consoleManager.consoles.chatRoomMessages.addMessage(welcomeMessage);
    consoleManager.consoles.chatRoomMessages.addMessage(userCountMessage);
  }

  /**
   *
   * @function ConsoleManager~changeOwnNickname
   * @param {String} nickName
   * @param {Message} [message]
   * @param {ChatConsole} console
   */
  function changeOwnNickname(nickName, message, console) {
    var consoleManager, time, rawText, parsedText, clientMessage, oldName;
    consoleManager = this;
    time = Date.now();

    if (getUserFromName(nickName) === null) {
      // There is already a user with this name

      rawText = 'There is already a user with the name ' + nickName;
    } else {
      // Change to this new nickname

      // Create the message if it does not already exist
      if (!message) {
        rawText = '/nick ' + nickName;
        parsedText = '<code class=\'command\'>' + rawText + '</code>';
        message =
            new Message(rawText, parsedText, consoleManager.thisUser, time, 'out', 'nick',
                [nickName]);
      }

      consoleManager.ioManager.sendMessage(message);

      // TODO: need to actually get a response back from the server that the name change was successful

      // Update this client with the new name
      oldName = consoleManager.thisUser.name;
      consoleManager.thisUser.name = nickName;

      rawText = 'You changed your name from ' + oldName + ' to ' + nickName;
    }

    // Notify the user that we did something
    parsedText = parseUsers.call(consoleManager, rawText);
    clientMessage = new Message(rawText, parsedText, null, time, 'system');
    console.addMessage(clientMessage);
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   *
   * @function ConsoleManager~initHelpMessages
   */
  function initHelpMessages() {
    var message, time, parsedText;
    time = Date.now();
    helpMessages = [];
    params.L18N.EN.HELP_MESSAGES.forEach(function (rawText) {
      parsedText = parseCommands(rawText);
      parsedText = parseEmoticons(parsedText);
      message = new Message(rawText, parsedText, null, time, 'system');
      helpMessages.push(message);
    });
  }

  /**
   *
   * @function ConsoleManager~parseCommands
   * @param {String} text
   * @returns {String}
   */
  function parseCommands(text) {
    var property;

    // TODO: replace /link commands with <a> elements

    for (property in params.COMMANDS) {
      text = text.replace(params.COMMANDS[property].rawString, params.COMMANDS[property].htmlElement);
    }

    return text;
  }

  /**
   *
   * @function ConsoleManager~parseEmoticons
   * @param {String} text
   * @returns {String}
   */
  function parseEmoticons(text) {
    var property;

    for (property in params.EMOTICONS) {
      text = text.replace(property, params.EMOTICONS[property]);
    }

    return text;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function ConsoleManager.initStaticFields
   */
  function initStaticFields() {
    he = app.he;
    params = app.params;
    util = app.util;
    log = new app.Log('ConsoleManager');
    Room = app.Room;
    User = app.User;
    Message = app.Message;
    IOManager = app.IOManager;
    initHelpMessages();
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   */
  function ConsoleManager() {
    var consoleManager = this;

    consoleManager.uiManager = null;
    consoleManager.ioManager = new IOManager(consoleManager);
    consoleManager.thisUser = null;
    consoleManager.activeRoom = null;
    consoleManager.privateChatUser = null;
    consoleManager.allUsers = [];
    consoleManager.allRooms = [];
    consoleManager.bots = [];
    consoleManager.consoles = null;

    consoleManager.init = init;
    consoleManager.handleOutGoingMessage = handleOutGoingMessage;
    consoleManager.parseRawMessageTextForDom = parseRawMessageTextForDom;
    consoleManager.joinRoom = joinRoom;
    consoleManager.changeOwnNickname = changeOwnNickname;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.ConsoleManager = ConsoleManager;
  ConsoleManager.initStaticFields = initStaticFields;

  console.log('ConsoleManager module loaded');
})();
