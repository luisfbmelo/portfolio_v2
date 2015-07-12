global.$ = require('jquery');

var owlCarousel = require("../plugins/owlcarousel.js");
var mixitup = require("../plugins/mixitup.js");

// Execute global plugins
$('#Container').mixItUp();

$("#testimonials-carousel").owlCarousel({
	items: 1,
	singleItem: true
});