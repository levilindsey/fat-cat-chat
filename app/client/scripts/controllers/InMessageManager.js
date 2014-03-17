/**
 * This module defines a constructor for InMessageManager objects.
 * @module InMessageManager
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var he, params, util, log, Room, User, Message, ChatManager;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   *
   * @function InMessageManager~receivedPrivateMessage
   * @param {Message} message
   */
  function receivedPrivateMessage(message) {
    var inMessageManager, fromUserName, toUserName, fromUser, toUser, messageText;

    inMessageManager = this;
    fromUserName = message.arguments[0];
    toUserName = message.arguments[1];
    messageText = message.arguments[2];

    log.d('receivedPrivateMessage',
        'fromUserName=' + fromUserName + ', toUserName=' + toUserName + ', messageText=' +
            messageText);

    fromUser = inMessageManager.chatManager.getUserFromName(fromUserName);
    toUser = inMessageManager.chatManager.getUserFromName(toUserName);

    if (toUser === inMessageManager.chatManager.thisUser) {
      inMessageManager.chatManager.showPrivateMessage(message, fromUser);
    }
  }

  /**
   *
   * @function InMessageManager~receivedRoomMessage
   * @param {Message} message
   */
  function receivedRoomMessage(message) {
    var inMessageManager, userName, roomName, user, room, messageText;

    inMessageManager = this;
    userName = message.arguments[0];
    roomName = message.arguments[1];
    messageText = message.arguments[2];

    log.d('receivedRoomMessage',
        'userName=' + userName + ', roomName=' + roomName + ', messageText=' + messageText);

    user = inMessageManager.chatManager.getUserFromName(userName);
    room = inMessageManager.chatManager.getRoomFromName(roomName);

    if (user === inMessageManager.chatManager.thisUser && room === user.activeRoom) {
      // Show the message
      inMessageManager.chatManager.consoles.chatRoomMessages.addMessage(message);
    }
  }

  /**
   *
   * @function InMessageManager~userLeftRoom
   * @param {Message} message
   */
  function userLeftRoom(message) {
    var inMessageManager, userName, roomName, user, room, rawText;

    inMessageManager = this;
    userName = message.arguments[0];
    roomName = message.arguments[1];

    log.d('userLeftRoom', 'userName=' + userName + ', roomName=' + roomName);

    user = inMessageManager.chatManager.getUserFromName(userName);
    room = inMessageManager.chatManager.getRoomFromName(roomName);

    if (user && room) {
      inMessageManager.chatManager.removeUserFromRoom(user, room);

      if (room === inMessageManager.chatManager.thisUser.activeRoom) {
        // Notify the user that something happened
        rawText = userName + ' left the room.';
        message = inMessageManager.chatManager.parseInternalSystemMessage(rawText);
        inMessageManager.chatManager.consoles.chatRoomMessages.addMessage(message);
      }
    }
  }

  /**
   *
   * @function InMessageManager~userJoinedRoom
   * @param {Message} message
   */
  function userJoinedRoom(message) {
    var inMessageManager, userName, roomName, user, room, rawText;

    inMessageManager = this;
    userName = message.arguments[0];
    roomName = message.arguments[1];

    log.d('userJoinedRoom', 'userName=' + userName + ', roomName=' + roomName);

    user = inMessageManager.chatManager.getUserFromName(userName);
    room = inMessageManager.chatManager.getRoomFromName(roomName);

    if (user && room) {
      inMessageManager.chatManager.addUserToRoom(user, room);

      if (room === inMessageManager.chatManager.thisUser.activeRoom) {
        // Notify the user that something happened
        rawText = userName + ' joined the room.';
        message = inMessageManager.chatManager.parseInternalSystemMessage(rawText);
        inMessageManager.chatManager.consoles.chatRoomMessages.addMessage(message);
      }
    }
  }

  /**
   *
   * @function InMessageManager~userLeftServer
   * @param {Message} message
   */
  function userLeftServer(message) {
    var inMessageManager, userName, user;

    inMessageManager = this;
    userName = message.arguments[0];

    log.d('userLeftServer', 'userName=' + userName);

    user = inMessageManager.chatManager.getUserFromName(userName);

    if (user) {
      inMessageManager.chatManager.removeUser(user);
    }
  }

  /**
   *
   * @function InMessageManager~userJoinedServer
   * @param {Message} message
   */
  function userJoinedServer(message) {
    var inMessageManager, userName, user;

    inMessageManager = this;
    userName = message.arguments[0];

    log.d('userJoinedServer', 'userName=' + userName);

    user = inMessageManager.chatManager.getUserFromName(userName);

    if (!user) {
      user = new User(userName, Date.now());
    }

    inMessageManager.chatManager.addUser(user);
  }

  /**
   *
   * @function InMessageManager~roomCreated
   * @param {Message} message
   */
  function roomCreated(message) {
    var inMessageManager, roomName, room, rawText;

    inMessageManager = this;
    roomName = message.arguments[0];

    log.d('roomCreated', 'roomName=' + roomName);

    room = inMessageManager.chatManager.getRoomFromName(roomName);

    if (room) {
      inMessageManager.chatManager.addRoom(room);

      if (inMessageManager.chatManager.thisUser.activeRoom) {
        // Notify the user that something happened
        rawText = 'Room ' + roomName + ' was created.';
        message = inMessageManager.chatManager.parseInternalSystemMessage(rawText);
        inMessageManager.chatManager.consoles.chatRoomMessages.addMessage(message);
      }
    }
  }

  /**
   *
   * @function InMessageManager~roomDestroyed
   * @param {Message} message
   */
  function roomDestroyed(message) {
    var inMessageManager, roomName, room;

    inMessageManager = this;
    roomName = message.arguments[0];

    log.d('roomDestroyed', 'roomName=' + roomName);

    room = inMessageManager.chatManager.getRoomFromName(roomName);

    if (room) {
      inMessageManager.chatManager.removeRoom(room);
    }
  }

  /**
   *
   * @function InMessageManager~userChangedName
   * @param {Message} message
   */
  function userChangedName(message) {
    var inMessageManager, oldName, newName, user, rawText;

    inMessageManager = this;
    oldName = message.arguments[0];
    newName = message.arguments[1];

    log.d('userChangedName', 'oldName=' + oldName + ', newName=' + newName);

    user = inMessageManager.chatManager.getUserFromName(oldName);

    if (user) {
      inMessageManager.chatManager.changeUserName(user, newName);

      if (user === inMessageManager.chatManager.thisUser) {
        // This user changed her own name
        inMessageManager.socketManager.uiManager.panels.textEntryDialogue.ownUserNameLabel.innerHTML =
            newName;

        rawText = 'Your name changed from ' + oldName + ' to ' + newName + '.';
      } else {
        // Some other user changed her name
        rawText = oldName + ' changed his/her name to ' + newName + '.';
      }

      // Notify the user that something happened
      message = inMessageManager.chatManager.parseInternalSystemMessage(rawText);
      inMessageManager.chatManager.consoles.chatRoomMessages.addMessage(message);
    }
  }

  /**
   *
   * @function InMessageManager~handleNickInUse
   * @param {Message} message
   */
  function handleNickInUse(message) {
    var inMessageManager, oldName, newName, user, rawText;

    inMessageManager = this;
    oldName = message.arguments[0];
    newName = message.arguments[1];

    log.d('handleNickInUse', 'oldName=' + oldName + ', newName=' + newName);

    user = inMessageManager.chatManager.getRoomFromName(oldName);

    if (user && user === inMessageManager.chatManager.thisUser) {
      // Notify the user that something happened
      rawText = 'Unable to change your name to ' + newName;
      message = inMessageManager.chatManager.parseInternalSystemMessage(rawText);
      inMessageManager.chatManager.consoles.chatRoomMessages.addMessage(message);
    }
  }

  /**
   *
   * @function InMessageManager~handlePong
   * @param {Message} message
   */
  function handlePong(message) {
    var inMessageManager, fromUserName, toUserName, timeInSeconds, fromUser, toUser, rawText;

    inMessageManager = this;
    fromUserName = message.arguments[0];
    toUserName = message.arguments[1];
    timeInSeconds = parseInt(message.arguments[2], 10) / 1000;

    log.d('handlePong',
        'fromUserName=' + fromUserName + ', toUserName=' + toUserName + ', timeInSeconds=' +
            timeInSeconds);

    fromUser = inMessageManager.chatManager.getUserFromName(fromUserName);
    toUser = inMessageManager.chatManager.getUserFromName(toUserName);

    if (toUser === inMessageManager.chatManager.thisUser) {
      // Notify the user of the latency
      rawText =
          'There is a delay of ' + timeInSeconds + ' seconds between you and ' + fromUser.name +
              '.';
      message = inMessageManager.chatManager.parseInternalSystemMessage(rawText);
      inMessageManager.chatManager.consoles.chatRoomMessages.addMessage(message);
    }
  }

  /**
   *
   * @function InMessageManager~handleHeartbeatRequest
   * @param {Message} message
   */
  function handleHeartbeatRequest(message) {
    var inMessageManager, userName, user;

    inMessageManager = this;
    userName = message.arguments[0];

    log.d('handleHeartbeatRequest', 'userName=' + userName);

    user = inMessageManager.chatManager.getUserFromName(userName);

    inMessageManager.socketManager.outMessageManager.sendHeartbeat(user);
  }

  /**
   *
   * @function InMessageManager~handleHeartbeat
   * @param {Message} message
   */
  function handleHeartbeat(message) {
    var inMessageManager, userName, allRoomsString, allUsersString, currentRoomName, usersInRoomString, user, allRooms, allUsers, usersInRoom;

    inMessageManager = this;
    userName = message.arguments[0];
    allRoomsString = message.arguments[1];
    allUsersString = message.arguments[2];
    currentRoomName = message.arguments[3];
    usersInRoomString = message.arguments[4];

    log.d('handleHeartbeat',
        'userName=' + userName + ', allRoomsString=' + allRoomsString + ', allUsersString=' +
            allUsersString + ', currentRoomName=' + currentRoomName + ', usersInRoomString=' +
            usersInRoomString);

    user = inMessageManager.chatManager.getUserFromName(userName);
    allRooms = allRoomsString.split(' ');
    allUsers = allUsersString.split(' ');
    usersInRoom = usersInRoomString.split(' ');

    if (user === inMessageManager.chatManager.thisUser) {
      inMessageManager.chatManager.matchLocalStateToServer(allRooms, allUsers, currentRoomName, usersInRoom);
    }
  }

  /**
   *
   * @function InMessageManager~parseInComingMessage
   * @param {String} rawText
   * @returns {Message}
   */
  function parseInComingMessage(rawText) {
    var inMessageManager, htmlText, time, type, result, command, arguments;

    log.d('parseInComingMessage', 'rawText=' + rawText);
    inMessageManager = this;

    if (!rawText) {
      return null;
    }

    htmlText = inMessageManager.chatManager.parseRawMessageTextForDom(rawText);
    time = Date.now();
    type = 'system';

    // Is this a command?
    if (rawText[0] === '/') {
      if (result = params.IN_COMMANDS.msg.regex.exec(rawText)) {
        type = 'in';
        command = 'msg';
        arguments = [result[1], result[2]];
      } else if (result = params.IN_COMMANDS.pubmsg.regex.exec(rawText)) {
        type = 'in';
        command = 'pubmsg';
        arguments = [result[1], result[2], result[3]];
      } else if (result = params.IN_COMMANDS.userleftroom.regex.exec(rawText)) {
        command = 'userleftroom';
        arguments = [result[1], result[2]];
      } else if (result = params.IN_COMMANDS.userjoinedroom.regex.exec(rawText)) {
        command = 'userjoinedroom';
        arguments = [result[1], result[2]];
      } else if (result = params.IN_COMMANDS.userleftserver.regex.exec(rawText)) {
        command = 'userleftserver';
        arguments = [result[1]];
      } else if (result = params.IN_COMMANDS.userjoinedserver.regex.exec(rawText)) {
        command = 'userjoinedserver';
        arguments = [result[1]];
      } else if (result = params.IN_COMMANDS.userchangedname.regex.exec(rawText)) {
        command = 'userchangedname';
        arguments = [result[1], result[2]];
      } else if (result = params.IN_COMMANDS.roomcreated.regex.exec(rawText)) {
        command = 'roomcreated';
        arguments = [result[1]];
      } else if (result = params.IN_COMMANDS.roomdestroyed.regex.exec(rawText)) {
        command = 'roomdestroyed';
        arguments = [result[1]];
      } else if (result = params.IN_COMMANDS.nickinuse.regex.exec(rawText)) {
        command = 'nickinuse';
        arguments = [result[1], result[2]];
      } else if (result = params.IN_COMMANDS.pong.regex.exec(rawText)) {
        command = 'pong';
        arguments = [result[1], result[2], result[3]];
      } else if (params.IN_COMMANDS.heartbeatrequest.regex.exec(rawText)) {
        command = 'heartbeatrequest';
        arguments = [];
      } else if (params.IN_COMMANDS.heartbeat.regex.exec(rawText)) {
        command = 'heartbeat';
        arguments = [result[1], result[2], result[3], result[4], result[5]];
      } else {
        log.e('parseInComingMessage', 'Unknown message format: rawText=' + rawText);
        return null;
      }
    } else {
      log.e('parseInComingMessage', 'Unknown message format: rawText=' + rawText);
      return null;
    }

    return new Message(rawText, htmlText, null, time, type, command, arguments);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   *
   * @function InMessageManager#init
   * @param {ChatManager} chatManager
   */
  function init(chatManager) {
    var inMessageManager = this;

    inMessageManager.chatManager = chatManager;
  }

  /**
   *
   * @function InMessageManager#handleInComingMessage
   * @param {String} rawText
   */
  function handleInComingMessage(rawText) {
    var inMessageManager, message;

    log.d('handleInComingMessage');
    inMessageManager = this;

    message = parseInComingMessage.call(inMessageManager, rawText);

    if (!message) {
      return;
    }

    switch (message.command) {
      case 'msg':
        receivedPrivateMessage.call(inMessageManager, message);
        break;
      case 'pubmsg':
        receivedRoomMessage.call(inMessageManager, message);
        break;
      case 'userleftroom':
        userLeftRoom.call(inMessageManager, message);
        break;
      case 'userjoinedroom':
        userJoinedRoom.call(inMessageManager, message);
        break;
      case 'userleftserver':
        userLeftServer.call(inMessageManager, message);
        break;
      case 'userjoinedserver':
        userJoinedServer.call(inMessageManager, message);
        break;
      case 'userchangedname':
        userChangedName.call(inMessageManager, message);
        break;
      case 'roomcreated':
        roomCreated.call(inMessageManager, message);
        break;
      case 'roomdestroyed':
        roomDestroyed.call(inMessageManager, message);
        break;
      case 'nickinuse':
        handleNickInUse.call(inMessageManager, message);
        break;
      case 'pong':
        handlePong.call(inMessageManager, message);
        break;
      case 'heartbeatrequest':
        handleHeartbeatRequest.call(inMessageManager, message);
        break;
      case 'heartbeat':
        handleHeartbeat.call(inMessageManager, message);
        break;
      default:
        break;
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function InMessageManager.initStaticFields
   */
  function initStaticFields() {
    he = app.he;
    params = app.params;
    util = app.util;
    log = new app.Log('InMessageManager');
    Room = app.Room;
    User = app.User;
    Message = app.Message;
    ChatManager = app.ChatManager;
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {SocketManager} socketManager
   */
  function InMessageManager(socketManager) {
    var inMessageManager = this;

    inMessageManager.socketManager = socketManager;
    inMessageManager.chatManager = null;

    inMessageManager.init = init;
    inMessageManager.handleInComingMessage = handleInComingMessage;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.InMessageManager = InMessageManager;
  InMessageManager.initStaticFields = initStaticFields;

  console.log('InMessageManager module loaded');
})();
