/**
 * This module defines a constructor for Console objects.
 * @module Console
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
   * @function Console~createElements
   */
  function createElements() {
    var console;

    console = this;

    // TODO: set up elements

    console.elements = {
    };
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   *
   * @function Console#resize
   */
  function resize() {
    var console, viewportSize;

    console = this;
    viewportSize = util.getViewportSize();

    // TODO:
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function Console.initStaticFields
   */
  function initStaticFields() {
    params = app.params;
    util = app.util;
    log = new app.Log('Console');
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   */
  function Console() {
    var console = this;

    console.resize = resize;

    createElements.call(console);
    resize.call(console);
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.Console = Console;
  Console.initStaticFields = initStaticFields;

  console.log('Console module loaded');
})();
