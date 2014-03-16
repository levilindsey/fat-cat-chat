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

    user.name = name;
    user.startTime = startTime;
    user.isIgnored = false;
    user.privateMessages = [];
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.User = User;
  User.initStaticFields = initStaticFields;

  console.log('User module loaded');
})();
