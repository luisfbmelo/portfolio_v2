var $ = require('jquery');

/**
 * 
 * Additional tracking for google analytics.
 * 
 */

// External links
$('a[rel="external"]').on("click", function(e) {
	var dest = $(this).attr('href');

	ga('send', 'event', 'Link', 'External', dest);
});

// Project modal was opened
$('.proj-details-modal').on("click", function(e) {
	var dest = $(this).attr('id');
	ga('send', 'event', 'Project', 'Modal', dest);
});