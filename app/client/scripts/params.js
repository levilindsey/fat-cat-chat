/**
 * This module defines a collection of parameters used throughout this app.
 * @module params
 */
(function () {
  var params, moduleParams;

  params = {};

  params.BASE_DIR = '';

  // --- General app parameters --- //

  moduleParams = {};
  params.APP = moduleParams;

  moduleParams.TITLE = 'Fat-Cat Chat';
  moduleParams.VERSION = '0.0.4';
  moduleParams.LICENSE =
      'The MIT License (MIT). Copyright (c) 2014 Levi Lindsey <levi@jackieandlevi.com>.';

  // --- Panel parameters --- //

  moduleParams = {};
  params.PANELS = moduleParams;

  moduleParams.BODY_MARGIN = 16;
  moduleParams.BORDER_THICKNESS = 1;
  moduleParams.USERS_CONSOLE_WIDTH = 200;
  moduleParams.PRIVATE_CONSOLE_WIDTH = 300;
  moduleParams.PRIVATE_CONSOLE_HEIGHT = 260;
  moduleParams.TEXT_BOX_PADDING = 2;

  // --- Log parameters --- //

  moduleParams = {};
  params.LOG = moduleParams;

  moduleParams.RECENT_ENTRIES_LIMIT = 80;
  moduleParams.DEBUG = true;
  moduleParams.VERBOSE = true;

  // --- Sprite parameters --- //

  moduleParams = {};
  params.SPRITES = moduleParams;

  moduleParams.SRC = params.BASE_DIR + '/images/spritesheet_32.png';

  // --- Localization parameters --- //

  params.L18N = {};

  moduleParams = {};
  params.L18N.EN = moduleParams;

  moduleParams.BAD_BROWSER_MESSAGE =
      ':( Sorry, but some of the fancy features of this app may not work on your browser. You should really upgrade to a newer version.';

  moduleParams.HELP_MESSAGES = [
    ' * /help: Type /help to see a list of the available commands.',
    ' * /rooms: Type /rooms to see all of the current rooms.',
    ' * /join: Type /join #&lt;channel_name&gt; to join a new channel. If the channel did not previously exist, it will be created.',
    ' * /msg: Type /msg &lt;user_name&gt; (&lt;message&gt;) to send a private message to a user.',
    ' * /nick: Type /nick &lt;new_nickname&gt; to change your nickname.',
    ' * /ping: Type /ping &lt;user_name&gt; to get the lag time between you and another user.',
    ' * /ignore: Type /ignore &lt;user_name&gt; to ignore all messages from a user.',
    ' * /leave: Type /leave to leave the chat room. If you are the last user to leave the channel, it will be removed.',
    ' * /quit: Type /quit to be removed from the chat server.',
    ' * Type anything not prefixed with / in order to send a message to everyone in the room.'
  ];

  // --- Miscellaneous parameters --- //

  params.TRANSPARENT_GIF_URL = params.BASE_DIR + '/images/empty.gif';
  params.ADD_CSS_TRANSITION_DELAY = 80;
  params.SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  params.TWO_PI = Math.PI * 2;
  params.HALF_PI = Math.PI * 0.5;
  params.SMALL_SCREEN_WIDTH_THRESHOLD = 900;
  params.SMALL_SCREEN_HEIGHT_THRESHOLD = 675;

  params.COMMANDS = {
    '/help': '<code class=\'command\'>/help</code>',
    '/rooms': '<code class=\'command\'>/rooms</code>',
    '/join': '<code class=\'command\'>/join</code>',
    '/msg': '<code class=\'command\'>/msg</code>',
    '/nick': '<code class=\'command\'>/nick</code>',
    '/ping': '<code class=\'command\'>/ping</code>',
    '/ignore': '<code class=\'command\'>/ignore</code>',
    '/leave': '<code class=\'command\'>/leave</code>',
    '/quit': '<code class=\'command\'>/quit</code>'
  };

  params.EMOTICONS = {
    ':)': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'happy\' />',
    ':-)': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'happy\' />',
    ':D': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'superHappy\' />',
    ':-D': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'superHappy\' />',
    ';)': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'wink\' />',
    ';-)': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'wink\' />',
    ':\'(': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'cry\' />',
    ':\'-(': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'cry\' />',
    ':o': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'surprise\' />',
    ':-o': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'surprise\' />',
    ':O': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'surprise\' />',
    ':-O': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'surprise\' />',
    ':/': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'uncertain\' />',
    ':-/': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'uncertain\' />',
    'x(': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'angry\' />',
    'x-(': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'angry\' />',
    ':(': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'sad\' />',
    ':-(': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'sad\' />',
    'B)': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'sunglasses\' />',
    'B-)': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'sunglasses\' />',
    ':P': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'tongue\' />',
    ':-P': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'tongue\' />',
    '<3': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'heart\' />',
    ':|': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'blank\' />',
    ':-|': '<img src=\'' + params.TRANSPARENT_GIF_URL + '\' class=\'blank\' />'
  };

  // --- Expose this module --- //

  if (!window.app) window.app = {};
  window.app.params = params;

  console.log('params module loaded');
})();
