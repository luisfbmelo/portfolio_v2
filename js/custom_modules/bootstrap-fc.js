global.$ = require('jquery');

var bootstrap = require("../plugins/bootstrap.js");

$(".fake-backgrop").on("click", function(){
	$(".modal").modal('hide')
});