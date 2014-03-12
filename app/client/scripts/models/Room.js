/**
 * This module defines a constructor for Room objects.
 * @module Room
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var params, util, log;

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
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.Room = Room;
  Room.initStaticFields = initStaticFields;

  console.log('Room module loaded');
})();
