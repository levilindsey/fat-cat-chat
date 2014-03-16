/**
 * This module defines a constructor for ChatConsole objects.
 * @module ChatConsole
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var params, util, log, ConsoleEntry;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Gets references to some DOM elements for this module.
   * @function ChatConsole~setUpElements
   * @param {String} containerId The ID of the container element for this chatConsole.
   * @param {String} headerId The ID of the header element for this chatConsole.
   * @param {String} panelId The ID of the panel container element for this chatConsole.
   */
  function setUpElements(containerId, headerId, panelId) {
    var chatConsole, container, list, header, panel;

    chatConsole = this;

    container = document.getElementById(containerId);
    list = util.createElement('ul', container, null, null);
    header = document.getElementById(headerId);
    panel = document.getElementById(panelId);

    chatConsole.elements = {
      container: container,
      list: list,
      header: header,
      panel: panel
    };
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   *
   * @function ChatConsole#resize
   * @param {Number} width The width to assign this console.
   */
  function resize(width) {
    var chatConsole = this;

    chatConsole.elements.container.style.width = width + 'px';
    chatConsole.elements.list.style.width = width + 'px';
  }

  /**
   *
   * @function ChatConsole#addMessage
   * @param {Message} message The new message to add.
   */
  function addMessage(message) {
    var chatConsole, entry;

    log.d('addMessage', 'message.htmlText=' + message.htmlText);
    chatConsole = this;

    entry = new ConsoleEntry(message, chatConsole.elements.list);
    chatConsole.entries.push(entry);
  }

  /**
   *
   * @function ChatConsole#clearMessages
   */
  function clearMessages() {
    var chatConsole = this;

    chatConsole.elements.list.innerHTML = '';
    chatConsole.entries = [];
  }

  /**
   *
   * @function ChatConsole#setTitle
   * @param {String} title The title to give to this console.
   */
  function setTitle(title) {
    var chatConsole = this;
    log.d('setTitle', 'title=' + title);

    chatConsole.elements.header.innerHTML = title;
    chatConsole.elements.header.setAttribute('text', title);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function ChatConsole.initStaticFields
   */
  function initStaticFields() {
    params = app.params;
    util = app.util;
    log = new app.Log('ChatConsole');
    ConsoleEntry = app.ConsoleEntry;
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {String} containerId The ID of the container element for this chatConsole.
   * @param {String} headerId The ID of the header element for this chatConsole.
   * @param {String} panelId The ID of the panel container element for this chatConsole.
   * @param {ConsoleManager} consoleManager
   */
  function ChatConsole(containerId, headerId, panelId, consoleManager) {
    var chatConsole = this;

    chatConsole.consoleManager = consoleManager;
    chatConsole.entries = [];
    chatConsole.resize = resize;
    chatConsole.addMessage = addMessage;
    chatConsole.setTitle = setTitle;
    chatConsole.clearMessages = clearMessages;
    chatConsole.elements = null;

    setUpElements.call(chatConsole, containerId, headerId, panelId);
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.ChatConsole = ChatConsole;
  ChatConsole.initStaticFields = initStaticFields;

  console.log('ChatConsole module loaded');
})();
