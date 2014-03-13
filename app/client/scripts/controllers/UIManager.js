/**
 * This module defines a constructor for UIManager objects.
 * @module UIManager
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var AUTO_OPEN_DIRECTORY_PANEL_DELAY = 400;

  var params, util, log, ChatConsole, ChatTextBox, ChatBot;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates instances of the various Consoles.
   * @function UIManager~setUpElements
   */
  function setUpElements() {
    var uiManager = this;

    getReferencesToElements.call(uiManager);
    hookUpEventListeners.call(uiManager);
  }

  /**
   *
   * @function UIManager~getReferencesToElements
   */
  function getReferencesToElements() {
    var uiManager, changeNameButton, newRoomButton, addBotButton, confirmButton, cancelButton, roomChatContainer, directoryContainer, commandsContainer, emoticonsContainer, privateChatContainer, roomChatHeader, directoryHeader, commandsHeader, emoticonsHeader, privateChatHeader, roomChatBody, directoryBody, commandsBody, emoticonsBody, privateChatBody, roomsConsole, directoryUsersConsole, chatRoomMessagesConsole, chatRoomUsersConsole, privateMessagesConsole, chatRoomMessagesTextBox, privateMessagesTextBox, textEntryDialoguePanel, changeNameTextBox;

    uiManager = this;

    textEntryDialoguePanel = document.getElementById('textEntryDialoguePanel');
    changeNameTextBox = document.getElementById('changeNameTextBox');

    changeNameButton = document.getElementById('changeNameButton');
    newRoomButton = document.getElementById('newRoomButton');
    addBotButton = document.getElementById('addBotButton');
    confirmButton = document.getElementById('confirmButton');
    cancelButton = document.getElementById('cancelButton');

    roomChatContainer = document.getElementById('roomChatPanel');
    directoryContainer = document.getElementById('directoryPanel');
    commandsContainer = document.getElementById('commandsPanel');
    emoticonsContainer = document.getElementById('emoticonsPanel');
    privateChatContainer = document.getElementById('privateChatPanel');

    roomChatHeader = roomChatContainer.querySelector('.panelHeader');
    directoryHeader = directoryContainer.querySelector('.panelHeader');
    commandsHeader = commandsContainer.querySelector('.panelHeader');
    emoticonsHeader = emoticonsContainer.querySelector('.panelHeader');
    privateChatHeader = privateChatContainer.querySelector('.panelHeader');

    roomChatBody = roomChatContainer.querySelector('.panelBody');
    directoryBody = directoryContainer.querySelector('.panelBody');
    commandsBody = commandsContainer.querySelector('.panelBody');
    emoticonsBody = emoticonsContainer.querySelector('.panelBody');
    privateChatBody = privateChatContainer.querySelector('.panelBody');

    roomsConsole = new ChatConsole('directoryRoomsConsole', 'directoryHeader', uiManager);
    directoryUsersConsole =
        new ChatConsole('directoryUsersConsole', 'directoryHeader', uiManager);
    chatRoomMessagesConsole =
        new ChatConsole('roomChatMessagesConsole', 'roomChatHeader', uiManager);
    chatRoomUsersConsole =
        new ChatConsole('roomChatUsersConsole', 'roomChatHeader', uiManager);
    privateMessagesConsole =
        new ChatConsole('privateChatMessagesConsole', 'privateChatHeader', uiManager);

    chatRoomMessagesTextBox = new ChatTextBox('roomChatMessagesTextBox', uiManager);
    privateMessagesTextBox = new ChatTextBox('privateChatMessagesTextBox', uiManager);

    uiManager.buttons = {
      changeName: changeNameButton,
      newRoom: newRoomButton,
      addBot: addBotButton,
      confirm: confirmButton,
      cancel: cancelButton
    };
    uiManager.panels = {
      roomChat: {
        container: roomChatContainer,
        header: roomChatHeader,
        body: roomChatBody
      },
      directory: {
        container: directoryContainer,
        header: directoryHeader,
        body: directoryBody
      },
      commands: {
        container: commandsContainer,
        header: commandsHeader,
        body: commandsBody
      },
      emoticons: {
        container: emoticonsContainer,
        header: emoticonsHeader,
        body: emoticonsBody
      },
      privateChat: {
        container: privateChatContainer,
        header: privateChatHeader,
        body: privateChatBody
      },
      textEntryDialogue: {
        container: textEntryDialoguePanel,
        textBox: changeNameTextBox
      }
    };
    uiManager.consoles = {
      rooms: roomsConsole,
      directoryUsers: directoryUsersConsole,
      chatRoomMessages: chatRoomMessagesConsole,
      chatRoomUsers: chatRoomUsersConsole,
      privateMessages: privateMessagesConsole
    };
    uiManager.textBoxes = {
      chatRoomMessages: chatRoomMessagesTextBox,
      privateMessages: privateMessagesTextBox
    };
  }

  /**
   *
   * @function UIManager~hookUpEventListeners
   */
  function hookUpEventListeners() {
    var uiManager;

    uiManager = this;

    util.listen(uiManager.panels.roomChat.header, 'click', function () {
      onPanelHeaderClick.call(uiManager, uiManager.panels.roomChat.container);
    });
    util.listen(uiManager.panels.directory.header, 'click', function () {
      onPanelHeaderClick.call(uiManager, uiManager.panels.directory.container);
    });
    util.listen(uiManager.panels.commands.header, 'click', function () {
      onPanelHeaderClick.call(uiManager, uiManager.panels.commands.container);
    });
    util.listen(uiManager.panels.emoticons.header, 'click', function () {
      onPanelHeaderClick.call(uiManager, uiManager.panels.emoticons.container);
    });
    util.listen(uiManager.panels.privateChat.header, 'click', function () {
      onPanelHeaderClick.call(uiManager, uiManager.panels.privateChat.container);
    });

    util.listen(uiManager.buttons.changeName, 'click', function () {
      onButtonClick.call(uiManager, uiManager.buttons.changeName);
    });
    util.listen(uiManager.buttons.newRoom, 'click', function () {
      onButtonClick.call(uiManager, uiManager.buttons.newRoom);
    });
    util.listen(uiManager.buttons.addBot, 'click', function () {
      onButtonClick.call(uiManager, uiManager.buttons.addBot);
    });
    util.listen(uiManager.buttons.confirm, 'click', function () {
      onButtonClick.call(uiManager, uiManager.buttons.confirm);
    });
    util.listen(uiManager.buttons.cancel, 'click', function () {
      onButtonClick.call(uiManager, uiManager.buttons.cancel);
    });
  }

  /**
   *
   * @function UIManager~onPanelHeaderClick
   * @param {HTMLElement} panelContainer
   */
  function onPanelHeaderClick(panelContainer) {
    var uiManager = this;

    util.toggleClass(panelContainer, 'closed');
  }

  /**
   *
   * @function UIManager~onButtonClick
   * @param {HTMLElement} button
   */
  function onButtonClick(button) {
    var uiManager, value;
    uiManager = this;

    switch (button) {
      case uiManager.buttons.changeName:
        openTextEntryDialogue.call(uiManager, false);
        break;
      case uiManager.buttons.newRoom:
        openTextEntryDialogue.call(uiManager, true);
        break;
      case uiManager.buttons.addBot:
        uiManager.bots.push(new ChatBot(uiManager));
        break;
      case uiManager.buttons.confirm:
        value = uiManager.panels.textEntryDialogue.textBox.getAttribute('value');
        if (uiManager.dialogueIsForNewRoom) {
          uiManager.consoleManager.joinRoom(value);
        } else {
          uiManager.consoleManager.changeOwnNickname(value);
        }
        closeTextEntryDialogue.call(uiManager);
        break;
      case uiManager.buttons.cancel:
        closeTextEntryDialogue.call(uiManager);
        break;
      default:
        return;
    }
  }

  /**
   *
   * @function UIManager~openTextEntryDialogue
   * @param {Boolean} dialogueIsForNewRoom
   */
  function openTextEntryDialogue(dialogueIsForNewRoom) {
    var uiManager, placeholder;
    uiManager = this;

    uiManager.dialogueIsForNewRoom = dialogueIsForNewRoom;
    util.toggleClass(uiManager.panels.textEntryDialogue.container, 'hidden', false);
    uiManager.panels.textEntryDialogue.textBox.setAttribute('value', '');

    placeholder = dialogueIsForNewRoom ? 'Room name' : 'Nickname';
    uiManager.panels.textEntryDialogue.textBox.setAttribute('placeholder', placeholder);

    uiManager.panels.textEntryDialogue.textBox.focus();
  }

  /**
   *
   * @function UIManager~closeTextEntryDialogue
   */
  function closeTextEntryDialogue() {
    var uiManager = this;

    util.toggleClass(uiManager.panels.textEntryDialogue.container, 'hidden', true);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   *
   * @function UIManager#init
   * @param {ConsoleManager} consoleManager
   */
  function init(consoleManager) {
    var uiManager = this;

    uiManager.consoleManager = consoleManager;
    consoleManager.uiManager = uiManager;

    setUpElements.call(uiManager);
    resize.call(uiManager);

    // Re-adjust sizes in response to changes in the window's size
    util.listen(window, 'resize', function () {
      resize.call(uiManager);
    });

    consoleManager.init();

    // Start the directory panel closed, but then show it sliding open
    setTimeout(function() {
      onPanelHeaderClick.call(uiManager, uiManager.panels.directory.container);
    }, AUTO_OPEN_DIRECTORY_PANEL_DELAY);
  }

  /**
   *
   * @function UIManager#resize
   */
  function resize() {
    var uiManager, panelBodyWidth, mainConsoleWidth, usersConsoleWidth, privateConsoleWidth;

    uiManager = this;

    panelBodyWidth = document.getElementById('contentColumn').offsetWidth;
    mainConsoleWidth =
        panelBodyWidth - params.PANELS.BODY_MARGIN * 2 - params.PANELS.BORDER_THICKNESS * 3 -
            params.PANELS.USERS_CONSOLE_WIDTH;
    usersConsoleWidth = params.PANELS.USERS_CONSOLE_WIDTH;
    privateConsoleWidth = params.PANELS.PRIVATE_CONSOLE_WIDTH;

    uiManager.consoles.rooms.resize(mainConsoleWidth);
    uiManager.consoles.directoryUsers.resize(usersConsoleWidth);
    uiManager.consoles.chatRoomMessages.resize(mainConsoleWidth);
    uiManager.consoles.chatRoomUsers.resize(usersConsoleWidth);
    uiManager.consoles.privateMessages.resize(privateConsoleWidth);

    uiManager.textBoxes.chatRoomMessages.resize(mainConsoleWidth -
        params.PANELS.TEXT_BOX_PADDING * 2);
    uiManager.textBoxes.privateMessages.resize(privateConsoleWidth -
        params.PANELS.TEXT_BOX_PADDING * 2);
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function UIManager.initStaticFields
   */
  function initStaticFields() {
    params = app.params;
    util = app.util;
    log = new app.Log('UIManager');
    ChatConsole = app.ChatConsole;
    ChatTextBox = app.ChatTextBox;
    ChatBot = app.ChatBot;
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   */
  function UIManager() {
    var uiManager = this;

    uiManager.consoleManager = null;
    uiManager.dialogueIsForNewRoom = false;
    uiManager.buttons = null;
    uiManager.panels = null;
    uiManager.consoles = null;
    uiManager.textBoxes = null;

    uiManager.init = init;
    uiManager.resize = resize;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.UIManager = UIManager;
  UIManager.initStaticFields = initStaticFields;

  console.log('UIManager module loaded');
})();