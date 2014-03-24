/**
 * This static module drives this app.
 * @module index
 */
(function () {

  var params, util, log, User, Room, Message, ConsoleEntry, ChatConsole, ChatTextBox, ChatBot, InMessageManager, OutMessageManager, SocketManager, ChatBotManager, UIManager, ChatManager, socketManager, uiManager;

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

    app.server.address = extractHostNameFromUrl(app.server.address);
    log.d('init', 'server=' + app.server.address + ':' + app.server.port);

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
    ChatBot = app.ChatBot;
    InMessageManager = app.InMessageManager;
    OutMessageManager = app.OutMessageManager;
    SocketManager = app.SocketManager;
    UIManager = app.UIManager;
    ChatManager = app.ChatManager;
    ChatBotManager = app.ChatBotManager;

    User.initStaticFields();
    Room.initStaticFields();
    Message.initStaticFields();
    ConsoleEntry.initStaticFields();
    ChatConsole.initStaticFields();
    ChatTextBox.initStaticFields();
    ChatBot.initStaticFields();
    ChatManager.initStaticFields();
    InMessageManager.initStaticFields();
    OutMessageManager.initStaticFields();
    SocketManager.initStaticFields();
    UIManager.initStaticFields();
    ChatBotManager.initStaticFields();

    log.i('reset', 'All modules initialized');
    log.i('reset', params.LOG.SEPARATOR_LINE);

    if (checkBrowserCompatibility()) {
      socketManager = new SocketManager(app.server.address, app.server.port);
      uiManager = new UIManager();
      socketManager.init(uiManager);
      uiManager.init(socketManager);
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
   * @function index~showErrorMessage
   * @param {String} message The text to show in the error display.
   */
  function showErrorMessage(message) {
    var body, errorMessageElement;

    log.w('showErrorMessage', 'message=' + message);

    body = document.getElementsByTagName('body')[0];

    errorMessageElement = util.createElement('div', body, null, ['errorMessage']);
    errorMessageElement.innerHTML = message;
    errorMessageElement.onclick = function () {
      body.removeChild(errorMessageElement);
    };
  }

  /**
   * @function index~extractHostNameFromUrl
   * @param {String} url
   */
  function extractHostNameFromUrl(url) {
    var index;

    index = url.indexOf(':');

    return index >= 0 ? url.substr(0, index) : url;
  }

  // ------------------------------------------------------------------------------------------- //

  if (!window.app) window.app = {};
  app.showErrorMessage = showErrorMessage;

  console.log('index module loaded');

  init();
})();
