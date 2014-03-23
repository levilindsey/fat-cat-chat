/**
 * This module defines a constructor for chatManager objects.
 * @module chatManager
 */

// ------------------------------------------------------------------------------------------- //
// Private static variables

var HEARTBEAT_REQUEST_INTERVAL = 8000, // in milliseconds
    IN_COMING_COMMANDS = {
      msg: {
        // /msg <from_user> <to_user> (<message>)
        regex: /^\/msg (\S+) (\S+) \((.*)\)$/
      },
      pubmsg: {
        // /pubmsg <user_name> <room_name> (<message>)
        regex: /^\/pubmsg (\S+) (\S+) \((.*)\)$/
      },
      join: {
        // /join <user_name> <room_name>
        regex: /^\/join (\S+) (\S+)$/
      },
      nick: {
        // /nick <old_name> <new_name>
        regex: /^\/nick (\S+) (\S+)$/
      },
      ping: {
        // /ping <from_user> <to_user>
        regex: /^\/ping (\S+) (\S+)$/
      },
      leave: {
        // /leave <user_name> <room_name>
        regex: /^\/leave (\S+) (\S+)$/
      },
      quit: {
        // /quit <user_name>
        regex: /^\/quit (\S+)$/
      },
      heartbeatrequest: {
        // /heartbeatrequest <user_name>
        regex: /^\/heartbeatrequest (\S+)$/
      },
      heartbeat: {
        // /heartbeat <user_name> [<room_name>|/none]
        regex: /^\/heartbeat (\S+) (\S+)$/
      }
    };

var Message, User, Room, nextSocketId, nextMessageId, nextUserId, nextRoomId, usersString, roomsString;

Message = require('./Message');
User = require('./User');
Room = require('./Room');

nextSocketId = 1;
nextMessageId = 1;
nextUserId = 1;
nextRoomId = 1;

usersString = '';
roomsString = '';

// ------------------------------------------------------------------------------------------- //
// Private static functions

/**
 * /msg <from_user> <to_user> (<message>)
 * @function chatManager~forwardPrivateMessage
 * @param {Number} fromUserId
 * @param {Number} toUserId
 * @param {String} text
 * @param {Number} fromSocketId
 */
function forwardPrivateMessage(fromUserId, toUserId, text, fromSocketId) {
  var fromUser, toUser, message;

  console.log('   forwardPrivateMessage: fromUserId=' + fromUserId + ', toUserId=' + toUserId + ', text=' + text + ', fromSocketId=' + fromSocketId);

  // Validate the input
  if (fromUserId < 0) {
    text = 'No such user';
    sendErrorMessage(text, chatManager.allSockets[fromSocketId]);
    return;
  }
  if (toUserId < 0) {
    text = 'No such user';
    sendErrorMessage(text, fromUserId);
    return;
  }

  fromUser = chatManager.allUsers[fromUserId];
  toUser = chatManager.allUsers[toUserId];

  // Send a message to the client
  text = '/msg ' + fromUser.name + ' ' + toUser.name + ' (' + text + ')';
  message = new Message(text, fromUserId, toUserId, 0, 'msg');
  recordOutGoingMessage(message);
  chatManager.socketManager.unicastMessage(chatManager.allSockets[toUser.socketId], text);
}

/**
 * /pubmsg <user_name> <room_name> (<message>)
 * @function chatManager~forwardRoomMessage
 * @param {Number} userId
 * @param {Number} roomId
 * @param {String} text
 * @param {Number} socketId
 */
function forwardRoomMessage(userId, roomId, text, socketId) {
  var user, room, message;

  console.log('   forwardRoomMessage: userId=' + userId + ', roomId=' + roomId + ', text=' + text + ', socketId=' + socketId);

  // Validate the input
  if (userId < 0) {
    text = 'No such user';
    sendErrorMessage(text, chatManager.allSockets[socketId]);
    return;
  }
  if (roomId < 0) {
    text = 'No such room';
    sendErrorMessage(text, userId);
    return;
  }

  user = chatManager.allUsers[userId];
  room = chatManager.allRooms[roomId];

  // Send a message to the clients
  text = '/pubmsg ' + user.name + ' ' + room.name + ' (' + text + ')';
  message = new Message(text, userId, 0, roomId, 'pubmsg');
  recordOutGoingMessage(message);
  room.multicast(message);
}

/**
 * /ping <from_user> <to_user>
 * @function chatManager~handlePing
 * @param {Number} fromUserId
 * @param {Number} toUserId
 * @param {Number} fromSocketId
 */
function handlePing(fromUserId, toUserId, fromSocketId) {
  console.log('   handlePing: fromUserId=' + fromUserId + ', toUserId=' + toUserId + ', fromSocketId=' + fromSocketId);

  sendPong(toUserId, fromUserId, fromSocketId);
}

/**
 * /pong <from_user> <to_user> <time_in_millis>
 * @function chatManager~sendPong
 * @param {Number} fromUserId
 * @param {Number} toUserId
 * @param {Number} toSocketId
 */
function sendPong(fromUserId, toUserId, toSocketId) {
  var fromUser, toUser, fromUserLatency, toUserLatency, text, message;

  console.log('   sendPong: fromUserId=' + fromUserId + ', toUserId=' + toUserId + ', toSocketId=' + toSocketId);

  // Validate the input
  if (toUserId < 0) {
    text = 'No such user';
    sendErrorMessage(text, chatManager.allSockets[toSocketId]);
    return;
  }
  if (fromUserId < 0) {
    text = 'No such user';
    sendErrorMessage(text, toUserId);
    return;
  }

  fromUser = chatManager.allUsers[fromUserId];
  toUser = chatManager.allUsers[toUserId];

  fromUserLatency = fromUser.getLatency();
  toUserLatency = toUser.getLatency();

  // Check whether the user latencies have been established yet
  if (fromUserLatency === Number.POSITIVE_INFINITY || toUserLatency === Number.POSITIVE_INFINITY) {
    text = 'User latency is not yet available';
    sendErrorMessage(text, toUserId);
    return;
  }

  // Send a message to the client
  text = '/pong ' + fromUser.name + ' ' + toUser.name + ' ' + (fromUserLatency + toUserLatency);
  message = new Message(text, fromUserId, toUserId, 0, 'pong');
  recordOutGoingMessage(message);
  chatManager.socketManager.unicastMessage(chatManager.allSockets[toSocketId], text);
}

/**
 * /heartbeatrequest <user_name>
 * @function chatManager~sendHeartbeatRequest
 * @param {Number} userId
 * @param {Number} socketId
 */
function sendHeartbeatRequest(userId, socketId) {
  var user, text, message;

  console.log('   sendHeartbeatRequest: userId=' + userId + ', socketId=' + socketId);

  user = chatManager.allUsers[userId];

  // Send a message to the client
  text = '/heartbeatrequest ' + user.name;
  message = new Message(text, 0, userId, 0, 'heartbeatrequest');
  recordOutGoingMessage(message);
  chatManager.socketManager.unicastMessage(chatManager.allSockets[socketId], text);

  user.onHeartbeatRequestSent();
}

/**
 * /heartbeat <to_user_name> (<room_name_1> ...) (<user_name_1> ...) [<room_of_user>|/none] (<user_in_room_1> ...)
 * @function chatManager~sendHeartbeat
 * @param {Number} userId
 * @param {Number} socketId
 */
function sendHeartbeat(userId, socketId) {
  var user, room, roomName, usersInRoomString, text, message;

  console.log('   sendHeartbeat: userId=' + userId + ', socketId=' + socketId);

  user = chatManager.allUsers[userId];

  // Get info for the user's current room
  if (user.roomId > 0 && chatManager.allRooms[user.roomId]) {
    room = chatManager.allRooms[user.roomId];
    roomName = room.name;
    usersInRoomString = room.getUsersInRoomString();
  } else {
    roomName = '/none';
    usersInRoomString = '';
  }

  // Send a message to the client
  text = '/heartbeat ' + user.name + ' (' + roomsString + ') (' + usersString + ') ' + roomName + ' (' + usersInRoomString + ')';
  message = new Message(text, 0, userId, 0, 'heartbeat');
  recordOutGoingMessage(message);
  chatManager.socketManager.unicastMessage(chatManager.allSockets[socketId], text);
}

/**
 * This function serves to purposes: (1) it ensures that the user is still connected to the server, (2) it ensures what the user thinks about herself matches what the server thinks about her.
 * /heartbeat <user_name> [<room_name>|/none]
 * @function chatManager~handleHeartbeat
 * @param {Number} userId
 * @param {Number} roomId
 * @param {String} userName
 * @param {String} roomName
 * @param {Number} socketId
 */
function handleHeartbeat(userId, roomId, userName, roomName, socketId) {
  var user;

  console.log('   handleHeartbeat: userId=' + userId + ', roomId=' + roomId + ', userName=' + userName + ', roomName=' + roomName + ', socketId=' + socketId);

  // If this user did not previously exist, the add the new user to the list
  if (userId < 0) {
    userId = addNewUser(userName, socketId);
  }

  user = chatManager.allUsers[userId];

  // If the user is mentioning a room that does not yet exist, then create it
  if (roomId < 0 && roomName !== '/none') {
    roomId = addNewRoom(roomName);
  }

  // If the user thinks she is in a different room than the server thinks, then change her room on the server side
  if (roomId !== user.roomId) {
    if (roomName !== '/none') {
      // The user thinks she is in a room
      if (user.roomId > 0) {
        // The server thinks the user is in a DIFFERENT room
        removeUserFromRoom(userId, user.roomId, socketId);
      }
      addUserToRoom(userId, roomId, roomName, socketId);
    } else {
      // The user thinks she is NOT in a room, and the server thinks she IS in a room
      removeUserFromRoom(userId, user.roomId, socketId);
    }
  }

  user.onHeartbeatReceived();

  // TODO: somewhere else: remove users from the server when they have not been heard from in too long a time
  // - this means we will need to keep track of (within the User class) how long it has been since we have heard from the user
}

/**
 * /userjoinedserver <user_name>
 * @function chatManager~addNewUser
 * @param {String} userName
 * @param {Number} socketId
 * @returns {Number} The new user ID.
 */
function addNewUser(userName, socketId) {
  var user, text, message;

  console.log('   addNewUser: userName=' + userName);

  // Add the user
  user = new User(userName, socketId);
  user.id = nextUserId++;
  chatManager.allUsers[user.id] = user;
  updateUsersString();

  // Send a message to the clients
  text = '/userjoinedserver ' + user.name;
  message = new Message(text, 0, 0, 0, 'userjoinedserver');
  recordOutGoingMessage(message);
  chatManager.socketManager.broadcastMessage(text);

  return user.id;
}

/**
 * /userleftserver <user_name>
 * @function chatManager~removeUser
 * @param {Number} userId
 * @param {Number} socketId
 */
function removeUser(userId, socketId) {
  var user, room, text, message;

  console.log('   removeUser: userId=' + userId + ', socketId=' + socketId);

  // Validate the input
  if (userId < 0) {
    text = 'No such user';
    sendErrorMessage(text, chatManager.allSockets[socketId]);
    return;
  }

  // Remove the user
  user = chatManager.allUsers[userId];
  chatManager.allUsers[userId] = null;
  updateUsersString();

  // Remove the user from the room she was in (if there was a room)
  if (user.roomId > 0) {
    room = chatManager.allRooms[user.roomId];
    user.roomId = -1;
    room.removeUser(userId);
  }

  // Send a message to the clients
  text = '/userleftserver ' + user.name;
  message = new Message(text, 0, 0, 0, 'userleftserver');
  recordOutGoingMessage(message);
  chatManager.socketManager.broadcastMessage(text);
}

/**
 * /userchangedname <old_name> <new_name>
 * @function chatManager~changeUserName
 * @param {Number} userId
 * @param {String} newName
 * @param {Number} socketId
 */
function changeUserName(userId, newName, socketId) {
  var user, oldName, text, message;

  console.log('   changeUserName: userId=' + userId + ', newName=' + newName + ', socketId=' + socketId);

  // Validate the input
  if (userId < 0) {
    text = 'No such user';
    sendErrorMessage(text, chatManager.allSockets[socketId]);
    return;
  }

  // Check whether this name is already in use
  if (getUserIdFromName(newName) >= 0) {
    text = 'Unable to change your nickname to ' + newName;
    sendErrorMessage(text, userId);
  } else {
    // Change the user's name
    user = chatManager.allUsers[userId];
    oldName = user.name;
    user.name = newName;
    updateUsersString();

    // Send a message to the clients
    text = '/userchangedname ' + oldName + ' ' + newName;
    message = new Message(text, 0, 0, 0, 'userchangedname');
    recordOutGoingMessage(message);
    chatManager.socketManager.broadcastMessage(text);
  }
}

/**
 * /userjoinedroom <user_name> <room_name>
 * @function chatManager~addUserToRoom
 * @param {Number} userId
 * @param {Number} roomId
 * @param {String} roomName
 * @param {Number} socketId
 */
function addUserToRoom(userId, roomId, roomName, socketId) {
  var user, room, text, message;

  console.log('   addUserToRoom: userId=' + userId + ', roomId=' + roomId + ', roomName=' + roomName + ', socketId=' + socketId);

  // Validate the input
  if (userId < 0) {
    text = 'No such user';
    sendErrorMessage(text, chatManager.allSockets[socketId]);
    return;
  }

  // If the room did not yet exist, then create it
  if (roomId < 0) {
    roomId = addNewRoom(roomName);
  }

  // Add the user to the room
  user = chatManager.allUsers[userId];
  room = chatManager.allRooms[roomId];
  user.roomId = roomId;
  room.addUser(userId);

  // Send a message to the clients
  text = '/userjoinedroom ' + user.name + ' ' + room.name;
  message = new Message(text, 0, 0, roomId, 'userjoinedroom');
  recordOutGoingMessage(message);
  room.multicast(message);
}

/**
 * /userleftroom <user_name> <room_name>
 * @function chatManager~removeUserFromRoom
 * @param {Number} userId
 * @param {Number} roomId
 * @param {Number} socketId
 */
function removeUserFromRoom(userId, roomId, socketId) {
  var user, room, text, message;

  console.log('   removeUserFromRoom: userId=' + userId + ', roomId=' + roomId + ', socketId=' + socketId);

  // Validate the input
  if (userId < 0) {
    text = 'No such user';
    sendErrorMessage(text, chatManager.allSockets[socketId]);
    return;
  }
  if (roomId < 0) {
    text = 'No such room';
    sendErrorMessage(text, userId);
    return;
  }

  // Remove the user from the room
  user = chatManager.allUsers[userId];
  room = chatManager.allRooms[roomId];
  user.roomId = -1;
  room.removeUser(userId);

  // If this was the last user in the room, then remove the room
  if (room.isEmpty()) {
    removeRoom(roomId);
  }

  // Send a message to the clients
  text = '/userleftroom ' + user.name + ' ' + room.name;
  message = new Message(text, 0, 0, roomId, 'userleftroom');
  recordOutGoingMessage(message);
  room.multicast(message);
}

/**
 * /roomcreated <room_name>
 * @function chatManager~addNewRoom
 * @param {String} roomName
 * @returns {Number} The new room ID.
 */
function addNewRoom(roomName) {
  var room, text, message;

  console.log('   addNewRoom: roomName=' + roomName);

  // Add the room
  room = new Room(roomName, chatManager);
  room.id = nextRoomId++;
  chatManager.allRooms[room.id] = room;
  updateRoomsString();

  // Send a message to the clients
  text = '/roomcreated ' + room.name;
  message = new Message(text, 0, 0, 0, 'roomcreated');
  recordOutGoingMessage(message);
  chatManager.socketManager.broadcastMessage(text);

  return room.id;
}

/**
 * /roomdestroyed <room_name>
 * @function chatManager~removeRoom
 * @param {Number} roomId
 */
function removeRoom(roomId) {
  var room, text, message;

  console.log('   removeRoom: roomId=' + roomId);

  // Remove the room
  room = chatManager.allRooms[roomId];
  chatManager.allRooms[roomId] = null;
  updateRoomsString();

  // Send a message to the clients
  text = '/roomdestroyed ' + room.name;
  message = new Message(text, 0, 0, 0, 'roomdestroyed');
  recordOutGoingMessage(message);
  chatManager.socketManager.broadcastMessage(text);
}

/**
 * /error [<user_name>|/all] (<message>)
 * @function
 * @param {String} text The text of the error message to send.
 * @param {Object|Number|null} receiverEntity The userId or socket to send the error message to. If null, then the message will be broadcast to all sockets.
 */
function sendErrorMessage(text, receiverEntity) {
  var message, user, socket;

  console.log('   sendErrorMessage: text=' + text);

  if (!receiverEntity) {
    // Send the error message to all sockets/users
    text = '/error /all (' + text + ')';
    message = new Message(text, 0, 0, 0, 'error');
    recordOutGoingMessage(message);
    chatManager.socketManager.broadcastMessage(text);
  } else if (typeof receiverEntity === 'number') {
    user = chatManager.allUsers[receiverEntity];
    socket = chatManager.allSockets[user.socketId];

    // Send the error message to the given user
    text = '/error ' + user.name + ' (' + text + ')';
    message = new Message(text, 0, receiverEntity, 0, 'error');
    recordOutGoingMessage(message);
    chatManager.socketManager.unicastMessage(socket, text);
  } else {
    // Send the error message to all users at the given socket
    text = '/error /all (' + text + ')';
    message = new Message(text, 0, 0, 0, 'error');
    recordOutGoingMessage(message);
    chatManager.socketManager.unicastMessage(receiverEntity, text);
  }
}

/**
 * @function chatManager~getRoomFromName
 * @param {String} roomName
 * @returns {Number} The room ID.
 */
function getRoomIdFromName(roomName) {
  var i, count, room;

  for (i = 1, count = chatManager.allRooms.length; i < count; i++) {
    room = chatManager.allRooms[i];
    if (room && room.name === roomName) {
      return room.id;
    }
  }

  return -1;
}

/**
 * @function chatManager~getUserFromName
 * @param {String} userName
 * @returns {Number} The user ID.
 */
function getUserIdFromName(userName) {
  var i, count, user;

  for (i = 1, count = chatManager.allUsers.length; i < count; i++) {
    user = chatManager.allUsers[i];
    if (user && user.name === userName) {
      return user.id;
    }
  }

  return -1;
}

/**
 * @function chatManager~updateUsersString
 */
function updateUsersString() {
  var i, count;

  usersString = '';

  // Concatenate all users' names, delimited by spaces
  for (i = 0, count = chatManager.allUsers.length; i < count; i++) {
    usersString += chatManager.allUsers[i] ? chatManager.allUsers[i].name + ' ' : '';
  }

  // If we added anything to the users string, then remove the trailing space
  if (usersString) {
    usersString = usersString.substr(0, usersString.length - 1);
  }
}

/**
 * @function chatManager~updateRoomsString
 */
function updateRoomsString() {
  var i, count;

  roomsString = '';

  // Concatenate all rooms' names, delimited by spaces
  for (i = 0, count = chatManager.allRooms.length; i < count; i++) {
    roomsString += chatManager.allRooms[i] ? chatManager.allRooms[i].name + ' ' : '';
  }

  // If we added anything to the rooms string, then remove the trailing space
  if (roomsString) {
    roomsString = roomsString.substr(0, roomsString.length - 1);
  }
}

/**
 * @function chatManager~parseAndRecordInComingMessage
 * @param {String} text
 * @param {Number} socketId
 * @returns {Message}
 */
function parseAndRecordInComingMessage(text, socketId) {
  var result, fromUserId, toUserId, roomId, command, arguments, message;

  toUserId = 0;
  roomId = 0;

  if (result = IN_COMING_COMMANDS.msg.regex.exec(text)) {
    command = 'msg';
    arguments = [result[1], result[2], result[3]];
    toUserId = getUserIdFromName(arguments[1]);
  } else if (result = IN_COMING_COMMANDS.pubmsg.regex.exec(text)) {
    command = 'pubmsg';
    arguments = [result[1], result[2], result[3]];
    roomId = getRoomIdFromName(arguments[1]);
  } else if (result = IN_COMING_COMMANDS.join.regex.exec(text)) {
    command = 'join';
    arguments = [result[1], result[2]];
    roomId = getRoomIdFromName(arguments[1]);
  } else if (result = IN_COMING_COMMANDS.nick.regex.exec(text)) {
    command = 'nick';
    arguments = [result[1], result[2]];
  } else if (result = IN_COMING_COMMANDS.ping.regex.exec(text)) {
    command = 'ping';
    arguments = [result[1], result[2]];
    toUserId = getUserIdFromName(arguments[1]);
  } else if (result = IN_COMING_COMMANDS.leave.regex.exec(text)) {
    command = 'leave';
    arguments = [result[1], result[2]];
    roomId = getRoomIdFromName(arguments[1]);
  } else if (result = IN_COMING_COMMANDS.quit.regex.exec(text)) {
    command = 'quit';
    arguments = [result[1]];
  } else if (result = IN_COMING_COMMANDS.heartbeatrequest.regex.exec(text)) {
    command = 'heartbeatrequest';
    arguments = [result[1]];
  } else if (result = IN_COMING_COMMANDS.heartbeat.regex.exec(text)) {
    command = 'heartbeat';
    arguments = [result[1], result[2]];
    roomId = getRoomIdFromName(arguments[1]);
  } else {
    text = 'Unknown message format: ' + text;
    console.log('***ERROR: parseAndRecordInComingMessage: ' + text);
    sendErrorMessage(text, chatManager.allSockets[socketId]);
    return null;
  }

  fromUserId = getUserIdFromName(arguments[0]);

  message = new Message(text, fromUserId, toUserId, roomId, command, arguments);

  message.id = nextMessageId++;
  chatManager.allMessages[message.id] = message;

  return message;
}

/**
 * @function chatManager~recordOutGoingMessage
 * @param {Message} message
 * @returns {Message}
 */
function recordOutGoingMessage(message) {
  message.id = nextMessageId++;
  chatManager.allMessages[message.id] = message;

  return message;
}

/**
 * chatManager~requestHeartbeats
 */
function requestHeartbeats() {
  var i, count, user;

  console.log('   requestHeartbeats');

  try
  {
    for (i = 0, count = chatManager.allUsers.length; i < count; i++) {
      user = chatManager.allUsers[i];
      if (user) {
        sendHeartbeatRequest(user.id, user.socketId);
      }
    }
  }
  catch (e)
  {
    console.log('***ERROR THROWN: requestHeartbeats: ' + e);
    console.log('***ERROR STACK: ' + e.stack);
  }
}

// ------------------------------------------------------------------------------------------- //
// Public static functions

/**
 * @function chatManager.handleNewConnection
 * @param {Object} socket
 * @returns {Number} The socketId.
 */
function handleNewConnection(socket) {
  var socketId = nextSocketId++;
  chatManager.allSockets[socketId] = socket;
  return socketId;
}

/**
 * @function chatManager.handleNewMessage
 * @param {Number} socketId
 * @param {String} text
 */
function handleNewMessage(socketId, text) {
  var message;

  try
  {
    message = parseAndRecordInComingMessage(text, socketId);

    if (!message) {
      return;
    }

    // Message references only valid users and rooms
    switch (message.command) {
      case 'msg':
        forwardPrivateMessage(message.fromUserId, message.toUserId, message.arguments[2], socketId);
        break;
      case 'pubmsg':
        forwardRoomMessage(message.fromUserId, message.roomId, message.arguments[2], socketId);
        break;
      case 'join':
        addUserToRoom(message.fromUserId, message.roomId, message.arguments[1], socketId);
        break;
      case 'nick':
        changeUserName(message.fromUserId, message.arguments[1], socketId);
        break;
      case 'ping':
        handlePing(message.fromUserId, message.toUserId, socketId);
        break;
      case 'leave':
        removeUserFromRoom(message.fromUserId, message.roomId, socketId);
        break;
      case 'quit':
        removeUser(message.fromUserId, socketId);
        break;
      case 'heartbeatrequest':
        sendHeartbeat(message.fromUserId, socketId);
        break;
      case 'heartbeat':
        handleHeartbeat(message.fromUserId, message.roomId, message.arguments[0], message.arguments[1], socketId);
        break;
      default:
        text = 'Invalid message command: ' + message.command;
        console.log('***ERROR: handleNewMessage: ' + text);
        sendErrorMessage(text, chatManager.allSockets[socketId]);
        return;
    }
  }
  catch (e)
  {
    console.log('***ERROR THROWN: handleNewMessage: ' + e);
    console.log('***ERROR STACK: ' + e.stack);
  }
}

// ------------------------------------------------------------------------------------------- //
// Expose this static module

/**
 * @global
 */
var chatManager = {
  socketManager: require('./socketManager'),
  allSockets: [],
  allMessages: [],
  allUsers: [],
  allRooms: [],
  handleNewConnection: handleNewConnection,
  handleNewMessage: handleNewMessage
};

chatManager.socketManager.init(chatManager);

setInterval(requestHeartbeats, HEARTBEAT_REQUEST_INTERVAL);

// Expose this module
module.exports = chatManager;

console.log('chatManager module loaded');
