/**
 * This module defines a constructor for ChatTextBox objects.
 * @module ChatTextBox
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var ENTER_KEY_CODE = 13;

  var params, util, log, ConsoleEntry;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Gets references to some DOM elements for this module.
   * @function ChatTextBox~setUpElements
   * @param {String} textBoxId The ID of the input element for this ChatTextBox.
   */
  function setUpElements(textBoxId) {
    var chatTextBox, textBox;

    chatTextBox = this;

    textBox = document.getElementById(textBoxId);
    util.listen(textBox, 'keydown', function (event) {
      onKeyDown.call(chatTextBox, event.keyCode);
    });
    util.listen(textBox, 'change', function () {
      onKeyDown.call(chatTextBox, chatTextBox.textBox.innerHTML);
    });

    chatTextBox.elements = {
      textBox: textBox
    };
  }

  /**
   *
   * @function ChatTextBox~onKeyDown
   * @param {Number} keyCode
   */
  function onKeyDown(keyCode) {
    var chatTextBox = this;
    if (keyCode === ENTER_KEY_CODE) {
      log.i('onKeyDown', 'User pressed ENTER');

      chatTextBox.consoleManager.handleOutGoingMessage(chatTextBox.textBox.getAttribute('value'),
          chatTextBox);

      chatTextBox.textBox.innerHTML = '';
    }
  }

  /**
   *
   * @function ChatTextBox~onTextChanged
   * @param {String} newText
   */
  function onTextChanged(newText) {
    var chatTextBox = this;

    // TODO: If I have time, add an overlay over the textbox, which I can then size and position precicesly in order to "add markup" to the contents of the textbox
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   *
   * @function ChatTextBox#resize
   * @param {Number} width The width to assign this console.
   */
  function resize(width) {
    var chatTextBox = this;

    chatTextBox.elements.textBox.style.width = width + 'px';
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function ChatTextBox.initStaticFields
   */
  function initStaticFields() {
    params = app.params;
    util = app.util;
    log = new app.Log('ChatTextBox');
    ConsoleEntry = app.ConsoleEntry;
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {String} textBoxId The ID of the input element for this ChatTextBox.
   * @param {ConsoleManager} consoleManager
   */
  function ChatTextBox(textBoxId, consoleManager) {
    var chatTextBox = this;

    chatTextBox.consoleManager = consoleManager;
    chatTextBox.entries = [];
    chatTextBox.resize = resize;
    chatTextBox.elements = null;

    setUpElements.call(chatTextBox, textBoxId);
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.ChatTextBox = ChatTextBox;
  ChatTextBox.initStaticFields = initStaticFields;

  console.log('ChatTextBox module loaded');
})();
