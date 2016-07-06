global.$ = require('jquery');
var mixitup = require("../plugins/mixitup.js");
var owl = require("./carousel.js");
require("../plugins/ejs.js");

var portfolio = null;

// On LoadMore Button
$(".load-more").on("click", function(e){
	e.preventDefault();
	var thisParent = $('.portfolio-more-button');
	var offset = parseInt($(this).data('current'));
	var limit = parseInt($(this).data('limit'));
	var destList = $("#Container");

	// Set loading for LOAD MORE BUTTON
	isLoading($(this), true);

	// If never requested
	if (portfolio==null){
		$.get("/portfolio/portfolio.json", function(data){
			portfolio = data;	

			// Print List
			printPortList(portfolio, offset, limit, destList);		

			// Check LoadMore button visibility
			checkAvailability(thisParent, offset, limit, portfolio);
		});
	}else{
		// Print List
		printPortList(portfolio, offset, limit, destList);

		// Check LoadMore button visibility
		checkAvailability(thisParent, offset, limit, portfolio);
	}

	// Change current "page"
	$(this).data('current', offset+limit);
	
});

function printPortList(data, offset, limit, dest){
	var data = {'result': data, 'offset': offset, 'limit': limit};

	// Get List HTML
	listHtml = new EJS({url: '/js/templates/worklist.ejs'}).render(data);	

	// Get modals HTML
	modalsHtml = new EJS({url: '/js/templates/workmodals.ejs'}).render(data);	

	// Append and update mixitup
	dest.append(listHtml);
	dest.mixItUp('append',listHtml);

	// Set modals
	$(".portfolio-section > div").append(modalsHtml);
	setCarousel(modalsHtml);
}

/**
 * Check if there are more items. If not, remove button. Else, set button to default text
 */
function checkAvailability(el, offset, limit, obj){
	if (obj!=null && offset+limit >= obj.length){
		$(el).remove();
	}else{

		// Set loading for LOAD MORE BUTTON
		isLoading($(el).find(".load-more"), false);
	}
}

/**
 * Reset carousels
 */
function setCarousel(){
	owl.destroy();
	owl.init();
}

/**
 * Change LOAD MORE button text according to status
 */
function isLoading(el, status){
	el.html((status) ? '<i class="fa fa-spinner animate-circle"></i>' : 'Load More');
}