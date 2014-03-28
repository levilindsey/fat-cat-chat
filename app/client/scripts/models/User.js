/**
 * This module defines a constructor for User objects.
 * @module User
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var params, util, log;

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function User.initStaticFields
   */
  function initStaticFields() {
    params = app.params;
    util = app.util;
    log = new app.Log('User');
    log.d('initStaticFields', 'Module initialized');
  }

  /**
   * @function User.initUserInstance
   * @param {User} user
   * @param {String} name
   * @param {Number} startTime
   */
  function initUserInstance(user, name, startTime) {
    user.name = null;
    user.nameRegex = null;
    user.startTime = startTime;
    user.isIgnored = false;
    // These are the private chat messages sent this user and the local user
    user.privateMessages = [];
    user.room = null;
    user.privateChatUser = null;

    user.setName = function (name) {
      user.name = name;
      user.nameRegex = new RegExp('\\b' + name + '\\b', 'g');
    };

    user.setName(name);
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {String} name The name of this user.
   * @param {Number} startTime The first time this user was detectable by this client.
   */
  function User(name, startTime) {
    var user = this;
    initUserInstance(user, name, startTime);
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.User = User;
  User.initStaticFields = initStaticFields;
  User.initUserInstance = initUserInstance;

  console.log('User module loaded');
})();
