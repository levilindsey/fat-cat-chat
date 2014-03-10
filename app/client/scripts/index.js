/**
 * This static module drives this app.
 * @module index
 */
(function () {

  var params, util, log, User, Room, Message, ConsoleEntry, ChatConsole, ChatTextBox, IOManager, ChatBot, ConsoleManager, consoleManager;

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
    IOManager = app.IOManager;
    ConsoleManager = app.ConsoleManager;
    ChatBot = app.ChatBot;

    User.initStaticFields();
    Room.initStaticFields();
    Message.initStaticFields();
    ConsoleEntry.initStaticFields();
    ChatConsole.initStaticFields();
    ChatTextBox.initStaticFields();
    IOManager.initStaticFields();
    ConsoleManager.initStaticFields();
    ChatBot.initStaticFields();

    log.i('reset', 'All modules initialized');

    cacheSpriteSheet();

    if (checkBrowserCompatibility()) {
      consoleManager = new ConsoleManager();
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

  /**
   * Caches the master sprite sheet.
   * @function index~cacheSpriteSheet
   */
  function cacheSpriteSheet() {
    var image = new Image();
    util.listen(image, 'load', function () {
      log.i('cacheSpriteSheet', 'success');
    });
    util.listen(image, 'error', function () {
      log.e('cacheSpriteSheet', 'error');
    });
    image.src = params.SPRITES.SRC;
  }

  // ------------------------------------------------------------------------------------------- //

  if (!window.app) window.app = {};

  console.log('index module loaded');

  init();
})();
