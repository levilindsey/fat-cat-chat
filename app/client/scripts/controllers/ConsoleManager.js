/**
 * This module defines a constructor for ConsoleManager objects.
 * @module ConsoleManager
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var he, params, util, log, Room, User, Message;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Gets references to the various Consoles.
   * @function ConsoleManager~setUpElements
   */
  function setUpElements() {
    var consoleManager = this;

    consoleManager.consoles = consoleManager.uiManager.consoles;
  }

  /**
   *
   * @function ConsoleManager~parseRooms
   * @param {String} text
   * @returns {String}
   */
  function parseRooms(text) {
    var consoleManager = this;
    consoleManager.allRooms.forEach(function (room) {
      text = text.replace(room.name, '<code class=\'room\'>' + room.name + '</code>');
    });
    return text;
  }

  /**
   *
   * @function ConsoleManager~parseUsers
   * @param {String} text
   * @returns {String}
   */
  function parseUsers(text) {
    var consoleManager = this;
    consoleManager.allUsers.forEach(function (user) {
      text = text.replace(user.name, '<code class=\'user\'>' + user.name + '</code>');
    });
    return text;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   *
   * @function ConsoleManager#init
   * @param {IOManager} ioManager
   */
  function init(ioManager) {
    var consoleManager = this;

    consoleManager.ioManager = ioManager;

    setUpElements.call(consoleManager);
  }

  /**
   *
   * @function ConsoleManager#parseRawMessageTextForDom
   * @param {String} text
   * @returns {String}
   */
  function parseRawMessageTextForDom(text) {
    var consoleManager = this;

    // Encode HTML entities so that the text may be safely inserted into the HTML document
    text = he.encode(text);

    // Replace any substrings that represent commands, emoticons, current rooms, current users, or links with decorated versions
    // TODO: add event handlers to the inline elements created in each of the following functions
    text = parseCommands(text);
    text = parseEmoticons(text);
    text = parseRooms.call(consoleManager, text);
    text = parseUsers.call(consoleManager, text);
    // TODO: parseURLs

    return text;
  }

  /**
   *
   * @function ConsoleManager#getRoomFromName
   * @param {String} roomName
   * @returns {Room}
   */
  function getRoomFromName(roomName) {
    var consoleManager, i, count;

    consoleManager = this;

    for (i = 0, count = consoleManager.allRooms.length; i < count; i++) {
      if (consoleManager.allRooms[i].name === roomName) {
        return consoleManager.allRooms[i];
      }
    }

    return null;
  }

  /**
   *
   * @function ConsoleManager#getUserFromName
   * @param {String} userName
   * @returns {User}
   */
  function getUserFromName(userName) {
    var consoleManager, i, count;

    consoleManager = this;

    for (i = 0, count = consoleManager.allUsers.length; i < count; i++) {
      if (consoleManager.allUsers[i].name === userName) {
        return consoleManager.allUsers[i];
      }
    }

    return null;
  }

  /**
   *
   * @function ConsoleManager#parseInternalSystemMessage
   * @param {String} rawText
   * @returns {Message}
   */
  function parseInternalSystemMessage(rawText) {
    var consoleManager, time, htmlText;

    consoleManager = this;
    time = Date.now();
    htmlText = consoleManager.parseRawMessageTextForDom(rawText);

    return new Message(rawText, htmlText, null, time, 'system', null, null);
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function ConsoleManager.initStaticFields
   */
  function initStaticFields() {
    he = app.he;
    params = app.params;
    util = app.util;
    log = new app.Log('ConsoleManager');
    Room = app.Room;
    User = app.User;
    Message = app.Message;
    log.d('initStaticFields', 'Module initialized');
  }

  /**
   *
   * @function ConsoleManager~parseCommands
   * @param {String} text
   * @returns {String}
   */
  function parseCommands(text) {
    var property;

    // TODO: replace /link commands with <a> elements (use params.LINK_COMMAND)

    for (property in params.COMMANDS) {
      text = text.replace(params.COMMANDS[property].rawString, params.COMMANDS[property].htmlElement);
    }

    return text;
  }

  /**
   *
   * @function ConsoleManager~parseEmoticons
   * @param {String} text
   * @returns {String}
   */
  function parseEmoticons(text) {
    var property;

    for (property in params.EMOTICONS) {
      text = text.replace(property, params.EMOTICONS[property]);
    }

    return text;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {UIManager} uiManager
   */
  function ConsoleManager(uiManager) {
    var consoleManager = this;

    consoleManager.uiManager = uiManager;
    consoleManager.ioManager = null;
    consoleManager.thisUser = null;
    consoleManager.activeRoom = null;
    consoleManager.privateChatUser = null;
    consoleManager.allUsers = [];
    consoleManager.allRooms = [];
    consoleManager.bots = [];
    consoleManager.consoles = null;

    consoleManager.init = init;
    consoleManager.getRoomFromName = getRoomFromName;
    consoleManager.getUserFromName = getUserFromName;
    consoleManager.parseRawMessageTextForDom = parseRawMessageTextForDom;
    consoleManager.parseInternalSystemMessage = parseInternalSystemMessage;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.ConsoleManager = ConsoleManager;
  ConsoleManager.initStaticFields = initStaticFields;
  ConsoleManager.parseCommands = parseCommands;
  ConsoleManager.parseEmoticons = parseEmoticons;

  console.log('ConsoleManager module loaded');
})();
