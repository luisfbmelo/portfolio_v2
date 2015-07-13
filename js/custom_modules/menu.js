var $ = require('jquery');

$(window).scroll(function() {    
	var scroll = $(window).scrollTop();

    if (scroll >= 70) {
        $(".menubar").addClass("scrolled");
    } else {
        $(".menubar").removeClass("scrolled");
    }

});