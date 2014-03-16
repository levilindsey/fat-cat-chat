/**
 * This module defines a constructor for OutMessageManager objects.
 * @module OutMessageManager
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var he, params, util, log, Room, User, Message, ConsoleManager, helpMessages;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   *
   * @function OutMessageManager~printHelp
   * @param {ChatConsole} console
   */
  function printHelp(console) {
    var outMessageManager, rawText, message;

    log.d('printHelp');
    outMessageManager = this;

    // Show the user-entered command
    rawText = '/help';
    message = parseOutGoingMessage.call(outMessageManager, rawText, false);
    console.addMessage(message);

    helpMessages.forEach(function (helpMessage) {
      console.addMessage(helpMessage);
    });
  }

  /**
   *
   * @function OutMessageManager~printRooms
   * @param {ChatConsole} console
   */
  function printRooms(console) {
    var outMessageManager, message, rawText;

    log.d('printRooms');
    outMessageManager = this;

    // Show the user-entered command
    rawText = '/rooms';
    message = parseOutGoingMessage.call(outMessageManager, rawText, false);
    console.addMessage(message);

    if (outMessageManager.consoleManager.allRooms.length > 0) {
      outMessageManager.consoleManager.allRooms.forEach(function (room) {
        message = outMessageManager.consoleManager.parseInternalSystemMessage(room.name);
        console.addMessage(message);
      });
    } else {
      rawText = 'There are no open rooms right now.';
      message = outMessageManager.consoleManager.parseInternalSystemMessage(rawText);
      console.addMessage(message);
    }
  }

  /**
   *
   * @function OutMessageManager~sendPrivateMessage
   * @param {Message} message
   * @param {ChatConsole} console
   */
  function sendPrivateMessage(message, console) {
    var outMessageManager, userName, privateChatUser, rawText;

    log.d('sendPrivateMessage', 'message.htmlText=' + message.htmlText);
    outMessageManager = this;

    if (!message) {
      return;
    }

    userName = message.arguments[0];
    privateChatUser = outMessageManager.consoleManager.getUserFromName(userName);

    if (!privateChatUser) {
      // There is no user with this name

      // Show the user-entered message
      console.addMessage(message);

      // Notify the user that we did something
      rawText = 'There is no user with the name ' + userName;
      message = outMessageManager.consoleManager.parseInternalSystemMessage(rawText);
      console.addMessage(message);
    } else {
      // TODO:
      // - add the logic to position the private message console onResize
      // - add the logic to toggle the private message console visibility
      // - show the private message console here
      // - make sure I add some way of closing the private message console (an 'X' button in the top-right corner?)
      // - if this is a new private chat user, then show all of the messages contained the user's list

      outMessageManager.ioManager.sendMessage(message);

      // Show the user-entered message
      outMessageManager.consoleManager.consoles.privateMessages.addMessage(message);

      outMessageManager.ioManager.uiManager.textBoxes.privateMessages.textBox.focus();

      outMessageManager.consoleManager.privateChatUser = privateChatUser;
      privateChatUser.privateMessages.push(message);
    }
  }

  /**
   *
   * @function OutMessageManager~pingUser
   * @param {String} userName
   * @param {Message} message
   * @param {ChatConsole} console
   */
  function pingUser(userName, message, console) {
    var outMessageManager, pingUser, rawText;

    log.d('pingUser');
    outMessageManager = this;

    if (!userName) {
      return;
    }

    pingUser = outMessageManager.consoleManager.getUserFromName(userName);

    if (!pingUser) {
      // There is no user with this name

      rawText = 'There is no user with the name ' + userName;
    } else {
      // Ping the user

      outMessageManager.ioManager.sendMessage(message);

      rawText = 'Pinging ' + userName + '...';
    }

    // Show the user-entered command
    console.addMessage(message);

    // Notify the user that we did something
    message = outMessageManager.consoleManager.parseInternalSystemMessage(rawText);
    console.addMessage(message);
  }

  /**
   *
   * @function OutMessageManager~ignoreUser
   * @param {String} userName
   * @param {Message} message
   * @param {ChatConsole} console
   */
  function ignoreUser(userName, console, message) {
    var outMessageManager, ignoredUser, rawText;

    log.d('ignoreUser');
    outMessageManager = this;

    if (!userName) {
      return;
    }

    ignoredUser = outMessageManager.consoleManager.getUserFromName(userName);

    if (!ignoredUser) {
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

    // Show the user-entered command
    console.addMessage(message);

    // Notify the user that we did something
    message = outMessageManager.consoleManager.parseInternalSystemMessage(rawText);
    console.addMessage(message);
  }

  /**
   *
   * @function OutMessageManager~leaveRoom
   * @param {Message} message
   * @param {ChatConsole} console
   */
  function leaveRoom(message, console) {
    var outMessageManager, rawText;

    log.d('leaveRoom');
    outMessageManager = this;

    // We do not need to inform the server when "leaving" a private chat
    if (console === outMessageManager.consoleManager.consoles.chatRoomMessages) {
      // Create the message if it does not already exist
      if (!message) {
        rawText = '/leave';
        message = parseOutGoingMessage.call(outMessageManager, rawText, false);
      }

      outMessageManager.ioManager.sendMessage(message);

      outMessageManager.consoleManager.activeRoom.removeUser(outMessageManager.thisUser);
      outMessageManager.consoleManager.activeRoom = null;
    }

    // Hide the panel
    util.toggleClass(console.elements.panel, 'hidden', true);
  }

  /**
   *
   * @function OutMessageManager~quit
   * @param {Message} message
   * @param {ChatConsole} console
   */
  function quit(message, console) {
    var outMessageManager, rawText;

    log.d('quit');
    outMessageManager = this;

    // Create the message if it does not already exist
    if (!message) {
      rawText = '/quit';
      message = parseOutGoingMessage.call(outMessageManager, rawText, false);
    }

    outMessageManager.ioManager.sendMessage(message);

    // Show the user-entered command
    console.addMessage(message);

    // Notify the user that we did something
    rawText = 'Goodbye ' + outMessageManager.consoleManager.thisUser + '!';
    message = outMessageManager.consoleManager.parseInternalSystemMessage(rawText);
    console.addMessage(message);

    // Close this window
    setTimeout(function () {
      open(location, '_self').close();
    }, 1500);
  }

  /**
   *
   * @function OutMessageManager~sendRoomMessage
   * @param {Message} message
   */
  function sendRoomMessage(message) {
    var outMessageManager;

    log.d('sendRoomMessage', 'message.htmlText=' + message.htmlText);
    outMessageManager = this;

    outMessageManager.ioManager.sendMessage(message);

    // Show the user-entered message
    outMessageManager.consoleManager.consoles.chatRoomMessages.addMessage(message);
  }

  /**
   *
   * @function OutMessageManager~parseOutGoingMessage
   * @param {String} rawText
   * @param {Boolean} isPrivate
   * @returns {Message}
   */
  function parseOutGoingMessage(rawText, isPrivate) {
    var outMessageManager, htmlText, time, type, result, command, arguments;

    log.d('parseOutGoingMessage', 'rawText=' + rawText);
    outMessageManager = this;

    if (!rawText) {
      return null;
    }

    htmlText = outMessageManager.consoleManager.parseRawMessageTextForDom(rawText);

    time = Date.now();

    // Is this a command?
    if (rawText[0] === '/') {
      type = 'command';

      if (params.COMMANDS.help.regex.exec(rawText)) {
        command = 'help';
      } else if (params.COMMANDS.rooms.regex.exec(rawText)) {
        command = 'rooms';
      } else if (result = params.COMMANDS.join.regex.exec(rawText)) {
        if (rawText.lastIndexOf(' ') > 5) {
          type = 'error';
          command = 'none';
          arguments = ['Room names cannot contain spaces'];
        } else {
          command = 'join';
          arguments = [result[1]];
        }
      } else if (result = params.COMMANDS.msg.regex.exec(rawText)) {
        command = 'msg';
        arguments = [result[1], result[2]];
      } else if (result = params.COMMANDS.nick.regex.exec(rawText)) {
        if (rawText.lastIndexOf(' ') > 5) {
          type = 'error';
          command = 'none';
          arguments = ['User names cannot contain spaces'];
        } else {
          command = 'nick';
          arguments = [result[1]];
        }
      } else if (result = params.COMMANDS.ping.regex.exec(rawText)) {
        command = 'ping';
        arguments = [result[1]];
      } else if (result = params.COMMANDS.ignore.regex.exec(rawText)) {
        command = 'ignore';
        arguments = [result[1]];
      } else if (params.COMMANDS.leave.regex.exec(rawText)) {
        command = 'leave';
      } else if (params.COMMANDS.quit.regex.exec(rawText)) {
        command = 'quit';
      } else {
        // Print an error message to the user, because she entered an invalid command
        type = 'error';
        command = 'none';
        arguments = ['Invalid command'];
      }
    } else {
      type = 'out';

      if (isPrivate) {
        command = 'msg';
        rawText = '/msg ' + outMessageManager.consoleManager.privateChatUser.name + ' (' + rawText + ')';
      } else { // Normal, public message
        command = 'none';
      }
    }

    return new Message(rawText, htmlText, outMessageManager.consoleManager.thisUser, time, type, command, arguments);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   *
   * @function OutMessageManager#init
   * @param {ConsoleManager} consoleManager
   */
  function init(consoleManager) {
    var outMessageManager = this;

    outMessageManager.consoleManager = consoleManager;
  }

  /**
   *
   * @function OutMessageManager#handleOutGoingMessage
   * @param {String} rawText
   * @param {ChatTextBox} chatTextBox
   */
  function handleOutGoingMessage(rawText, chatTextBox) {
    var outMessageManager, message, isPrivateMessage, console;

    log.d('handleOutGoingMessage', 'rawText=' + rawText);
    outMessageManager = this;

    if (!rawText) {
      return;
    }

    isPrivateMessage = chatTextBox === outMessageManager.ioManager.uiManager.textBoxes.privateMessages;
    console = isPrivateMessage ? outMessageManager.consoleManager.consoles.privateMessages : outMessageManager.consoleManager.consoles.chatRoomMessages;
    message = parseOutGoingMessage.call(outMessageManager, rawText, isPrivateMessage);

    if (!message) {
      return;
    }

    switch (message.command) {
      case 'none':
        if (isPrivateMessage) {
          sendPrivateMessage.call(outMessageManager, message, console);
        } else {
          sendRoomMessage.call(outMessageManager, message, console);
        }
        break;
      case 'help':
        printHelp.call(outMessageManager, console);
        break;
      case 'rooms':
        printRooms.call(outMessageManager, console);
        break;
      case 'join':
        joinRoom.call(outMessageManager, message.arguments[0], message);
        break;
      case 'msg':
        sendPrivateMessage.call(outMessageManager, message, console);
        break;
      case 'nick':
        changeOwnNickname.call(outMessageManager, message.arguments[0], message, console);
        break;
      case 'ping':
        pingUser.call(outMessageManager, message.arguments[0], message, console);
        break;
      case 'ignore':
        ignoreUser.call(outMessageManager, message.arguments[0], message, console);
        break;
      case 'leave':
        leaveRoom.call(outMessageManager, message, console);
        break;
      case 'quit':
        quit.call(outMessageManager, message, console);
        break;
      default:
        break;
    }
  }

  /**
   *
   * @function OutMessageManager#joinRoom
   * @param {String} roomName
   * @param {Message} message
   */
  function joinRoom(roomName, message) {
    var outMessageManager, room, rawText;

    log.d('joinRoom', 'roomName=' + roomName);
    outMessageManager = this;

    if (!roomName) {
      return;
    }

    room = outMessageManager.consoleManager.getRoomFromName(roomName);

    // Create a new room if a room of this name did not already exist
    if (!room) {
      room = new Room(roomName, [], Date.now());
    }

    // Create the message if it does not already exist
    if (!message) {
      rawText = '/join ' + roomName;
      message = parseOutGoingMessage.call(outMessageManager, rawText, false);
    }

    outMessageManager.ioManager.sendMessage(message);

    // --- Set up the room chat console for this new room --- //

    outMessageManager.consoleManager.activeRoom = room;
    room.users.push(outMessageManager.consoleManager.thisUser);

    util.toggleClass(outMessageManager.ioManager.uiManager.panels.roomChat.container, 'closed', false);
    util.toggleClass(outMessageManager.ioManager.uiManager.panels.roomChat.container, 'hidden', false);

    outMessageManager.ioManager.uiManager.textBoxes.chatRoomMessages.textBox.focus();
    outMessageManager.consoleManager.consoles.chatRoomMessages.setTitle('Room: ' + roomName);
    outMessageManager.consoleManager.consoles.chatRoomMessages.clearMessages();

    // Show the user-entered command
    outMessageManager.consoleManager.consoles.chatRoomMessages.addMessage(message);

    rawText = 'Welcome ' + outMessageManager.consoleManager.thisUser.name + ' to room ' + roomName + '!';
    message = outMessageManager.consoleManager.parseInternalSystemMessage(rawText);
    outMessageManager.consoleManager.consoles.chatRoomMessages.addMessage(message);

    rawText = 'There are ' + room.users.length + ' users in this room.';
    message = outMessageManager.consoleManager.parseInternalSystemMessage(rawText);
    outMessageManager.consoleManager.consoles.chatRoomMessages.addMessage(message);
  }

  /**
   *
   * @function OutMessageManager#changeOwnNickname
   * @param {String} nickname
   * @param {Message} message
   * @param {ChatConsole} console
   */
  function changeOwnNickname(nickname, message, console) {
    var outMessageManager, rawText, oldName;

    log.d('changeOwnNickname', 'nickname=' + nickname);
    outMessageManager = this;

    if (!nickname) {
      return;
    }

    // Create the message if it does not already exist
    if (!message) {
      rawText = '/nick ' + nickname;
      message = parseOutGoingMessage.call(outMessageManager, rawText, false);
    }

    if (outMessageManager.consoleManager.getUserFromName(nickname)) {
      // There is already a user with this name

      rawText = 'There is already a user with the name ' + nickname;
    } else {
      // Change to this new nickname

      outMessageManager.ioManager.sendMessage(message);

      // TODO: need to actually get a response back from the server that the name change was successful

      // Update this client with the new name
      oldName = outMessageManager.consoleManager.thisUser.name;
      outMessageManager.consoleManager.thisUser.name = nickname;

      outMessageManager.ioManager.uiManager.panels.textEntryDialogue.ownUserNameLabel.innerHTML = nickname;

      rawText = 'You changed your name from ' + oldName + ' to ' + nickname;
    }

    console = console || outMessageManager.consoleManager.consoles.chatRoomMessages;

    // Show the user-entered command
    console.addMessage(message);

    // Notify the user that we did something
    message = outMessageManager.consoleManager.parseInternalSystemMessage(rawText);
    console.addMessage(message);
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   *
   * @function OutMessageManager~initHelpMessages
   */
  function initHelpMessages() {
    var message, time, htmlText;
    time = Date.now();
    helpMessages = [];
    params.L18N.EN.HELP_MESSAGES.forEach(function (rawText) {
      htmlText = ConsoleManager.parseCommands(rawText);
      htmlText = ConsoleManager.parseEmoticons(htmlText);
      message = new Message(rawText, htmlText, null, time, 'system', null, null);
      helpMessages.push(message);
    });
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function OutMessageManager.initStaticFields
   */
  function initStaticFields() {
    he = app.he;
    params = app.params;
    util = app.util;
    log = new app.Log('OutMessageManager');
    Room = app.Room;
    User = app.User;
    Message = app.Message;
    ConsoleManager = app.ConsoleManager;
    initHelpMessages();
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {IOManager} ioManager
   */
  function OutMessageManager(ioManager) {
    var outMessageManager = this;

    outMessageManager.ioManager = ioManager;
    outMessageManager.consoleManager = null;

    outMessageManager.init = init;
    outMessageManager.handleOutGoingMessage = handleOutGoingMessage;
    outMessageManager.joinRoom = joinRoom;
    outMessageManager.changeOwnNickname = changeOwnNickname;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.OutMessageManager = OutMessageManager;
  OutMessageManager.initStaticFields = initStaticFields;

  console.log('OutMessageManager module loaded');
})();
