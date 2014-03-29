/**
 * This module defines a constructor for UIManager objects.
 * @module UIManager
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var AUTO_OPEN_DIRECTORY_PANEL_DELAY = 400;

  var params, util, log, ChatConsole, ChatTextBox, ChatManager;

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
   * @function UIManager~getReferencesToElements
   */
  function getReferencesToElements() {
    var uiManager, connectingToServerMessage, changeNameButton, newRoomButton, addBotButton, confirmButton, cancelButton, roomChatContainer, directoryContainer, commandsContainer, emoticonsContainer, privateChatContainer, roomChatHeader, directoryHeader, commandsHeader, emoticonsHeader, privateChatHeader, roomChatBody, directoryBody, commandsBody, emoticonsBody, privateChatBody, roomsConsole, directoryUsersConsole, chatRoomMessagesConsole, chatRoomUsersConsole, privateMessagesConsole, chatRoomMessagesTextBox, privateMessagesTextBox, ownUserNameLabel, textEntryDialoguePanel, changeNameTextBox;

    uiManager = this;

    connectingToServerMessage = document.getElementById('connectingToServerMessage');

    ownUserNameLabel = document.getElementById('ownUserNameLabel');
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

    roomsConsole =
        new ChatConsole('directoryRoomsConsole', 'directoryRoomsHeader', 'directoryPanel',
            uiManager);
    directoryUsersConsole =
        new ChatConsole('directoryUsersConsole', 'directoryUsersHeader', 'directoryPanel',
            uiManager);
    chatRoomMessagesConsole =
        new ChatConsole('roomChatMessagesConsole', 'roomChatHeader', 'roomChatPanel', uiManager);
    chatRoomUsersConsole =
        new ChatConsole('roomChatUsersConsole', 'roomChatUsersHeader', 'roomChatPanel', uiManager);
    privateMessagesConsole =
        new ChatConsole('privateChatMessagesConsole', 'privateChatHeader', 'privateChatPanel',
            uiManager);

    chatRoomMessagesTextBox = new ChatTextBox('roomChatMessagesTextBox', uiManager);
    privateMessagesTextBox = new ChatTextBox('privateChatMessagesTextBox', uiManager);

    uiManager.connectingToServerMessage = connectingToServerMessage;
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
        ownUserNameLabel: ownUserNameLabel,
        container: textEntryDialoguePanel,
        textBox: changeNameTextBox
      }
    };
    uiManager.consoles = {
      directoryRooms: roomsConsole,
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

    util.listen(uiManager.panels.textEntryDialogue.textBox, 'keydown', function (event) {
      onDialogueTextBoxKeyDown.call(uiManager, event.keyCode);
    });
  }

  /**
   * @function UIManager~onPanelHeaderClick
   * @param {HTMLElement} panelContainer
   */
  function onPanelHeaderClick(panelContainer) {
    var uiManager = this;

    log.i('onPanelHeaderClick', 'Panel container ID=' + panelContainer.id);

    util.toggleClass(panelContainer, 'closed');
  }

  /**
   * @function UIManager~onButtonClick
   * @param {HTMLElement} button
   */
  function onButtonClick(button) {
    var uiManager;

    log.i('onButtonClick', 'Button ID=' + button.id);

    uiManager = this;

    switch (button) {
      case uiManager.buttons.changeName:
        if (!uiManager.buttons.changeName.hasAttribute('disabled')) {
          openTextEntryDialogue.call(uiManager, false);
        }
        break;
      case uiManager.buttons.newRoom:
        if (!uiManager.buttons.newRoom.hasAttribute('disabled')) {
          openTextEntryDialogue.call(uiManager, true);
        }
        break;
      case uiManager.buttons.addBot:
        if (!uiManager.buttons.addBot.hasAttribute('disabled')) {
          uiManager.chatManager.chatBotManager.addChatBot();
        }
        break;
      case uiManager.buttons.confirm:
        onDialogueConfimation.call(uiManager);
        break;
      case uiManager.buttons.cancel:
        closeTextEntryDialogue.call(uiManager);
        break;
      default:
        return;
    }
  }

  /**
   * @function UIManager~onDialogueTextBoxKeyDown
   * @param {Number} keyCode
   */
  function onDialogueTextBoxKeyDown(keyCode) {
    var uiManager = this;
    if (keyCode === params.ENTER_KEY_CODE) {
      log.i('onKeyDown', 'User pressed ENTER');
      onDialogueConfimation.call(uiManager);
    }
  }

  /**
   * @function UIManager~onDialogueConfimation
   */
  function onDialogueConfimation() {
    var uiManager, value, succeeded;

    uiManager = this;
    value = uiManager.panels.textEntryDialogue.textBox.value;

    if (uiManager.dialogueIsForNewRoom) {
      succeeded = uiManager.socketManager.outMessageManager.joinRoom(value, null, null);
    } else {
      succeeded = uiManager.socketManager.outMessageManager.changeOwnNickname(value, null, null);
    }

    if (succeeded) {
      closeTextEntryDialogue.call(uiManager);
    } else {
      app.showErrorMessage(':( Names cannot already be in use and can only contain the characters ' +
          params.NAME_VALIDATION.validChars);
    }
  }

  /**
   * @function UIManager~openTextEntryDialogue
   * @param {Boolean} dialogueIsForNewRoom
   */
  function openTextEntryDialogue(dialogueIsForNewRoom) {
    var uiManager, placeholder;
    uiManager = this;

    uiManager.dialogueIsForNewRoom = dialogueIsForNewRoom;
    util.toggleClass(uiManager.panels.textEntryDialogue.container, 'hidden', false);
    uiManager.panels.textEntryDialogue.textBox.value = '';

    placeholder = dialogueIsForNewRoom ? 'Room name' : 'Nickname';
    uiManager.panels.textEntryDialogue.textBox.setAttribute('placeholder', placeholder);

    uiManager.panels.textEntryDialogue.textBox.focus();
  }

  /**
   * @function UIManager~closeTextEntryDialogue
   */
  function closeTextEntryDialogue() {
    var uiManager = this;

    util.toggleClass(uiManager.panels.textEntryDialogue.container, 'hidden', true);
  }

  /**
   * @function UIManager~updateConnectingToServerMessage
   * @param {Boolean} connected
   */
  function updateConnectingToServerMessage(connected) {
    var uiManager, message;
    uiManager = this;

    if (connected) {
      message = 'Connected to server!';
      uiManager.hideConnectedMessageTimeout = setTimeout(function () {
        uiManager.connectingToServerMessage.style.display = 'none';
      }, params.SHOW_CONNECTED_MESSAGE_DURATION);
    } else {
      message = params.CONNECTING_MESSAGES[uiManager.connectingToServerMessageIndex];
      uiManager.connectingToServerMessageIndex =
          (uiManager.connectingToServerMessageIndex + 1) % params.CONNECTING_MESSAGES.length;
    }
    uiManager.connectingToServerMessage.innerHTML = message;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * @function UIManager#init
   * @param {SocketManager} socketManager
   */
  function init(socketManager) {
    var uiManager = this;

    uiManager.socketManager = socketManager;

    setUpElements.call(uiManager);
    resize.call(uiManager);

    // Re-adjust sizes in response to changes in the window's size
    util.listen(window, 'resize', function () {
      resize.call(uiManager);
    });

    uiManager.chatManager.init(socketManager);

    uiManager.panels.textEntryDialogue.ownUserNameLabel.innerHTML =
        uiManager.chatManager.thisUser.name;

    // Start the directory panel closed, but then show it sliding open
    setTimeout(function () {
      onPanelHeaderClick.call(uiManager, uiManager.panels.directory.container);
    }, AUTO_OPEN_DIRECTORY_PANEL_DELAY);
  }

  /**
   * @function UIManager#resize
   */
  function resize() {
    var uiManager, panelBodyWidth, mainConsoleWidth, usersConsoleWidth;

    uiManager = this;

    panelBodyWidth = document.getElementById('contentColumn').offsetWidth;
    mainConsoleWidth =
        panelBodyWidth - params.PANELS.BODY_MARGIN * 2 - params.PANELS.BORDER_THICKNESS * 3 -
            params.PANELS.USERS_CONSOLE_WIDTH;
    usersConsoleWidth = params.PANELS.USERS_CONSOLE_WIDTH;
//    privateConsoleWidth = params.PANELS.PRIVATE_CONSOLE_WIDTH;

    uiManager.consoles.directoryRooms.resize(mainConsoleWidth);
    uiManager.consoles.directoryUsers.resize(usersConsoleWidth);
    uiManager.consoles.chatRoomMessages.resize(mainConsoleWidth);
    uiManager.consoles.chatRoomUsers.resize(usersConsoleWidth);
//    uiManager.consoles.privateMessages.resize(privateConsoleWidth);

    uiManager.textBoxes.chatRoomMessages.resize(mainConsoleWidth -
        params.PANELS.TEXT_BOX_PADDING * 2);
//    uiManager.textBoxes.privateMessages.resize(privateConsoleWidth -
//        params.PANELS.TEXT_BOX_PADDING * 2);
  }

  /**
   * @function UIManager#showConnectingToServerMessage
   */
  function showConnectingToServerMessage() {
    var uiManager = this;

    clearTimeout(uiManager.hideConnectedMessageTimeout);
    clearInterval(uiManager.updateConnectingToServerInterval);

    uiManager.updateConnectingToServerInterval = setInterval(function () {
      updateConnectingToServerMessage.call(uiManager, false);
    }, params.CONNECTING_MESSAGE_UPDATE_INTERVAL);
  }

  /**
   * @function UIManager#showConnectedToServerMessage
   */
  function showConnectedToServerMessage() {
    var uiManager = this;

    clearTimeout(uiManager.hideConnectedMessageTimeout);
    clearInterval(uiManager.updateConnectingToServerInterval);

    updateConnectingToServerMessage.call(uiManager, true);

    uiManager.buttons.changeName.removeAttribute('disabled');
    uiManager.buttons.newRoom.removeAttribute('disabled');
    uiManager.buttons.addBot.removeAttribute('disabled');
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
    ChatManager = app.ChatManager;
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

    uiManager.socketManager = null;
    uiManager.chatManager = new ChatManager(uiManager);
    uiManager.connectingToServerMessageIndex = 0;
    uiManager.hideConnectedMessageTimeout = Number.NaN;
    uiManager.updateConnectingToServerInterval = Number.NaN;
    uiManager.dialogueIsForNewRoom = false;
    uiManager.connectingToServerMessage = null;
    uiManager.buttons = null;
    uiManager.panels = null;
    uiManager.consoles = null;
    uiManager.textBoxes = null;

    uiManager.init = init;
    uiManager.resize = resize;
    uiManager.showConnectingToServerMessage = showConnectingToServerMessage;
    uiManager.showConnectedToServerMessage = showConnectedToServerMessage;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.UIManager = UIManager;
  UIManager.initStaticFields = initStaticFields;

  console.log('UIManager module loaded');
})();
