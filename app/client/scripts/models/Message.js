/**
 * This module defines a constructor for Message objects.
 * @module Message
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var params, util, log;

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function Message.initStaticFields
   */
  function initStaticFields() {
    params = app.params;
    util = app.util;
    log = new app.Log('Message');
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {String} rawText The raw text of this message.
   * @param {String} htmlText The text of this message parsed to include inline HTML elements.
   * @param {User} fromUser The user who sent this message.
   * @param {Number} time The time this message arrived.
   * @param {'in'|'out'|'command'|'system'|'error'|'room'|'user'} type The message type.
   * @param {'none'|'help'|'rooms'|'join'|'msg'|'nick'|'ping'|'ignore'|'leave'|'quit'} command The message command type.
   * @param {Array.<String>} arguments The different arguments used with this command.
   */
  function Message(rawText, htmlText, fromUser, time, type, command, arguments) {
    var message = this;

    message.rawText = rawText;
    message.htmlText = htmlText;
    message.fromUser = fromUser;
    message.time = time;
    message.type = type;
    message.command = command;
    message.arguments = arguments;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.Message = Message;
  Message.initStaticFields = initStaticFields;

  console.log('Message module loaded');
})();
