$(document).ready(function(){
		$('body').on('click', '#hide-card', function(){
			var card = $("#card") 
            card.removeClass('bounceInRight');
            card.addClass('bounceOutRight');
            setTimeout(function(){
                card.hide();
                card.addClass('bounceInRight');
                card.removeClass('bounceOutRight');
            }, 700)
		});
	});