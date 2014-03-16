/**
 * This module defines a constructor for Room objects.
 * @module Room
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var params, util, log;

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

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function Room.initStaticFields
   */
  function initStaticFields() {
    params = app.params;
    util = app.util;
    log = new app.Log('Room');
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {String} name The name of this room.
   * @param {Array.<User>} users The users in this room.
   * @param {Number} startTime The first time this room was detectable by this client.
   */
  function Room(name, users, startTime) {
    var room = this;

    room.name = name;
    room.users = users;
    room.startTime = startTime;
    room.removeUser = removeUser;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.Room = Room;
  Room.initStaticFields = initStaticFields;

  console.log('Room module loaded');
})();
