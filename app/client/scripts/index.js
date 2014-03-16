/**
 * This static module drives this app.
 * @module index
 */
(function () {

  var params, util, log, User, Room, Message, ConsoleEntry, ChatConsole, ChatTextBox, InMessageManager, OutMessageManager, IOManager, ChatBot, UIManager, ConsoleManager, ioManager, uiManager;

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Initializes this app.
   * @function index~init
   */
  function init() {
    params = app.params;
    util = app.util;
    app.Log.initStaticFields();
    log = new app.Log('index');

    log.d('init');

    util.init();

    util.listen(window, 'load', onDocumentLoad);
  }

  /**
   * Resets all of the state for this app.
   * @function index~reset
   */
  function reset() {
    User = app.User;
    Room = app.Room;
    Message = app.Message;
    ConsoleEntry = app.ConsoleEntry;
    ChatConsole = app.ChatConsole;
    ChatTextBox = app.ChatTextBox;
    InMessageManager = app.InMessageManager;
    OutMessageManager = app.OutMessageManager;
    IOManager = app.IOManager;
    UIManager = app.UIManager;
    ConsoleManager = app.ConsoleManager;
    ChatBot = app.ChatBot;

    User.initStaticFields();
    Room.initStaticFields();
    Message.initStaticFields();
    ConsoleEntry.initStaticFields();
    ChatConsole.initStaticFields();
    ChatTextBox.initStaticFields();
    ConsoleManager.initStaticFields();
    InMessageManager.initStaticFields();
    OutMessageManager.initStaticFields();
    IOManager.initStaticFields();
    UIManager.initStaticFields();
    ChatBot.initStaticFields();

    log.i('reset', 'All modules initialized');
    log.i('reset', params.SEPARATOR_LINE);

    if (checkBrowserCompatibility()) {
      ioManager = new IOManager();
      uiManager = new UIManager();
      ioManager.init(uiManager);
      uiManager.init(ioManager);
    }
  }

  /**
   * This is the event handler for the completion of the DOM loading.
   * @function index~onDocumentLoad
   */
  function onDocumentLoad() {
    log.i('onDocumentLoad');

    reset();
  }

  /**
   * Uses feature detection to ensure the browser can handle this app.
   * @function index~checkBrowserCompatibility
   */
  function checkBrowserCompatibility() {
    if (!util.isBrowserCompatible) {
      showErrorMessage(params.L18N.EN.BAD_BROWSER_MESSAGE);
      return false;
    } else {
      return true;
    }
  }

  /**
   * Adds an error message ribbon overtop of the document body. This message can be closed by
   * tapping on it.
   * @param {String} message The text to show in the error display.
   */
  function showErrorMessage(message) {
    var body, errorMessageElement;

    body = document.getElementsByTagName('body')[0];

    errorMessageElement = util.createElement('div', body, null, ['errorMessage']);
    errorMessageElement.innerHTML = message;
    errorMessageElement.onclick = function () {
      body.removeChild(errorMessageElement);
    };
  }

  // ------------------------------------------------------------------------------------------- //

  if (!window.app) window.app = {};

  console.log('index module loaded');

  init();
})();
