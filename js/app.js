var $ = require('jquery');

// Global Plugins
require("./custom_modules/external.js");
require("./custom_modules/bootstrap-fc.js");

// Animate menu background
require("./custom_modules/menu.js");

var smoothScroll = require('jquery-smooth-scroll');

$('a').smoothScroll({
	speed: 500,
    easing: 'swing',
    offset: -55
});