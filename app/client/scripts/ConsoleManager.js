/**
 * This module defines a constructor for ConsoleManager objects.
 * @module ConsoleManager
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
   * @function ConsoleManager~createElements
   */
  function createElements() {
    var consoleManager;

    consoleManager = this;

    // TODO: set up elements

    consoleManager.elements = {
    };
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   *
   * @function ConsoleManager#resize
   */
  function resize() {
    var consoleManager, viewportSize;

    consoleManager = this;
    viewportSize = util.getViewportSize();

    // TODO:
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
    params = app.params;
    util = app.util;
    log = new app.Log('ConsoleManager');
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   */
  function ConsoleManager() {
    var consoleManager = this;

    consoleManager.resize = resize;

    createElements.call(consoleManager);
    resize.call(consoleManager);
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.ConsoleManager = ConsoleManager;
  ConsoleManager.initStaticFields = initStaticFields;

  console.log('ConsoleManager module loaded');
})();
