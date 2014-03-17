/**
 * This module defines a constructor for Room objects.
 * @module Room
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   *
   * @function Room#removeUser
   * @param {User} user
   */
  function removeUser(user) {
    var room, index;

    room = this;

    if (user) {
      index = room.users.indexOf(user);

      if (index >= 0) {
        room.users.splice(index, 1);
      }
    }
  }

  /**
   *
   * @function Room#getUserFromName
   * @param {String} userName
   * @returns {User}
   */
  function getUserFromName(userName) {
    var room, i, count;

    room = this;

    for (i = 0, count = room.users.length; i < count; i++) {
      if (room.users[i].name === userName) {
        return room.users[i];
      }
    }

    return null;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {String} name The name of this room.
   */
  function Room(name) {
    var room = this;

    room.name = name;
    room.users = [];
    room.removeUser = removeUser;
    room.getUserFromName = getUserFromName;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.Room = Room;

  console.log('Room module loaded');
})();
