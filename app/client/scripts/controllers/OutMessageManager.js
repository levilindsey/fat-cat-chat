/**
 * This module defines a constructor for OutMessageManager objects.
 * @module OutMessageManager
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var he, params, util, log, Room, User, Message, ChatBot, ChatManager, helpMessages;

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
    message = outMessageManager.chatManager.parseInternalMessage(message.arguments[0], true);
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
        message = outMessageManager.chatManager.parseInternalMessage('&nbsp;- ' + room.name, false);
        console.addMessage(message);
      });
    } else {
      rawText = 'There are no open rooms right now.';
      message = outMessageManager.chatManager.parseInternalMessage(rawText, false);
      console.addMessage(message);
    }
  }

  /**
   * @function OutMessageManager~sendPrivateMessage
   * @param {Message} message
   * @param {ChatConsole} console
   * @param {Boolean} enteredAsACommand
   */
  function sendPrivateMessage(message, console, enteredAsACommand) {
    var outMessageManager, userName, privateChatUser, rawText, htmlTextPrefix, htmlText, thisUser;

    log.d('sendPrivateMessage', 'message.htmlText=' + message.htmlText);
    outMessageManager = this;

    if (!message) {
      log.e('sendPrivateMessage', 'No message');
      return;
    }

    userName = message.arguments[1];
    privateChatUser = outMessageManager.chatManager.getUserFromName(userName);
    thisUser = outMessageManager.chatManager.thisUser;

    if (!privateChatUser) {
      // There is no user with this name

      if (enteredAsACommand) {
        // Only show the user-entered message if it is in the form of a command
        console.addMessage(message);

        // Notify the user that we did something
        rawText = 'There is no user with the name ' + userName + '.';
        message = outMessageManager.chatManager.parseInternalMessage(rawText, true);
        console.addMessage(message);
      } else {
        // Notify the user that we did something
        rawText = 'This user has left, and will not receive your message.';
        message = outMessageManager.chatManager.parseInternalMessage(rawText, true);
        console.addMessage(message);
      }
    } else if (privateChatUser === thisUser) {
      // The user is trying to private message herself

      console.addMessage(message);

      // Notify the user that we did something
      rawText = 'You cannot private message yourself.';
      message = outMessageManager.chatManager.parseInternalMessage(rawText, true);
      console.addMessage(message);
    } else {
      if (outMessageManager.chatManager.connectedToServer) {
        outMessageManager.socketManager.sendMessage(message);

        // Show the user-entered message
        if (enteredAsACommand) {
          console.addMessage(message);

          rawText = message.arguments[2];
          htmlText = outMessageManager.chatManager.parseRawMessageTextForDom(rawText);

          // Prefix the displayed message with this user's name, even if it was entered from the room chat
          if (console === outMessageManager.chatManager.consoles.chatRoomMessages) {
            htmlTextPrefix = thisUser.name + ': ';
            htmlTextPrefix = outMessageManager.chatManager.parseRawMessageTextForDom(htmlTextPrefix);
            htmlText = htmlTextPrefix + htmlText;
          }

          // Show the text of the message, in non-command form
          message = new Message(rawText, htmlText, thisUser, Date.now(), 'out', 'none', null);
          outMessageManager.chatManager.showPrivateMessage(message, privateChatUser);
        } else {
          message.type = 'out';
          console.addMessage(message);
        }
      } else {
        // Not connected to the server!
        rawText = 'Not connected to the server!';
        message = outMessageManager.chatManager.parseInternalMessage(rawText, true);
        console.addMessage(message);
      }
    }
  }

  /**
   * @function OutMessageManager~pingUser
   * @param {String} userName
   * @param {Message} message
   * @param {ChatConsole} console
   */
  function pingUser(userName, message, console) {
    var outMessageManager, pingUser, rawText, isError;

    log.d('pingUser');
    outMessageManager = this;

    if (!userName) {
      log.e('pingUser', 'No userName');
      return;
    }

    pingUser = outMessageManager.chatManager.getUserFromName(userName);

    if (!pingUser) {
      // There is no user with this name
      rawText = 'There is no user with the name ' + userName + '.';
      isError = true;
    } else {
      // Ping the user
      outMessageManager.socketManager.sendMessage(message);
      rawText = 'Pinging ' + userName + '...';
      isError = false;
    }

    // Show the user-entered command
    console.addMessage(message);

    // Notify the user that we did something
    message = outMessageManager.chatManager.parseInternalMessage(rawText, isError);
    console.addMessage(message);
  }

  /**
   * @function OutMessageManager~ignoreUser
   * @param {String} userName
   * @param {Message} message
   * @param {ChatConsole} console
   */
  function ignoreUser(userName, message, console) {
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
      // - ChatConsole.replaceMessages

      rawText = 'You are now ignoring all messages from ' + userName;
    } else {
      // Stop ignoring this other user

      ignoredUser.isIgnored = false;

      // TODO: show all previously hidden messages from the ignored user
      // - ChatConsole.replaceMessages

      rawText = 'You are now receiving messages from ' + userName;
    }

    // Show the user-entered command
    console.addMessage(message);

    // Notify the user that we did something
    message = outMessageManager.chatManager.parseInternalMessage(rawText, false);
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

      outMessageManager.chatManager.thisUser.room.removeUser(outMessageManager.thisUser);
      outMessageManager.chatManager.thisUser.room = null;
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
    message = outMessageManager.chatManager.parseInternalMessage(rawText, false);
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
    var outMessageManager, rawText;

    log.d('sendRoomMessage', 'message.htmlText=' + message.htmlText);
    outMessageManager = this;

    if (outMessageManager.chatManager.connectedToServer) {
      outMessageManager.socketManager.sendMessage(message);

      // Show the user-entered message
      message.type = 'out';
      outMessageManager.chatManager.consoles.chatRoomMessages.addMessage(message);
    } else {
      // Not connected to the server!
      rawText = 'Not connected to the server!';
      message = outMessageManager.chatManager.parseInternalMessage(rawText, true);
      outMessageManager.chatManager.consoles.chatRoomMessages.addMessage(message);
    }
  }

  /**
   * @function OutMessageManager~parseOutGoingMessage
   * @param {String} rawText
   * @param {Boolean} isPrivate
   * @returns {Message}
   */
  function parseOutGoingMessage(rawText, isPrivate) {
    var outMessageManager, htmlText, htmlTextPrefix, time, type, result, command, arguments, thisUserName, isACommand;

    log.d('parseOutGoingMessage', 'rawText=' + rawText);
    outMessageManager = this;

    if (!rawText) {
      log.e('parseOutGoingMessage', 'No rawText');
      return null;
    }

    htmlText = outMessageManager.chatManager.parseRawMessageTextForDom(rawText);
    htmlTextPrefix = '';
    time = Date.now();
    thisUserName = outMessageManager.chatManager.thisUser.name;
    type = 'command';

    // Is this a command?
    if (rawText[0] === '/') {
      isACommand = true;

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
        arguments = [thisUserName, result[1], result[2]];
        rawText = '/msg ' + arguments[0] + ' ' + arguments[1] + ' (' + arguments[2] + ')';
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
            '/leave ' + thisUserName + ' ' + (outMessageManager.chatManager.thisUser.room ? outMessageManager.chatManager.thisUser.room.name : '/none');
      } else if (params.OUT_COMMANDS.quit.regex.exec(rawText)) {
        command = 'quit';
      } else if (rawText.substr(0, 5) === '/link') {
        isACommand = false;
      } else {
        // Print an error message to the user, because she entered an invalid command
        type = 'error';
        command = 'none';
        arguments = ['Invalid command'];
      }
    }

    if (!isACommand) {
      if (isPrivate) {
        command = 'msg';
        arguments =
            [thisUserName, outMessageManager.chatManager.thisUser.privateChatUser ? outMessageManager.chatManager.thisUser.privateChatUser.name : '/none', rawText];
        rawText = '/msg ' + arguments[0] + ' ' + arguments[1] + ' (' + arguments[2] + ')';
        htmlTextPrefix = thisUserName + ': ';
        htmlTextPrefix = outMessageManager.chatManager.parseRawMessageTextForDom(htmlTextPrefix);
        htmlText = htmlTextPrefix + htmlText;
      } else { // Normal, public message
        command = 'pubmsg';
        rawText =
            '/pubmsg ' + thisUserName + ' ' +
                outMessageManager.chatManager.thisUser.room.name + ' (' + rawText + ')';
        htmlTextPrefix = thisUserName + ': ';
        htmlTextPrefix = outMessageManager.chatManager.parseRawMessageTextForDom(htmlTextPrefix);
        htmlText = htmlTextPrefix + htmlText;
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
    var outMessageManager, message, isPrivateMessage, console, enteredAsACommand;

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
        sendRoomMessage.call(outMessageManager, message, console);
        break;
      case 'help':
        printHelp.call(outMessageManager, console);
        break;
      case 'rooms':
        printRooms.call(outMessageManager, console);
        break;
      case 'join':
        joinRoom.call(outMessageManager, message.arguments[0], message, console);
        break;
      case 'msg':
        enteredAsACommand = rawText.length > 4 && rawText.substr(0, 4) === '/msg';
        sendPrivateMessage.call(outMessageManager, message, console, enteredAsACommand);
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
   * @param {ChatConsole} [console]
   * @returns {Boolean}
   */
  function joinRoom(roomName, message, console) {
    var outMessageManager, room, rawText;

    log.d('joinRoom', 'roomName=' + roomName);
    outMessageManager = this;
    console = console || outMessageManager.chatManager.consoles.chatRoomMessages;

    if (!roomName) {
      log.e('joinRoom', 'No roomName');
      return false;
    }

    // Validate the characters in the room name
    if (!roomName.match(params.NAME_VALIDATION.regex)) {
      // Notify the user that we did something
      rawText = 'Names can only contain the characters ' + params.NAME_VALIDATION.validChars;
      message = outMessageManager.chatManager.parseInternalMessage(rawText, true);
      console.addMessage(message);
      return false;
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

    util.toggleClass(outMessageManager.socketManager.uiManager.panels.roomChat.container, 'closed',
        false);
    util.toggleClass(outMessageManager.socketManager.uiManager.panels.roomChat.container, 'hidden',
        false);

    outMessageManager.socketManager.uiManager.textBoxes.chatRoomMessages.textBox.focus();
    outMessageManager.chatManager.consoles.chatRoomMessages.setTitle('Room: ' + roomName);
    outMessageManager.chatManager.consoles.chatRoomMessages.clearMessages();
    outMessageManager.chatManager.consoles.chatRoomUsers.clearMessages();

    outMessageManager.chatManager.thisUser.room = room;
    outMessageManager.chatManager.addUserToRoom(outMessageManager.chatManager.thisUser, room);

    // Show the user-entered command
    outMessageManager.chatManager.consoles.chatRoomMessages.addMessage(message);

    rawText =
        'Welcome ' + outMessageManager.chatManager.thisUser.name + ' to room ' + roomName + '! :)';
    message = outMessageManager.chatManager.parseInternalMessage(rawText, false);
    outMessageManager.chatManager.consoles.chatRoomMessages.addMessage(message);

    return true;
  }

  /**
   * @function OutMessageManager#changeOwnNickname
   * @param {String} nickname
   * @param {Message} message
   * @param {ChatConsole} [console]
   * @returns {Boolean}
   */
  function changeOwnNickname(nickname, message, console) {
    var outMessageManager, rawText;

    log.d('changeOwnNickname', 'nickname=' + nickname);
    outMessageManager = this;
    console = console || outMessageManager.chatManager.consoles.chatRoomMessages;

    if (!nickname) {
      log.e('changeOwnNickname', 'No nickname');
      return false;
    }

    // Validate the characters in the nickname
    if (!nickname.match(params.NAME_VALIDATION.regex)) {
      // Notify the user that we did something
      rawText = 'Names can only contain the characters ' + params.NAME_VALIDATION.validChars;
      message = outMessageManager.chatManager.parseInternalMessage(rawText, true);
      console.addMessage(message);
      return false;
    }

    // Create the message if it does not already exist
    if (!message) {
      rawText = '/nick ' + nickname;
      message = parseOutGoingMessage.call(outMessageManager, rawText, false);
    }

    // Show the user-entered command
    console.addMessage(message);

    if (outMessageManager.chatManager.getUserFromName(nickname)) {
      // There is already a user with this name

      // Notify the user that we did something
      rawText = 'There is already a user with the name ' + nickname;
      message = outMessageManager.chatManager.parseInternalMessage(rawText, true);
      console.addMessage(message);

      return false;
    } else {
      // Change to this new nickname
      outMessageManager.socketManager.sendMessage(message);
      return true;
    }
  }

  /**
   * @function OutMessageManager#sendHeartbeat
   * @param {User} user
   */
  function sendHeartbeat(user) {
    var outMessageManager, room, userName, roomName, rawText, time, type, command, arguments, message;

    log.v('sendHeartbeat');
    outMessageManager = this;

    if (!user) {
      log.w('sendHeartbeat', 'No such user');
      return;
    }

    room = user.room;
    userName = user.name;
    roomName = room ? room.name : '/none';

    rawText = '/heartbeat ' + userName + ' ' + roomName + ' ' + (user instanceof ChatBot ? 'bot' : 'human');

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

    log.v('sendHeartbeatRequest');
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
    var message, time;
    time = Date.now();
    helpMessages = [];
    params.L18N.EN.HELP_MESSAGES.forEach(function (htmlText) {
      message = new Message(htmlText, htmlText, null, time, 'system', null, null);
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
    ChatBot = app.ChatBot;
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
