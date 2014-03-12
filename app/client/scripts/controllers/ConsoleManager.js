/**
 * This module defines a constructor for ConsoleManager objects.
 * @module ConsoleManager
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var params, util, log, Room, User, Message, ChatConsole, ChatTextBox, IOManager, ChatBot, helpMessages;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates instances of the various Consoles.
   * @function ConsoleManager~setUpElements
   */
  function setUpElements() {
    var consoleManager = this;

    getReferencesToElements.call(consoleManager);
    hookUpEventListeners.call(consoleManager);
  }

  function getReferencesToElements() {
    var consoleManager, changeNameButton, newRoomButton, addBotButton, confirmButton, cancelButton,
        roomChatContainer, directoryContainer, commandsContainer, emoticonsContainer,
        privateChatContainer, roomChatHeader, directoryHeader, commandsHeader, emoticonsHeader,
        privateChatHeader, roomChatBody, directoryBody, commandsBody, emoticonsBody,
        privateChatBody, roomsConsole, directoryUsersConsole, chatRoomMessagesConsole,
        chatRoomUsersConsole, privateMessagesConsole, chatRoomMessagesTextBox,
        privateMessagesTextBox, textEntryDialoguePanel, changeNameTextBox;

    consoleManager = this;

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

    roomsConsole = new ChatConsole('directoryRoomsConsole', 'directoryHeader', consoleManager);
    directoryUsersConsole = new ChatConsole('directoryUsersConsole', 'directoryHeader', consoleManager);
    chatRoomMessagesConsole = new ChatConsole('roomChatMessagesConsole', 'roomChatHeader', consoleManager);
    chatRoomUsersConsole = new ChatConsole('roomChatUsersConsole', 'roomChatHeader', consoleManager);
    privateMessagesConsole = new ChatConsole('privateChatMessagesConsole', 'privateChatHeader', consoleManager);

    chatRoomMessagesTextBox = new ChatTextBox('roomChatMessagesTextBox', consoleManager);
    privateMessagesTextBox = new ChatTextBox('privateChatMessagesTextBox', consoleManager);

    consoleManager.buttons = {
      changeName: changeNameButton,
      newRoom: newRoomButton,
      addBot: addBotButton,
      confirm: confirmButton,
      cancel: cancelButton
    };
    consoleManager.panels = {
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
    consoleManager.consoles = {
      rooms: roomsConsole,
      directoryUsers: directoryUsersConsole,
      chatRoomMessages: chatRoomMessagesConsole,
      chatRoomUsers: chatRoomUsersConsole,
      privateMessages: privateMessagesConsole
    };
    consoleManager.textBoxes = {
      chatRoomMessages: chatRoomMessagesTextBox,
      privateMessages: privateMessagesTextBox
    };
  }

  function hookUpEventListeners() {
    var consoleManager;

    consoleManager = this;

    util.listen(consoleManager.panels.roomChat.header, 'click', function() {
      onPanelHeaderClick.call(consoleManager, consoleManager.panels.roomChat.container);
    });
    util.listen(consoleManager.panels.directory.header, 'click', function() {
      onPanelHeaderClick.call(consoleManager, consoleManager.panels.directory.container);
    });
    util.listen(consoleManager.panels.commands.header, 'click', function() {
      onPanelHeaderClick.call(consoleManager, consoleManager.panels.commands.container);
    });
    util.listen(consoleManager.panels.emoticons.header, 'click', function() {
      onPanelHeaderClick.call(consoleManager, consoleManager.panels.emoticons.container);
    });
    util.listen(consoleManager.panels.privateChat.header, 'click', function() {
      onPanelHeaderClick.call(consoleManager, consoleManager.panels.privateChat.container);
    });

    util.listen(consoleManager.buttons.changeName, 'click', function() {
      onButtonClick.call(consoleManager, consoleManager.buttons.changeName);
    });
    util.listen(consoleManager.buttons.newRoom, 'click', function() {
      onButtonClick.call(consoleManager, consoleManager.buttons.newRoom);
    });
    util.listen(consoleManager.buttons.addBot, 'click', function() {
      onButtonClick.call(consoleManager, consoleManager.buttons.addBot);
    });
    util.listen(consoleManager.buttons.confirm, 'click', function() {
      onButtonClick.call(consoleManager, consoleManager.buttons.confirm);
    });
    util.listen(consoleManager.buttons.cancel, 'click', function() {
      onButtonClick.call(consoleManager, consoleManager.buttons.cancel);
    });
  }

  function onPanelHeaderClick(panelContainer) {
    var consoleManager = this;

    util.toggleClass(panelContainer, 'closed');
  }

  function onButtonClick(button) {
    var consoleManager, value;
    consoleManager = this;

    switch (button) {
      case consoleManager.buttons.changeName:
        openTextEntryDialogue.call(consoleManager, false);
        break;
      case consoleManager.buttons.newRoom:
        openTextEntryDialogue.call(consoleManager, true);
        break;
      case consoleManager.buttons.addBot:
        consoleManager.bots.push(new ChatBot(consoleManager));
        break;
      case consoleManager.buttons.confirm:
        value = consoleManager.panels.textEntryDialogue.textBox.getAttribute('value');
        if (consoleManager.dialogueIsForNewRoom) {
          joinRoom.call(consoleManager, value);
        } else {
          changeOwnNickname.call(consoleManager, value);
        }
        closeTextEntryDialogue.call(consoleManager);
        break;
      case consoleManager.buttons.cancel:
        closeTextEntryDialogue.call(consoleManager);
        break;
      default:
        return;
    }
  }

  function openTextEntryDialogue(dialogueIsForNewRoom) {
    var consoleManager, placeholder;
    consoleManager = this;

    consoleManager.dialogueIsForNewRoom = dialogueIsForNewRoom;
    util.toggleClass(consoleManager.panels.textEntryDialogue.container, 'hidden', false);
    consoleManager.panels.textEntryDialogue.textBox.setAttribute('value', '');

    placeholder = dialogueIsForNewRoom ? 'Room name' : 'Nickname';
    consoleManager.panels.textEntryDialogue.textBox.setAttribute('placeholder', placeholder);

    consoleManager.panels.textEntryDialogue.textBox.focus();
  }

  function closeTextEntryDialogue() {
    var consoleManager = this;

    util.toggleClass(consoleManager.panels.textEntryDialogue.container, 'hidden', true);
  }

  /**
   *
   * @function ConsoleManager~printHelp
   * @param {ChatConsole} console
   */
  function printHelp(console) {
    var consoleManager = this;

    helpMessages.forEach(function(helpMessage) {
      console.addMessage(helpMessage);
    });
  }

  /**
   *
   * @function ConsoleManager~printRooms
   * @param {ChatConsole} console
   */
  function printRooms(console) {
    var consoleManager, time, message, text;

    consoleManager = this;
    time = Date.now();

    if (consoleManager.allRooms.length > 0) {
      consoleManager.allRooms.forEach(function(room) {
        message = new Message(room.name, room.name, null, time, 'room');
        console.addMessage(message);
      });
    } else {
      text = 'There are no open rooms right now.';
      message = new Message(text, text, null, time, 'system');
    }
  }

  /**
   *
   * @function ConsoleManager~joinRoom
   * @param {String} roomName
   * @param {Message} [message]
   */
  function joinRoom(roomName, message) {
    var consoleManager, time, room, rawText, parsedText, welcomeMessage, userCountMessage;
    consoleManager = this;
    time = Date.now();

    room = getRoomFromName.call(consoleManager, message.arguments[0]);

    // Create a new room if a room of this name did not already exist
    if (room === null) {
      room = new Room(roomName, [], Date.now());
    }

    // Create the message if it does not already exist
    if (!message) {
      rawText = '/join ' + room.name;
      parsedText = '<code class=\'command\'>' + rawText + '</code>';
      message = new Message(rawText, parsedText, consoleManager.thisUser, time, 'out', 'join', [room.name]);
    }

    consoleManager.ioManager.sendMessage(message);

    // --- Set up the room chat console for this new room --- //

    consoleManager.activeRoom = room;
    room.users.push(consoleManager.thisUser);
    consoleManager.textBoxes.chatRoomMessages.focus();

    rawText = 'Welcome ' + consoleManager.thisUser.name + ' to room ' + room.name + '!';
    parsedText = parseRooms.call(consoleManager, rawText);
    parsedText = parseUsers.call(consoleManager, parsedText);
    welcomeMessage = new Message(rawText, parsedText, null, time, 'system');

    rawText = 'There are ' + room.users.length + ' users in this room.';
    parsedText = rawText;
    userCountMessage = new Message(rawText, parsedText, null, time, 'system');

    consoleManager.consoles.chatRoomMessages.setTitle('Room: ' + room.name);
    consoleManager.consoles.chatRoomMessages.clearMessages();
    consoleManager.consoles.chatRoomMessages.addMessage(welcomeMessage);
    consoleManager.consoles.chatRoomMessages.addMessage(userCountMessage);
  }

  /**
   *
   * @function ConsoleManager~showPrivateMessage
   * @param {Message} message
   */
  function showPrivateMessage(message) {
    var consoleManager = this;

    // TODO:

    consoleManager.ioManager.sendMessage(message);

    consoleManager.textBoxes.privateMessages.focus();
  }

  /**
   *
   * @function ConsoleManager~changeOwnNickname
   * @param {String} nickName
   * @param {Message} [message]
   * @param {ChatConsole} console
   */
  function changeOwnNickname(nickName, message, console) {
    var consoleManager, time, rawText, parsedText, clientMessage, oldName;
    consoleManager = this;
    time = Date.now();

    if (getUserFromName(nickName) === null) {
      // There is already a user with this name

      rawText = 'There is already a user with the name ' + nickName;
    } else {
      // Change to this new nickname

      // Create the message if it does not already exist
      if (!message) {
        rawText = '/nick ' + nickName;
        parsedText = '<code class=\'command\'>' + rawText + '</code>';
        message = new Message(rawText, parsedText, consoleManager.thisUser, time, 'out', 'nick', [nickName]);
      }

      consoleManager.ioManager.sendMessage(message);

      // TODO: need to actually get a response back from the server that the name change was successful

      // Update this client with the new name
      oldName = consoleManager.thisUser.name;
      consoleManager.thisUser.name = nickName;

      rawText = 'You changed your name from ' + oldName + ' to ' + nickName;
    }

    // Notify the user that we did something
    parsedText = parseUsers.call(consoleManager, rawText);
    clientMessage = new Message(rawText, parsedText, null, time, 'system');
    console.addMessage(clientMessage);
  }

  /**
   *
   * @function ConsoleManager~pingUser
   * @param {String} userName
   * @param {Message} message
   * @param {ChatConsole} console
   */
  function pingUser(userName, message, console) {
    var consoleManager, time, rawText, parsedText, clientMessage;
    consoleManager = this;
    time = Date.now();

    if (getUserFromName(userName) === null) {
      // There is no user with this name

      rawText = 'There is no user with the name ' + userName;
    } else {
      // Ping the user

      consoleManager.ioManager.sendMessage(message);

      rawText = 'Pinging ' + userName + '...';
    }

    // Notify the user that we did something
    parsedText = parseUsers.call(consoleManager, rawText);
    clientMessage = new Message(rawText, parsedText, null, time, 'system');
    console.addMessage(clientMessage);
  }

  /**
   *
   * @function ConsoleManager~ignoreUser
   * @param {String} userName
   * @param {ChatConsole} console
   */
  function ignoreUser(userName, console) {
    var consoleManager, time, ignoredUser, rawText, parsedText, clientMessage, oldName;
    consoleManager = this;
    time = Date.now();

    ignoredUser = getUserFromName(userName);

    if (ignoredUser === null) {
      // There is no user with this name

      rawText = 'There is no user with the name ' + userName;
    } else if (!ignoredUser.isIgnored) {
      // Start ignoring this other user

      ignoredUser.isIgnored = true;

      // TODO: remove all previously displayed messages from the ignored user

      rawText = 'You are now ignoring all messages from ' + userName;
    } else {
      // Stop ignoring this other user

      ignoredUser.isIgnored = false;

      // TODO: show all previously hidden messages from the ignored user

      rawText = 'You are now receiving messages from ' + userName;
    }

    // Notify the user that we did something
    parsedText = parseUsers.call(consoleManager, rawText);
    clientMessage = new Message(rawText, parsedText, null, time, 'system');
    console.addMessage(clientMessage);
  }

  /**
   *
   * @function ConsoleManager~leaveRoom
   * @param {Message} [message]
   * @param {ChatConsole} console
   */
  function leaveRoom(message, console) {
    var consoleManager, time, rawText, parsedText;
    consoleManager = this;
    time = Date.now();

    // Hide the panel
    util.toggleClass(console.elements.container, 'hidden', true);

    // We do not need to inform the server when "leaving" a private chat
    if (console === consoleManager.consoles.chatRoomMessages) {
      // Create the message if it does not already exist
      if (!message) {
        rawText = '/leave';
        parsedText = '<code class=\'command\'>' + rawText + '</code>';
        message = new Message(rawText, parsedText, consoleManager.thisUser, time, 'out', 'leave');
      }

      consoleManager.ioManager.sendMessage(message);

      consoleManager.activeRoom.users.splice(consoleManager.activeRoom.users.indexOf(consoleManager.thisUser), 1);
      consoleManager.activeRoom = null;
    }
  }

  /**
   *
   * @function ConsoleManager~quit
   * @param {Message} [message]
   * @param {ChatConsole} console
   */
  function quit(message, console) {
    var consoleManager, time, rawText, parsedText, clientMessage;
    consoleManager = this;
    time = Date.now();

    // Create the message if it does not already exist
    if (!message) {
      rawText = '/quit';
      parsedText = '<code class=\'command\'>' + rawText + '</code>';
      message = new Message(rawText, parsedText, consoleManager.thisUser, time, 'out', 'quit');
    }

    consoleManager.ioManager.sendMessage(message);

    // Notify the user that we did something
    rawText = 'Goodbye ' + consoleManager.thisUser + '!';
    parsedText = parseUsers.call(consoleManager, rawText);
    clientMessage = new Message(rawText, parsedText, null, time, 'system');
    console.addMessage(clientMessage);

    // Close this window
    setTimeout(function() {
      open(location, '_self').close();
    }, 1500);
  }

  /**
   *
   * @function ConsoleManager~sendMessage
   * @param {Message} message
   * @param {ChatConsole} console
   */
  function sendMessage(message, console) {
    var consoleManager;
    consoleManager = this;

    consoleManager.ioManager.sendMessage(message);

    console.addMessage(message);
  }

  /**
   *
   * @function ConsoleManager~getRoomFromName
   * @param {String} roomName
   * @returns {Room}
   */
  function getRoomFromName(roomName) {
    var consoleManager, i, count;

    consoleManager = this;

    for (i = 0, count = consoleManager.allRooms.length; i < count; i++) {
      if (consoleManager.allRooms[i].name === roomName) {
        return consoleManager.allRooms[i];
      }
    }

    return null;
  }

  /**
   *
   * @function ConsoleManager~getUserFromName
   * @param {String} userName
   * @returns {User}
   */
  function getUserFromName(userName) {
    var consoleManager, i, count;

    consoleManager = this;

    for (i = 0, count = consoleManager.allUsers.length; i < count; i++) {
      if (consoleManager.allUsers[i].name === userName) {
        return consoleManager.allUsers[i];
      }
    }

    return null;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   *
   * @function ConsoleManager#resize
   */
  function resize() {
    var consoleManager, panelBodyWidth, mainConsoleWidth, usersConsoleWidth, privateConsoleWidth;

    consoleManager = this;

    panelBodyWidth = document.getElementById('contentColumn').offsetWidth;
    mainConsoleWidth = panelBodyWidth - params.PANELS.BODY_MARGIN * 2 - params.PANELS.BORDER_THICKNESS * 3 - params.PANELS.USERS_CONSOLE_WIDTH;
    usersConsoleWidth = params.PANELS.USERS_CONSOLE_WIDTH;
    privateConsoleWidth = params.PANELS.PRIVATE_CONSOLE_WIDTH;

    consoleManager.consoles.rooms.resize(mainConsoleWidth);
    consoleManager.consoles.directoryUsers.resize(usersConsoleWidth);
    consoleManager.consoles.chatRoomMessages.resize(mainConsoleWidth);
    consoleManager.consoles.chatRoomUsers.resize(usersConsoleWidth);
    consoleManager.consoles.privateMessages.resize(privateConsoleWidth);

    consoleManager.textBoxes.chatRoomMessages.resize(mainConsoleWidth - params.PANELS.TEXT_BOX_PADDING * 2);
    consoleManager.textBoxes.privateMessages.resize(privateConsoleWidth - params.PANELS.TEXT_BOX_PADDING * 2);
  }

  /**
   *
   * @function ConsoleManager#handleOutGoingMessage
   * @param {String} text
   * @param {ChatTextBox} chatTextBox
   */
  function handleOutGoingMessage(text, chatTextBox) {
    var consoleManager, message, isPrivateMessage, console;

    consoleManager = this;

    isPrivateMessage = chatTextBox === consoleManager.textBoxes.privateMessages;
    message = consoleManager.ioManager.parseOutGoingMessage(text, consoleManager.thisUser, consoleManager.activeRoom, consoleManager.privateChatUser, isPrivateMessage);

    if (chatTextBox === consoleManager.textBoxes.chatRoomMessages) {
      console = consoleManager.consoles.chatRoomMessages;
      console.addMessage(message);

      switch (message.command) {
        case 'none':
          sendMessage.call(consoleManager, message);
          break;
        case 'help':
          printHelp.call(consoleManager, console);
          break;
        case 'rooms':
          printRooms.call(consoleManager, console);
          break;
        case 'join':
          joinRoom.call(consoleManager, message.arguments[0], message);
          break;
        case 'msg':
          showPrivateMessage.call(consoleManager, message);
          break;
        case 'nick':
          changeOwnNickname.call(consoleManager, message.arguments[0], message, console);
          break;
        case 'ping':
          pingUser.call(consoleManager, message.arguments[0], message, console);
          break;
        case 'ignore':
          ignoreUser.call(consoleManager, message.arguments[0], console);
          break;
        case 'leave':
          leaveRoom.call(consoleManager, message, console);
          break;
        case 'quit':
          quit.call(consoleManager, message, console);
          break;
        default:
          break;
      }
    } else if (chatTextBox === consoleManager.textBoxes.privateMessages) {
      consoleManager.consoles.privateMessages.addMessage(message);
    }
  }

  /**
   *
   * @function ConsoleManager#parseRawMessageTextForDom
   * @param {String} text
   * @returns {String}
   */
  function parseRawMessageTextForDom(text) {
    var consoleManager = this;
    text = parseCommands(text);
    text = parseEmoticons(text);
    text = parseRooms.call(consoleManager, text);
    text = parseUsers.call(consoleManager, text);
    return text;
  }

  /**
   *
   * @function ConsoleManager#parseRooms
   * @param {String} text
   * @returns {String}
   */
  function parseRooms(text) {
    var consoleManager = this;
    consoleManager.allRooms.forEach(function(room) {
      text = text.replace(room.name, '<code class=\'room\'>' + room.name + '</code>');
    });
    return text;
  }

  /**
   *
   * @function ConsoleManager#parseUsers
   * @param {String} text
   * @returns {String}
   */
  function parseUsers(text) {
    var consoleManager = this;
    consoleManager.allUsers.forEach(function(user) {
      text = text.replace(user.name, '<code class=\'user\'>' + user.name + '</code>');
    });
    return text;
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   *
   * @function ConsoleManager~initHelpMessages
   */
  function initHelpMessages() {
    var message, time, parsedText;
    time = Date.now();
    helpMessages = [];
    params.L18N.EN.HELP_MESSAGES.forEach(function(rawText) {
      parsedText = parseCommands(rawText);
      parsedText = parseEmoticons(parsedText);
      message = new Message(rawText, parsedText, null, time, 'system');
      helpMessages.push(message);
    });
  }

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
    Room = app.Room;
    User = app.User;
    Message = app.Message;
    ChatConsole = app.ChatConsole;
    ChatTextBox = app.ChatTextBox;
    IOManager = app.IOManager;
    ChatBot = app.ChatBot;
    initHelpMessages();
    log.d('initStaticFields', 'Module initialized');
  }

  /**
   *
   * @function ConsoleManager.parseCommands
   * @param {String} text
   * @returns {String}
   */
  function parseCommands(text) {
    for (var property in params.COMMANDS) {
      text = text.replace(property, params.COMMANDS[property]);
    }
    return text;
  }

  /**
   *
   * @function ConsoleManager.parseEmoticons
   * @param {String} text
   * @returns {String}
   */
  function parseEmoticons(text) {
    for (var property in params.EMOTICONS) {
      text = text.replace(property, params.EMOTICONS[property]);
    }
    return text;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   */
  function ConsoleManager() {
    var consoleManager = this;

    consoleManager.ioManager = new IOManager(consoleManager);
    consoleManager.thisUser = null;
    consoleManager.activeRoom = null;
    consoleManager.privateChatUser = null;
    consoleManager.allUsers = [];
    consoleManager.allRooms = [];
    consoleManager.bots = [];
    consoleManager.dialogueIsForNewRoom = false;
    consoleManager.buttons = null;
    consoleManager.panels = null;
    consoleManager.consoles = null;
    consoleManager.textBoxes = null;
    consoleManager.resize = resize;
    consoleManager.handleOutGoingMessage = handleOutGoingMessage;

    setUpElements.call(consoleManager);
    resize.call(consoleManager);

    // Re-adjust sizes in response to changes in the window's size
    util.listen(window, 'resize', function () {
      resize.call(consoleManager);
    });

  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.ConsoleManager = ConsoleManager;
  ConsoleManager.initStaticFields = initStaticFields;
  ConsoleManager.parseCommands = parseCommands;
  ConsoleManager.parseEmoticons = parseEmoticons;

  console.log('ConsoleManager module loaded');
})();
