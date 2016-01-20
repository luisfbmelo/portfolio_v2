$("#testimonials-carousel").owlCarousel({
	items: 1,
	singleItem: true,
	autoPlay: true
});

// PORTFOLIO CAROUSEL
var portOptions = { 
    navigation : true,
    slideSpeed : 300,
    paginationSpeed : 400,
    singleItem:true,
    navigationText: [
      "<i class='fa fa-chevron-left'></i>",
      "<i class='fa fa-chevron-right'></i>"
    ],
    itemsScaleUp:true,
    items:1
}

function buildPortOwl(){
  $(".portfolio-carousel").each(function(){
    $(this).owlCarousel(portOptions);
  });
}

module.exports = {
  options: portOptions,
  init: buildPortOwl,
  destroy: function(){
    $(".portfolio-carousel").each(function(){
      if ($(this).data('owlCarousel')!=undefined)
        $(this).data('owlCarousel').destroy();
    });
  }
};

buildPortOwl();