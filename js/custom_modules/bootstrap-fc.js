global.$ = require('jquery');

var bootstrap = require("../plugins/bootstrap.js");

$("section").on("click", ".portfolio-modal .fake-backgrop", function(){
	$(".modal").modal('hide');
});

if(window.location.hash) {  
  var hash = window.location.hash;
  $(hash).modal('show');
}