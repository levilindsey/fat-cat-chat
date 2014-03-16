/**
 * This module defines a constructor for InMessageManager objects.
 * @module InMessageManager
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var he, params, util, log, Room, User, Message, ConsoleManager;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   *
   * @function InMessageManager~receivedPrivateMessage
   * @param {String} userName
   * @param {Message} message
   */
  function receivedPrivateMessage(userName, message) {
    var inMessageManager, user, rawText;

    inMessageManager = this;

    // TODO: !!
  }

  /**
   *
   * @function InMessageManager~receivedRoomMessage
   * @param {String} userName
   * @param {String} roomName
   * @param {Message} message
   */
  function receivedRoomMessage(userName, roomName, message) {
    var inMessageManager, user, room, rawText;

    inMessageManager = this;

    // TODO: !!
  }

  /**
   *
   * @function InMessageManager~userLeftRoom
   * @param {String} userName
   * @param {String} roomName
   */
  function userLeftRoom(userName, roomName) {
    var inMessageManager, user, rawText;

    inMessageManager = this;

    // TODO: !!
  }

  /**
   *
   * @function InMessageManager~userJoinedRoom
   * @param {String} userName
   * @param {String} roomName
   */
  function userJoinedRoom(userName, roomName) {
    var inMessageManager, room, rawText;

    inMessageManager = this;

    // TODO: !!
  }

  /**
   *
   * @function InMessageManager~userLeftServer
   * @param {String} userName
   */
  function userLeftServer(userName) {
    var inMessageManager, user;

    inMessageManager = this;

    // TODO: !!
  }

  /**
   *
   * @function InMessageManager~userJoinedServer
   * @param {String} userName
   */
  function userJoinedServer(userName) {
    var inMessageManager, room;

    inMessageManager = this;

    // TODO: !!
  }

  /**
   *
   * @function InMessageManager~userChangedName
   * @param {String} oldName
   * @param {String} newName
   */
  function userChangedName(oldName, newName) {
    var inMessageManager, user, rawText;

    inMessageManager = this;

    // TODO: !!
  }

  /**
   *
   * @function InMessageManager~roomCreated
   * @param {String} roomName
   */
  function roomCreated(roomName) {
    var inMessageManager, room;

    inMessageManager = this;

    // TODO: !!
  }

  /**
   *
   * @function InMessageManager~roomDestroyed
   * @param {String} roomName
   */
  function roomDestroyed(roomName) {
    var inMessageManager, room;

    inMessageManager = this;

    // TODO: !!
  }

  /**
   *
   * @function InMessageManager~parseInComingMessage
   * @param {String} rawText
   * @returns {Message}
   */
  function parseInComingMessage(rawText) {
    var inMessageManager, htmlText;

    inMessageManager = this;

    // TODO: !!

    return null;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   *
   * @function InMessageManager#init
   */
  function init() {
    var inMessageManager = this;
  }

  /**
   *
   * @function InMessageManager#handleInComingMessage
   * @param {String} rawText
   */
  function handleInComingMessage(rawText) {
    var inMessageManager, message;

    inMessageManager = this;

    message = parseInComingMessage.call(inMessageManager, rawText);

    if (!message) {
      return;
    }

    // TODO: !!
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function InMessageManager.initStaticFields
   */
  function initStaticFields() {
    he = app.he;
    params = app.params;
    util = app.util;
    log = new app.Log('InMessageManager');
    Room = app.Room;
    User = app.User;
    Message = app.Message;
    ConsoleManager = app.ConsoleManager;
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {IOManager} ioManager
   */
  function InMessageManager(ioManager) {
    var inMessageManager = this;

    inMessageManager.ioManager = ioManager;
    inMessageManager.consoleManager = null;

    inMessageManager.init = init;
    inMessageManager.handleInComingMessage = handleInComingMessage;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.InMessageManager = InMessageManager;
  InMessageManager.initStaticFields = initStaticFields;

  console.log('InMessageManager module loaded');
})();
