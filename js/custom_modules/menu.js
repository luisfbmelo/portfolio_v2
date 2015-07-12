var $ = require('jquery');

$(window).scroll(function() {    

	if (document.getElementsByClassName('top-level-section')[0] != undefined){
		var scroll = $(window).scrollTop();

	    var firstElHeight = document.getElementsByClassName('top-level-section')[0].offsetHeight;

	    if (scroll >= firstElHeight) {
	        $(".menubar").addClass("scrolled");
	    } else {
	        $(".menubar").removeClass("scrolled");
	    }
	}
    
});