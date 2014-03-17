/**
 * This module defines a constructor for socketManager objects.
 * @module socketManager
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   *
   * @function socketManager~receivedMessage
   * @param {String} text
   * @param {User} user
   */
  function receivedMessage(text, user) {


    console.log('socketManager.sendMessage: text=' + text + ', user=' + user.name);

    // TODO:
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   *
   * @function socketManager.init
   */
  function init() {
    socketManager.chatManager = app.chatManager;

    // TODO: set up the socket.io logic
  }

  /**
   *
   * @function socketManager.sendMessage
   * @param {String} text
   * @param {User} user
   */
  function sendMessage(text, user) {


    console.log('socketManager.sendMessage: text=' + text + ', user=' + user.name);

    // TODO:
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this static module

  /**
   * @global
   */
  var socketManager = {
    chatManager: null,
    init: init,
    sendMessage: sendMessage
  };

  // Expose this module
  if (!window.app) window.app = {};
  window.app.socketManager = socketManager;

  console.log('socketManager module loaded');
})();
