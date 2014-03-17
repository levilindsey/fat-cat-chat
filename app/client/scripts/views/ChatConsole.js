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

  /**
   *
   * @function ChatConsole~findEntryIndexByMessageRawText
   * @param {String} rawText
   * @returns {Number}
   */
  function findEntryIndexByMessageRawText(rawText) {
    var chatConsole, i, count;

    chatConsole = this;

    for (i = 0, count = chatConsole.entries.length; i < count; i++) {
      if (chatConsole.entries[i].message.rawText === rawText) {
        return i;
      }
    }

    return -1;
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

    // Scroll to the bottom
    chatConsole.elements.container.scrollTop = chatConsole.elements.container.scrollHeight;
  }

  /**
   *
   * @function ChatConsole#removeMessageByRawText
   * @param {String} rawText The rawText value of the message to remove.
   */
  function removeMessageByRawText(rawText) {
    var chatConsole, index, li;

    log.d('removeMessageByRawText', 'rawText=' + rawText);
    chatConsole = this;

    index = findEntryIndexByMessageRawText.call(chatConsole, rawText);

    if (index >= 0) {
      li = chatConsole.entries[index].elements.li;
      chatConsole.entries.splice(index, 1);
      chatConsole.elements.list.removeChild(li);
    }
  }

  /**
   *
   * @function ChatConsole#changeMessageRawText
   * @param {String} oldRawText
   * @param {String} newRawText
   */
  function changeMessageRawText(oldRawText, newRawText) {
    var chatConsole, index, entry, newHtmlText;

    log.d('changeMessageRawText', 'oldRawText=' + oldRawText + ', newRawText=' + newRawText);
    chatConsole = this;

    index = findEntryIndexByMessageRawText.call(chatConsole, oldRawText);

    if (index >= 0) {
      newHtmlText = chatConsole.chatManager.parseRawMessageTextForDom(newRawText);
      entry = chatConsole.entries[index];

      entry.message.rawText = newRawText;
      entry.elements.li.innerHTML = newHtmlText;
    }
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
   * @param {ChatManager} chatManager
   */
  function ChatConsole(containerId, headerId, panelId, chatManager) {
    var chatConsole = this;

    chatConsole.chatManager = chatManager;
    chatConsole.entries = [];
    chatConsole.resize = resize;
    chatConsole.addMessage = addMessage;
    chatConsole.removeMessageByRawText = removeMessageByRawText;
    chatConsole.changeMessageRawText = changeMessageRawText;
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
