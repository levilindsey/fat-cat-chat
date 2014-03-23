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

  moduleParams.SEPARATOR_LINE =
      '********************************************************************************';

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
  params.ENTER_KEY_CODE = 13;
  params.TWO_PI = Math.PI * 2;
  params.HALF_PI = Math.PI * 0.5;
  params.SMALL_SCREEN_WIDTH_THRESHOLD = 900;
  params.SMALL_SCREEN_HEIGHT_THRESHOLD = 675;

  params.HEARTBEAT_REQUEST_INTERVAL = 8000;
  params.HEARTBEAT_TIMEOUT_DELAY = params.HEARTBEAT_REQUEST_INTERVAL * 4 + 100;

  params.OUT_COMMANDS = {
    help: {
      regex: /^\/help$/,
      rawString: '/help',
      htmlElement: '<code class=\'command\'>/help</code>'
    },
    rooms: {
      regex: /^\/rooms$/,
      rawString: '/rooms',
      htmlElement: '<code class=\'command\'>/rooms</code>'
    },
    join: {
      regex: /^\/join (\S+)$/,
      rawString: '/join',
      htmlElement: '<code class=\'command\'>/join</code>'
    },
    msg: {
      regex: /^\/msg (\S+) \((.*)\)$/,
      rawString: '/msg',
      htmlElement: '<code class=\'command\'>/msg</code>'
    },
    nick: {
      regex: /^\/nick (\S+)$/,
      rawString: '/nick',
      htmlElement: '<code class=\'command\'>/nick</code>'
    },
    ping: {
      regex: /^\/ping (\S+)$/,
      rawString: '/ping',
      htmlElement: '<code class=\'command\'>/ping</code>'
    },
    ignore: {
      regex: /^\/ignore (\S+)$/,
      rawString: '/ignore',
      htmlElement: '<code class=\'command\'>/ignore</code>'
    },
    leave: {
      regex: /^\/leave$/,
      rawString: '/leave',
      htmlElement: '<code class=\'command\'>/leave</code>'
    },
    quit: {
      regex: /^\/quit$/,
      rawString: '/quit',
      htmlElement: '<code class=\'command\'>/quit</code>'
    }
  };

  params.IN_COMMANDS = {
    msg: {
      regex: /^\/msg (\S+) (\S+) \((.*)\)$/
    },
    pubmsg: {
      regex: /^\/pubmsg (\S+) (\S+) \((.*)\)$/
    },
    userleftroom: {
      regex: /^\/userleftroom (\S+) (\S+)$/
    },
    userjoinedroom: {
      regex: /^\/userjoinedroom (\S+) (\S+)$/
    },
    userleftserver: {
      regex: /^\/userleftserver (\S+)$/
    },
    userjoinedserver: {
      regex: /^\/userjoinedserver (\S+)$/
    },
    userchangedname: {
      regex: /^\/userchangedname (\S+) (\S+)$/
    },
    roomcreated: {
      regex: /^\/roomcreated (\S+)$/
    },
    roomdestroyed: {
      regex: /^\/roomdestroyed (\S+)$/
    },
    pong: {
      regex: /^\/pong (\S+) (\S+) (\S+)$/
    },
    heartbeatrequest: {
      regex: /^\/heartbeatrequest (\S+)$/
    },
    heartbeat: {
      regex: /^\/heartbeat (\S+) \((.*)\) \((.*)\) (\/?\S+) \((.*)\)$/
    },
    error: {
      regex: /^\/error (\/?\S+) \((.*)\)$/
    }
  };

  params.LINK_COMMAND = {
    regex: /\/link (\S+) \((.*)\)/,
    rawString: '/link',
    htmlElement: '<code class=\'command\'>/link</code>'
  };

  params.EMOTICONS = {
    happy: {
      raw: [ ':)', ':-)' ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon happy\' alt=\'Happy emoticon\' />'
    },
    superHappy: {
      raw: [ ':D', ':-D' ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon superHappy\' alt=\'Super happy emoticon\' />'
    },
    wink: {
      raw: [ ';)', ';-)' ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon wink\' alt=\'Wink emoticon\' />'
    },
    cry: {
      raw: [ ':\'(', ':\'-(', ':&#x27;(', ':&#x27;-(' ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon cry\' alt=\'Cry emoticon\' />'
    },
    surprise: {
      raw: [ ':o', ':-o', ':O', ':-O' ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon surprise\' alt=\'Surprise emoticon\' />'
    },
    uncertain: {
      raw: [ ':/', ':-/' ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon uncertain\' alt=\'Uncertain emoticon\' />'
    },
    angry: {
      raw: [ 'x(', 'x-(', 'X(', 'X-(' ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon angry\' alt=\'Angry emoticon\' />'
    },
    sad: {
      raw: [ ':(', ':-(' ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon sad\' alt=\'Sad emoticon\' />'
    },
    sunglasses: {
      raw: [ 'B)', 'B-)' ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon sunglasses\' alt=\'Sunglasses emoticon\' />'
    },
    tongue: {
      raw: [ ':P', ':-P', ':p', ':-p' ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon tongue\' alt=\'Tongue emoticon\' />'
    },
    heart: {
      raw: [ '<3', '&#x3C;3' ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon heart\' alt=\'Heart emoticon\' />'
    },
    blank: {
      raw: [ ':|', ':-|' ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon blank\' alt=\'Blank emoticon\' />'
    }
  };

  params.CAT_GIFS = [
    {
      url: 'http://s3-ec.buzzfed.com/static/2013-10/enhanced/webdr02/15/9/anigif_enhanced-buzz-19667-1381844937-10.gif',
      description: 'Genetics gone wrong'
    },
    {
      url: 'http://s3-ec.buzzfed.com/static/2013-10/enhanced/webdr06/15/10/anigif_enhanced-buzz-1376-1381846217-0.gif',
      description: 'Phantom mouse'
    },
    {
      url: 'http://s3-ec.buzzfed.com/static/2013-10/enhanced/webdr05/15/9/anigif_enhanced-buzz-26358-1381845043-13.gif',
      description: '"Off" button'
    },
    {
      url: 'http://s3-ec.buzzfed.com/static/2013-10/enhanced/webdr05/15/9/anigif_enhanced-buzz-26383-1381845104-25.gif',
      description: 'Best laid plans of mice and...'
    },
    {
      url: 'http://s3-ec.buzzfed.com/static/2013-10/enhanced/webdr05/15/9/anigif_enhanced-buzz-19070-1381845280-0.gif',
      description: 'Emotional support'
    },
    {
      url: 'http://s3-ec.buzzfed.com/static/2013-10/enhanced/webdr01/15/9/anigif_enhanced-buzz-27162-1381845360-0.gif',
      description: 'Who says video games are too violent?'
    },
    {
      url: 'http://s3-ec.buzzfed.com/static/2013-10/enhanced/webdr06/15/9/anigif_enhanced-buzz-23859-1381845509-0.gif',
      description: 'Jenga ninja'
    },
    {
      url: 'http://s3-ec.buzzfed.com/static/2013-10/enhanced/webdr02/15/10/anigif_enhanced-buzz-19659-1381845602-0.gif',
      description: 'Time to bounce'
    },
    {
      url: 'http://s3-ec.buzzfed.com/static/2013-10/enhanced/webdr06/15/10/anigif_enhanced-buzz-25498-1381845743-9.gif',
      description: 'Boop'
    },
    {
      url: 'http://s3-ec.buzzfed.com/static/2013-10/enhanced/webdr01/15/10/anigif_enhanced-buzz-27831-1381845794-0.gif',
      description: 'Lesson learned'
    },
    {
      url: 'http://s3-ec.buzzfed.com/static/2013-10/enhanced/webdr01/15/10/anigif_enhanced-buzz-27162-1381845926-2.gif',
      description: 'You\'re done eating, right?'
    },
    {
      url: 'http://25.media.tumblr.com/0e2318bb03b9f3b0b7cae374168d7b97/tumblr_n1fk1bbQVp1qzefipo1_400.gif',
      description: 'Surprise banana!!'
    },
    {
      url: 'http://iheartcatgifs.tumblr.com/post/75817469922',
      description: 'Anticipation'
    },
    {
      url: 'http://25.media.tumblr.com/0798843644c862737ce1258821b5938a/tumblr_mnba38vUWI1qzcv7no1_400.gif',
      description: 'Hey, I\'m drinking here!!'
    },
    {
      url: 'http://24.media.tumblr.com/dbe0061f677bc80faaf7161adb92e2a3/tumblr_mxe6686riK1spy7ono1_500.gif',
      description: 'Tuckered out'
    },
    {
      url: 'http://i.imgur.com/j8fGYzv.gif',
      description: 'A real head-to-head'
    },
    {
      url: 'http://i.imgur.com/AuO1OPu.gif',
      description: 'Surprise potato!!'
    },
    {
      url: 'http://25.media.tumblr.com/6986166623219890aecb766874bcdd14/tumblr_mm8yjcsbK71s8dwazo1_500.gif',
      description: 'That duck does\'t stand a chance'
    },
    {
      url: 'http://25.media.tumblr.com/420098f49a536183c3def29624ed3324/tumblr_mm1gqktIdt1s8dwazo1_400.gif',
      description: 'I\'m awake! I\'m awake!!!'
    },
    {
      url: 'http://24.media.tumblr.com/abbd800a87c984c74b0350dd0a2ab196/tumblr_mls3nrsE6G1s8dwazo1_500.gif',
      description: 'Cat in a box!'
    },
    {
      url: 'http://31.media.tumblr.com/11d0c46350da900fd6b48eb7dba6edec/tumblr_mlks7zsj1W1s8dwazo1_400.gif',
      description: 'Roll out!'
    },
    {
      url: 'http://25.media.tumblr.com/5440fd4c60ff1c009b6f907dfcb3f463/tumblr_mkc1mlBxlD1s3oe2qo1_500.gif',
      description: 'Cat or metronome?'
    }
  ];

  // --- Expose this module --- //

  if (!window.app) window.app = {};
  window.app.params = params;

  console.log('params module loaded');
})();
