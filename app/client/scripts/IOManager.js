/**
 * This module defines a constructor for IOManager objects.
 * @module IOManager
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var params, util, log;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function IOManager.initStaticFields
   */
  function initStaticFields() {
    params = app.params;
    util = app.util;
    log = new app.Log('IOManager');
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   */
  function IOManager() {
    var IOManager = this;


  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.IOManager = IOManager;
  IOManager.initStaticFields = initStaticFields;

  console.log('IOManager module loaded');
})();
