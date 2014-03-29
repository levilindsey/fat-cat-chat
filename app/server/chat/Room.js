/**
 * This module defines a constructor for Room objects.
 * @module Room
 */

/**
 * @function Room~computeUsersInRoomString
 * @param {Array.<Number>} userIds
 * @param {Array.<User>} allUsers
 * @returns {String}
 */
function computeUsersInRoomString(userIds, allUsers) {
  var i, count, usersInRoomString;

  if (userIds.length > 0) {
    usersInRoomString = allUsers[userIds[0]].name;
    for (i = 1, count = userIds.length; i < count; i++) {
      usersInRoomString += ' ' + allUsers[userIds[i]].name;
    }
    return usersInRoomString;
  } else {
    return '';
  }
}

/**
 * @function Room~removeUser
 * @param {Array.<Number>} userIds
 * @param {Number} userId
 */
function removeUser(userIds, userId) {
  var index = userIds.indexOf(userId);

  if (index >= 0) {
    userIds.splice(index, 1);
  }
}

/**
 * @function Room~multicastMessageToHumanUsers
 * @param {Message} message
 * @param {Array.<Number>} userIds
 * @param {chatManager} chatManager
 */
function multicastMessageToHumanUsers(message, userIds, chatManager) {
  var i, count, user, socket;

  for (i = 0, count = userIds.length; i < count; i++) {
    user = chatManager.allUsers[userIds[i]];

    // Don't send room messages to bots
    if (!user.isBot) {
      socket = chatManager.allSockets[user.socketId];
      chatManager.socketManager.unicastMessage(socket, message.text);
    }
  }
}

/**
 * @constructor
 * @global
 * @param {String} name The name of this room.
 * @param {Object} chatManager The chatManager module.
 */
module.exports = function Room(name, chatManager) {
  var room, userIds, usersInRoomString;

  room = this;
  userIds = [];
  usersInRoomString = '';

  room.chatManager = chatManager;
  room.name = name;
  room.id = -1;

  room.addUser = function(userId) {
    userIds.push(userId);
    room.updateUsersInRoomString();
  };
  room.removeUser = function(userId) {
    removeUser(userIds, userId);
    room.updateUsersInRoomString();
  };
  room.isEmpty = function() {
    return userIds.length === 0;
  };
  room.getUsersInRoomString = function() {
    return usersInRoomString;
  };
  room.multicast = function(message) {
    multicastMessageToHumanUsers(message, userIds, room.chatManager);
  };
  room.updateUsersInRoomString = function() {
    usersInRoomString = computeUsersInRoomString(userIds, chatManager.allUsers);
  }
};

console.log('Room module loaded');
