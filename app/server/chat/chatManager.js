/**
 * This module defines a constructor for chatManager objects.
 * @module chatManager
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   *
   * @function chatManager~addRoom
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
   *
   * @function chatManager~removeRoom
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
   *
   * @function chatManager~addUser
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
   *
   * @function chatManager~removeUser
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
   *
   * @function chatManager~addUserToRoom
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
   *
   * @function chatManager~removeUserFromRoom
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
   *
   * @function chatManager~changeUserName
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

  /**
   *
   * @function chatManager~findIndexByPropertyValue
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
   *
   * @function chatManager.init
   */
  function init() {// TODO: call this from somewhere!!
    chatManager.socketManager = app.socketManager;
    chatManager.socketManager.init();
  }

  /**
   *
   * @function chatManager.getRoomFromName
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
   *
   * @function chatManager.getUserFromName
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

  // ------------------------------------------------------------------------------------------- //
  // Expose this static module

  /**
   * @global
   */
  var chatManager = {
    socketManager: null,
    allUsers: [],
    allRooms: [],
    init: init,
    getUserFromName: getUserFromName,
    getRoomFromName: getRoomFromName
  };

  // Expose this module
  if (!window.app) window.app = {};
  window.app.chatManager = chatManager;

  console.log('chatManager module loaded');
})();
