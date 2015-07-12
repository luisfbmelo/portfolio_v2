var $ = require('jquery');

$(window).scroll(function() {    
    var scroll = $(window).scrollTop();

    var firstElHeight = document.getElementsByClassName('intro-section')[0].offsetHeight;

    if (scroll >= firstElHeight) {
        $(".menubar").addClass("scrolled");
    } else {
        $(".menubar").removeClass("scrolled");
    }
});