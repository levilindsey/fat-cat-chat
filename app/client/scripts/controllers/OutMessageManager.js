/**
 * This module defines a constructor for OutMessageManager objects.
 * @module OutMessageManager
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var he, params, util, log, Room, User, Message, ChatManager, helpMessages;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @function OutMessageManager~printError
   * @param {Message} message
   * @param {ChatConsole} console
   */
  function printError(message, console) {
    var outMessageManager;

    log.d('printError', 'error message=' + message.arguments[0]);
    outMessageManager = this;

    // Show the user-entered message
    console.addMessage(message);

    // Notify the user that we did something
    message = outMessageManager.chatManager.parseInternalSystemMessage(message.arguments[0]);
    message.type = 'error';
    console.addMessage(message);
  }

  /**
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

    if (outMessageManager.chatManager.allRooms.length > 0) {
      outMessageManager.chatManager.allRooms.forEach(function (room) {
        message = outMessageManager.chatManager.parseInternalSystemMessage(room.name);
        console.addMessage(message);
      });
    } else {
      rawText = 'There are no open rooms right now.';
      message = outMessageManager.chatManager.parseInternalSystemMessage(rawText);
      console.addMessage(message);
    }
  }

  /**
   * @function OutMessageManager~sendPrivateMessage
   * @param {Message} message
   * @param {ChatConsole} console
   */
  function sendPrivateMessage(message, console) {
    var outMessageManager, userName, privateChatUser, rawText;

    log.d('sendPrivateMessage', 'message.htmlText=' + message.htmlText);
    outMessageManager = this;

    if (!message) {
      log.e('sendPrivateMessage', 'No message');
      return;
    }

    userName = message.arguments[0];
    privateChatUser = outMessageManager.chatManager.getUserFromName(userName);

    if (!privateChatUser) {
      // There is no user with this name

      // Show the user-entered message
      console.addMessage(message);

      // Notify the user that we did something
      rawText = 'There is no user with the name ' + userName;
      message = outMessageManager.chatManager.parseInternalSystemMessage(rawText);
      console.addMessage(message);
    } else {
      outMessageManager.socketManager.sendMessage(message);

      outMessageManager.chatManager.showPrivateMessage(message, privateChatUser);
    }
  }

  /**
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
      log.e('pingUser', 'No userName');
      return;
    }

    pingUser = outMessageManager.chatManager.getUserFromName(userName);

    if (!pingUser) {
      // There is no user with this name

      rawText = 'There is no user with the name ' + userName;
    } else {
      // Ping the user

      outMessageManager.socketManager.sendMessage(message);

      rawText = 'Pinging ' + userName + '...';
    }

    // Show the user-entered command
    console.addMessage(message);

    // Notify the user that we did something
    message = outMessageManager.chatManager.parseInternalSystemMessage(rawText);
    console.addMessage(message);
  }

  /**
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
      log.e('ignoreUser', 'No userName');
      return;
    }

    ignoredUser = outMessageManager.chatManager.getUserFromName(userName);

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
    message = outMessageManager.chatManager.parseInternalSystemMessage(rawText);
    console.addMessage(message);
  }

  /**
   * @function OutMessageManager~leaveRoom
   * @param {Message} message
   * @param {ChatConsole} console
   */
  function leaveRoom(message, console) {
    var outMessageManager, rawText;

    log.d('leaveRoom');
    outMessageManager = this;

    // We do not need to inform the server when "leaving" a private chat
    if (console === outMessageManager.chatManager.consoles.chatRoomMessages) {
      // Create the message if it does not already exist
      if (!message) {
        rawText = '/leave';
        message = parseOutGoingMessage.call(outMessageManager, rawText, false);
      }

      outMessageManager.socketManager.sendMessage(message);

      outMessageManager.chatManager.thisUser.activeRoom.removeUser(outMessageManager.thisUser);
      outMessageManager.chatManager.thisUser.activeRoom = null;
    }

    // Hide the panel
    util.toggleClass(console.elements.panel, 'hidden', true);
  }

  /**
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

    outMessageManager.socketManager.sendMessage(message);

    // Show the user-entered command
    console.addMessage(message);

    // Notify the user that we did something
    rawText = 'Goodbye ' + outMessageManager.chatManager.thisUser.name + '!';
    message = outMessageManager.chatManager.parseInternalSystemMessage(rawText);
    console.addMessage(message);

    // Close this window
    setTimeout(function () {
      open(location, '_self').close();
    }, 1500);
  }

  /**
   * @function OutMessageManager~sendRoomMessage
   * @param {Message} message
   */
  function sendRoomMessage(message) {
    var outMessageManager;

    log.d('sendRoomMessage', 'message.htmlText=' + message.htmlText);
    outMessageManager = this;

    outMessageManager.socketManager.sendMessage(message);

    // Show the user-entered message
    outMessageManager.chatManager.consoles.chatRoomMessages.addMessage(message);
  }

  /**
   * @function OutMessageManager~parseOutGoingMessage
   * @param {String} rawText
   * @param {Boolean} isPrivate
   * @returns {Message}
   */
  function parseOutGoingMessage(rawText, isPrivate) {
    var outMessageManager, htmlText, time, type, result, command, arguments, thisUserName;

    log.d('parseOutGoingMessage', 'rawText=' + rawText);
    outMessageManager = this;

    if (!rawText) {
      log.e('parseOutGoingMessage', 'No rawText');
      return null;
    }

    htmlText = outMessageManager.chatManager.parseRawMessageTextForDom(rawText);
    time = Date.now();
    thisUserName = outMessageManager.chatManager.thisUser.name;

    // Is this a command?
    if (rawText[0] === '/') {
      type = 'command';

      if (params.OUT_COMMANDS.help.regex.exec(rawText)) {
        command = 'help';
      } else if (params.OUT_COMMANDS.rooms.regex.exec(rawText)) {
        command = 'rooms';
      } else if (result = params.OUT_COMMANDS.join.regex.exec(rawText)) {
        if (rawText.lastIndexOf(' ') > 5) {
          type = 'error';
          command = 'none';
          arguments = ['Room names cannot contain spaces'];
        } else {
          command = 'join';
          arguments = [result[1]];
          rawText = '/join ' + thisUserName + ' ' + arguments[0];
        }
      } else if (result = params.OUT_COMMANDS.msg.regex.exec(rawText)) {
        command = 'msg';
        arguments = [result[1], result[2]];
        rawText = '/msg ' + thisUserName + ' ' + arguments[0] + ' (' + arguments[1] + ')';
      } else if (result = params.OUT_COMMANDS.nick.regex.exec(rawText)) {
        if (rawText.lastIndexOf(' ') > 5) {
          type = 'error';
          command = 'none';
          arguments = ['User names cannot contain spaces'];
        } else {
          command = 'nick';
          arguments = [result[1]];
          rawText = '/nick ' + thisUserName + ' ' + arguments[0];
        }
      } else if (result = params.OUT_COMMANDS.ping.regex.exec(rawText)) {
        command = 'ping';
        arguments = [result[1]];
        rawText = '/ping ' + thisUserName + ' ' + arguments[0];
      } else if (result = params.OUT_COMMANDS.ignore.regex.exec(rawText)) {
        command = 'ignore';
        arguments = [result[1]];
      } else if (params.OUT_COMMANDS.leave.regex.exec(rawText)) {
        command = 'leave';
        rawText =
            '/leave ' + thisUserName + ' ' + outMessageManager.chatManager.thisUser.activeRoom.name;
      } else if (params.OUT_COMMANDS.quit.regex.exec(rawText)) {
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
        rawText =
            '/msg ' + thisUserName + ' ' +
                outMessageManager.chatManager.thisUser.privateChatUser.name + ' (' + rawText + ')';
      } else { // Normal, public message
        command = 'pubmsg';
        rawText =
            '/pubmsg ' + thisUserName + ' ' +
                outMessageManager.chatManager.thisUser.activeRoom.name + ' (' + rawText + ')';
      }
    }

    return new Message(rawText, htmlText, outMessageManager.chatManager.thisUser, time, type,
        command, arguments);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * @function OutMessageManager#init
   * @param {ChatManager} chatManager
   */
  function init(chatManager) {
    var outMessageManager = this;

    outMessageManager.chatManager = chatManager;
  }

  /**
   * @function OutMessageManager#handleOutGoingMessage
   * @param {String} rawText
   * @param {ChatTextBox} chatTextBox
   */
  function handleOutGoingMessage(rawText, chatTextBox) {
    var outMessageManager, message, isPrivateMessage, console;

    log.d('handleOutGoingMessage', 'rawText=' + rawText);
    outMessageManager = this;

    if (!rawText) {
      log.e('handleOutGoingMessage', 'No rawText');
      return;
    }

    isPrivateMessage =
        chatTextBox === outMessageManager.socketManager.uiManager.textBoxes.privateMessages;
    console =
        isPrivateMessage ? outMessageManager.chatManager.consoles.privateMessages :
            outMessageManager.chatManager.consoles.chatRoomMessages;
    message = parseOutGoingMessage.call(outMessageManager, rawText, isPrivateMessage);

    if (!message) {
      log.e('handleOutGoingMessage', 'No message');
      return;
    }

    switch (message.command) {
      case 'pubmsg':
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
      case 'none':
        printError.call(outMessageManager, message, console);
        break;
      default:
        break;
    }
  }

  /**
   * @function OutMessageManager#joinRoom
   * @param {String} roomName
   * @param {Message} message
   */
  function joinRoom(roomName, message) {
    var outMessageManager, room, rawText;

    log.d('joinRoom', 'roomName=' + roomName);
    outMessageManager = this;

    if (!roomName) {
      log.e('joinRoom', 'No roomName');
      return;
    }

    room = outMessageManager.chatManager.getRoomFromName(roomName);

    // Create a new room if a room of this name did not already exist
    if (!room) {
      room = new Room(roomName, [], Date.now());
      outMessageManager.chatManager.addRoom(room);
    }

    // Create the message if it does not already exist
    if (!message) {
      rawText = '/join ' + roomName;
      message = parseOutGoingMessage.call(outMessageManager, rawText, false);
    }

    outMessageManager.socketManager.sendMessage(message);

    // --- Set up the room chat console for this new room --- //

    outMessageManager.chatManager.thisUser.activeRoom = room;
    outMessageManager.chatManager.addUserToRoom(outMessageManager.chatManager.thisUser, room);

    util.toggleClass(outMessageManager.socketManager.uiManager.panels.roomChat.container, 'closed',
        false);
    util.toggleClass(outMessageManager.socketManager.uiManager.panels.roomChat.container, 'hidden',
        false);

    outMessageManager.socketManager.uiManager.textBoxes.chatRoomMessages.textBox.focus();
    outMessageManager.chatManager.consoles.chatRoomMessages.setTitle('Room: ' + roomName);
    outMessageManager.chatManager.consoles.chatRoomMessages.clearMessages();

    // Show the user-entered command
    outMessageManager.chatManager.consoles.chatRoomMessages.addMessage(message);

    rawText =
        'Welcome ' + outMessageManager.chatManager.thisUser.name + ' to room ' + roomName + '!';
    message = outMessageManager.chatManager.parseInternalSystemMessage(rawText);
    outMessageManager.chatManager.consoles.chatRoomMessages.addMessage(message);

    rawText = 'There are ' + room.users.length + ' users in this room.';
    message = outMessageManager.chatManager.parseInternalSystemMessage(rawText);
    outMessageManager.chatManager.consoles.chatRoomMessages.addMessage(message);
  }

  /**
   * @function OutMessageManager#changeOwnNickname
   * @param {String} nickname
   * @param {Message} message
   * @param {ChatConsole} console
   */
  function changeOwnNickname(nickname, message, console) {
    var outMessageManager, rawText;

    log.d('changeOwnNickname', 'nickname=' + nickname);
    outMessageManager = this;

    if (!nickname) {
      log.e('changeOwnNickname', 'No nickname');
      return;
    }

    // Create the message if it does not already exist
    if (!message) {
      rawText = '/nick ' + nickname;
      message = parseOutGoingMessage.call(outMessageManager, rawText, false);
    }

    console = console || outMessageManager.chatManager.consoles.chatRoomMessages;

    // Show the user-entered command
    console.addMessage(message);

    if (outMessageManager.chatManager.getUserFromName(nickname)) {
      // There is already a user with this name

      // Notify the user that we did something
      rawText = 'There is already a user with the name ' + nickname;
      message = outMessageManager.chatManager.parseInternalSystemMessage(rawText);
      console.addMessage(message);
    } else {
      // Change to this new nickname
      outMessageManager.socketManager.sendMessage(message);
    }
  }

  /**
   * @function OutMessageManager#sendHeartbeat
   * @param {User} user
   */
  function sendHeartbeat(user) {
    var outMessageManager, room, userName, roomName, rawText, time, type, command, arguments, message;

    log.d('sendHeartbeat');
    outMessageManager = this;

    if (!user) {
      log.e('sendHeartbeat', 'No user');
      return;
    }

    room = outMessageManager.chatManager.thisUser.activeRoom;

    userName = user.name;
    roomName = room ? room.name : '/none';

    rawText = '/heartbeat ' + userName + ' ' + roomName;

    time = Date.now();
    type = 'system';
    command = 'heartbeat';
    arguments = [userName, roomName];

    message = new Message(rawText, null, user, time, type, command, arguments);

    outMessageManager.socketManager.sendMessage(message);
  }

  /**
   * @function OutMessageManager#sendHeartbeatRequest
   */
  function sendHeartbeatRequest() {
    var outMessageManager, user, userName, rawText, time, type, command, arguments, message;

    log.d('sendHeartbeatRequest');
    outMessageManager = this;

    user = outMessageManager.chatManager.thisUser;
    userName = user.name;
    rawText = '/heartbeatrequest ' + userName;
    time = Date.now();
    type = 'system';
    command = 'heartbeatrequest';
    arguments = [userName];

    message = new Message(rawText, null, user, time, type, command, arguments);

    outMessageManager.socketManager.sendMessage(message);
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * @function OutMessageManager~initHelpMessages
   */
  function initHelpMessages() {
    var message, time, htmlText;
    time = Date.now();
    helpMessages = [];
    params.L18N.EN.HELP_MESSAGES.forEach(function (rawText) {
      htmlText = ChatManager.parseCommands(rawText);
      htmlText = ChatManager.parseEmoticons(htmlText);
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
    ChatManager = app.ChatManager;
    initHelpMessages();
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {SocketManager} socketManager
   */
  function OutMessageManager(socketManager) {
    var outMessageManager = this;

    outMessageManager.socketManager = socketManager;
    outMessageManager.chatManager = null;

    outMessageManager.init = init;
    outMessageManager.handleOutGoingMessage = handleOutGoingMessage;
    outMessageManager.joinRoom = joinRoom;
    outMessageManager.changeOwnNickname = changeOwnNickname;
    outMessageManager.sendHeartbeat = sendHeartbeat;
    outMessageManager.sendHeartbeatRequest = sendHeartbeatRequest;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.OutMessageManager = OutMessageManager;
  OutMessageManager.initStaticFields = initStaticFields;

  console.log('OutMessageManager module loaded');
})();
