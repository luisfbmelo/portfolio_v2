global.$ = require('jquery');

$('.filter').on('click', function(e){
    var el = $(e.currentTarget);
    console.log(el.data('filter'));

    if(el.data('filter') && el.data('filter')==='.photo'){
        $('.option.photo').show();
    }else{
        $('.option.photo').hide();
    }
});