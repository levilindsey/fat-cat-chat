/**
 * This module defines a constructor for IOManager objects.
 * @module IOManager
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var params, util, log;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   *
   * @function IOManager#sendMessage
   * @param message
   */
  function sendMessage(message) {
    // TODO:
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function IOManager.initStaticFields
   */
  function initStaticFields() {
    params = app.params;
    util = app.util;
    log = new app.Log('IOManager');
    log.d('initStaticFields', 'Module initialized');
  }

  /**
   *
   * @function IOManager.parseOutGoingMessage
   * @param {String} rawText
   * @param {String} htmlText
   * @param {User} thisUser
   * @param {User|null} privateChatUser
   * @param {Boolean} isPrivateMessage
   * @returns {Message}
   */
  function parseOutGoingMessage(rawText, htmlText, thisUser, privateChatUser, isPrivateMessage) {
    var time, type, result, command, arguments;

    if (!rawText) {
      return null;
    }

    time = Date.now();

    // Is this a command?
    if (rawText[0] === '/') {
      type = 'command';

      if (params.COMMANDS.help.regex.exec(rawText)) {
        command = 'help';
      } else if (params.COMMANDS.rooms.regex.exec(rawText)) {
        command = 'rooms';
      } else if (result = params.COMMANDS.join.regex.exec(rawText)) {
        if (rawText.lastIndexOf(' ') > 5) {
          type = 'error';
          command = 'none';
          arguments = ['Room names cannot contain spaces'];
        } else {
          command = 'join';
          arguments = [result[1]];
        }
      } else if (result = params.COMMANDS.msg.regex.exec(rawText)) {
        command = 'msg';
        arguments = [result[1], result[2]];
      } else if (result = params.COMMANDS.nick.regex.exec(rawText)) {
        if (rawText.lastIndexOf(' ') > 5) {
          type = 'error';
          command = 'none';
          arguments = ['User names cannot contain spaces'];
        } else {
          command = 'nick';
          arguments = [result[1]];
        }
      } else if (result = params.COMMANDS.ping.regex.exec(rawText)) {
        command = 'ping';
        arguments = [result[1]];
      } else if (result = params.COMMANDS.ignore.regex.exec(rawText)) {
        command = 'ignore';
        arguments = [result[1]];
      } else if (params.COMMANDS.leave.regex.exec(rawText)) {
        command = 'leave';
      } else if (params.COMMANDS.quit.regex.exec(rawText)) {
        command = 'quit';
      } else {
        // Print an error message to the user, because she entered an invalid command
        type = 'error';
        command = 'none';
        arguments = ['Invalid command'];
      }
    } else {
      type = 'out';

      if (isPrivateMessage) {
        command = 'msg';
        rawText = '/msg ' + privateChatUser.name + ' (' + rawText + ')';
      } else { // Normal, public message
        command = 'none';
      }
    }

    return new Message(rawText, htmlText, thisUser, time, type, command, arguments);
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   */
  function IOManager() {
    var ioManager = this;

    ioManager.sendMessage = sendMessage;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.IOManager = IOManager;
  IOManager.initStaticFields = initStaticFields;
  IOManager.parseOutGoingMessage = parseOutGoingMessage;

  console.log('IOManager module loaded');
})();
