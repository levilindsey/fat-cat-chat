/**
 * This module defines a constructor for ChatTextBox objects.
 * @module ChatTextBox
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

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
      onTextChanged.call(chatTextBox, chatTextBox.textBox.innerHTML);
    });

    chatTextBox.textBox = textBox;
  }

  /**
   * @function ChatTextBox~onKeyDown
   * @param {Number} keyCode
   */
  function onKeyDown(keyCode) {
    var chatTextBox = this;
    if (keyCode === params.ENTER_KEY_CODE) {
      log.i('onKeyDown', 'User pressed ENTER');

      chatTextBox.chatManager.socketManager.outMessageManager.handleOutGoingMessage(chatTextBox.textBox.value,
          chatTextBox);

      chatTextBox.textBox.value = '';
    }
  }

  /**
   * @function ChatTextBox~onTextChanged
   * @param {String} newText
   */
  function onTextChanged(newText) {
    var chatTextBox = this;

    // TODO: add an overlay over the textbox, which I can then size and position precisely in order to "add markup" to the contents of the textbox
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * @function ChatTextBox#resize
   * @param {Number} width The width to assign this console.
   */
  function resize(width) {
    var chatTextBox = this;

    chatTextBox.textBox.style.width = width + 'px';
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
   * @param {ChatManager} chatManager
   */
  function ChatTextBox(textBoxId, chatManager) {
    var chatTextBox = this;

    chatTextBox.chatManager = chatManager;
    chatTextBox.entries = [];
    chatTextBox.resize = resize;
    chatTextBox.textBox = null;

    setUpElements.call(chatTextBox, textBoxId);
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.ChatTextBox = ChatTextBox;
  ChatTextBox.initStaticFields = initStaticFields;

  console.log('ChatTextBox module loaded');
})();
