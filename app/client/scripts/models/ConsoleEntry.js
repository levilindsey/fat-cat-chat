/**
 * This module defines a constructor for ConsoleEntry objects.
 * @module ConsoleEntry
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var params, util, log;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates the DOM elements for this module, adds them to the DOM, and adds them to the elements
   * property of this object.
   * @function ConsoleEntry~createElements
   */
  function createElements() {
    var consoleEntry, li;

    consoleEntry = this;

    li = util.createElement('li', consoleEntry.parent, null, ['consoleEntry', consoleEntry.message.type]);
    li.innerHTML = consoleEntry.message.htmlText;

    consoleEntry.elements = {
      li: li
    };
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   *
   * @function ConsoleEntry#removeFromDOM
   */
  function removeFromDom() {
    var consoleEntry = this;
    util.removeChildIfPresent(consoleEntry.parent, consoleEntry.elements.li);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function ConsoleEntry.initStaticFields
   */
  function initStaticFields() {
    params = app.params;
    util = app.util;
    log = new app.Log('ConsoleEntry');
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Message} message The message for this console entry to display.
   * @param {HTMLElement} parent The parent element to add this entry's DOM element to.
   */
  function ConsoleEntry(message, parent) {
    var consoleEntry = this;

    consoleEntry.message = message;
    consoleEntry.parent = parent;
    consoleEntry.removeFromDom = removeFromDom;
    consoleEntry.elements = null;

    createElements.call(consoleEntry);
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.ConsoleEntry = ConsoleEntry;
  ConsoleEntry.initStaticFields = initStaticFields;

  console.log('ConsoleEntry module loaded');
})();
