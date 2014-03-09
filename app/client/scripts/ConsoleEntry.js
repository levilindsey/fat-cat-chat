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
    var consoleEntry;

    consoleEntry = this;

    // TODO: set up elements

    consoleEntry.elements = {
    };
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   *
   * @function ConsoleEntry#resize
   */
  function resize() {
    var consoleEntry, viewportSize;

    consoleEntry = this;
    viewportSize = util.getViewportSize();

    // TODO:
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

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
   */
  function ConsoleEntry() {
    var consoleEntry = this;

    consoleEntry.resize = resize;

    createElements.call(consoleEntry);
    resize.call(consoleEntry);
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.ConsoleEntry = ConsoleEntry;
  ConsoleEntry.initStaticFields = initStaticFields;

  console.log('ConsoleEntry module loaded');
})();
