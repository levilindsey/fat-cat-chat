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
  moduleParams.VERSION = '0.0.1';
  moduleParams.LICENSE =
      'The MIT License (MIT). Copyright (c) 2014 Levi Lindsey <levi@jackieandlevi.com>.';

  // --- Log parameters --- //

  moduleParams = {};
  params.LOG = moduleParams;

  moduleParams.RECENT_ENTRIES_LIMIT = 80;
  moduleParams.DEBUG = true;
  moduleParams.VERBOSE = true;

  // --- Sprite parameters --- //

  moduleParams = {};
  params.SPRITES = moduleParams;

  moduleParams.SRC = params.BASE_DIR + '/images/spritesheet.png';

  // --- Localization parameters --- //

  params.L18N = {};

  moduleParams = {};
  params.L18N.EN = moduleParams;

  moduleParams.TAP_THUMBNAIL_PROMPT = '(tap to expand thumbnail)';

  moduleParams.BAD_BROWSER_MESSAGE =
      ':( Sorry, but some of the fancy features of this app may not work on your browser. You should really upgrade to a newer version.';
  moduleParams.METADATA_ERROR_MESSAGE =
      ':( Unable to download or parse the metadata for the images. Please check your Internet connection and try again.';

  // --- Miscellaneous parameters --- //

  params.TRANSPARENT_GIF_URL = params.BASE_DIR + '/images/transparent.gif';
  params.ADD_CSS_TRANSITION_DELAY = 80;
  params.SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  params.TWO_PI = Math.PI * 2;
  params.HALF_PI = Math.PI * 0.5;
  params.SMALL_SCREEN_WIDTH_THRESHOLD = 900;
  params.SMALL_SCREEN_HEIGHT_THRESHOLD = 675;

  // --- Expose this module --- //

  if (!window.app) window.app = {};
  window.app.params = params;

  console.log('params module loaded');
})();
