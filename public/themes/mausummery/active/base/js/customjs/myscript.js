window.jQuery = window.$ = jQuery;


/*-----------------------------------------------------------------------------------*/
/*	PRELOADER
/*-----------------------------------------------------------------------------------*/
jQuery(window).load(function () {
	//Preloader
	setTimeout("jQuery('#preloader').animate({'opacity' : '0'},300,function(){jQuery('#preloader').hide()})",800);
	setTimeout("jQuery('.preloader_hide, .selector_open').animate({'opacity' : '1'},500)",800);

});





/*-----------------------------------------------------------------------------------*/
/*	MENU
/*-----------------------------------------------------------------------------------*/
/* Superfish */
jQuery(document).ready(function() {
	if ($(window).width() >= 768){
		$('.navmenu').superfish({
			animation:{height:"show"},
			speed:250,
			speedOut:250,
			delay:0,
			cssArrows:false,
			pathClass:"current"
		});
	}
});





/*-----------------------------------------------------------------------------------*/
/*	SHOPPING BAG
/*-----------------------------------------------------------------------------------*/
jQuery(document).ready(function() {
	jQuery('.shopping_bag .cart').slideUp(1);
	jQuery('.shopping_bag_btn').click(function(){
		jQuery('.shopping_bag .cart').slideToggle();
		jQuery('.shopping_bag .cart').parent().toggleClass('cart_active');
	});
});






/*-----------------------------------------------------------------------------------*/
/*	LOVE LIST
/*-----------------------------------------------------------------------------------*/
jQuery(document).ready(function() {
	jQuery('.love_list .cart').slideUp(1);
	jQuery('.love_list_btn').click(function(){
		jQuery('.love_list .cart').slideToggle();
		jQuery('.love_list .cart').parent().toggleClass('cart_active');
	});
});






/*-----------------------------------------------------------------------------------*/
/*	TOP SEARCH FORM
/*-----------------------------------------------------------------------------------*/
jQuery(document).ready(function() {
	jQuery('.top_search_form form').slideUp(1);
	jQuery('.top_search_btn').click(function(){
		jQuery('.top_search_form form').slideToggle();
		jQuery('.top_search_form form').parent().toggleClass('form_active');
	});
});














/*-----------------------------------------------------------------------------------*/
/*	IFRAME TRANSPARENT
/*-----------------------------------------------------------------------------------*/
jQuery(document).ready(function() {
	$("iframe").each(function(){
		var ifr_source = $(this).attr('src');
		var wmode = "wmode=transparent";
		if(ifr_source.indexOf('?') != -1) {
		var getQString = ifr_source.split('?');
		var oldString = getQString[1];
		var newString = getQString[0];
		$(this).attr('src',newString+'?'+wmode+'&'+oldString);
		}
		else $(this).attr('src',ifr_source+'?'+wmode);
	});
});









/*-----------------------------------------------------------------------------------*/
/*	MODAL TOVAR VIEW
/*-----------------------------------------------------------------------------------*/






/*-----------------------------------------------------------------------------------*/
/*	FANCYSELECT
/*-----------------------------------------------------------------------------------*/
$(document).ready(function() {
	$('.basic').fancySelect();
});







/*-----------------------------------------------------------------------------------*/
/*	PARRALAX
/*-----------------------------------------------------------------------------------*/
$(window).load(function() {
	if ($(window).width() > 1025){
		jQuery('.flexslider.top_slider .slides li').parallax("50%", -0.5);
		jQuery('.parallax').parallax("50%", -0.5);
	}
	
});







/*-----------------------------------------------------------------------------------*/
/*	SCROLL TOP
/*-----------------------------------------------------------------------------------*/
jQuery(document).ready(function() {	
	$("a.back_top").click(function() {
		$("html, body").animate({ scrollTop: 0 }, "slow");
		return false;
	});
});






/*-----------------------------------------------------------------------------------*/
/*	TOVAR FOTO HEIGHT
/*-----------------------------------------------------------------------------------*/
jQuery(window).load(function(){
	tovarfotoHeight();

});

jQuery(window).resize(function(){
	tovarfotoHeight();
	
});

function tovarfotoHeight() {
	var tovar_img_h = $('.tovar_img_wrapper img').height();
			
	$('.tovar_img_wrapper').css('height', tovar_img_h);
}





/*-----------------------------------------------------------------------------------*/
/*	Tovar Sizes
/*-----------------------------------------------------------------------------------*/






/*-----------------------------------------------------------------------------------*/
/*	Tovar Sizes
/*-----------------------------------------------------------------------------------*/







/*-----------------------------------------------------------------------------------*/
/*	404 PAGE
/*-----------------------------------------------------------------------------------*/
jQuery(window).load(function(){
	errorpageHeight();

});

jQuery(window).resize(function(){
	errorpageHeight();
	
});

function errorpageHeight() {
	if ($(window).width() > 1025){
		var body_h = $(window).height();
		var footer_h = $('footer').height() + 34;
		var errorpage_h = Math.abs(body_h - footer_h);
		$('.page404').css('min-height', errorpage_h);
		
		var wrapper404_h = $('.wrapper404').height() - 100;
		var padding_top = Math.abs((errorpage_h - wrapper404_h)/2);
		
		$('.wrapper404').css('padding-top', padding_top);
	}
}






/*-----------------------------------------------------------------------------------*/
/*	PRICE HOVER EFFECT
/*-----------------------------------------------------------------------------------*/
$(document).ready(function() {
	$(".price_item").hover(
		function () {
			$(this).addClass("price_active");
		}
	);
	$(".price_item").hover(
		function () {
			$('.price_item').removeClass("price_active");
				$(this).addClass("price_active");
			}
		);
});






/*-----------------------------------------------------------------------------------*/
/*	ACCORDION TOGGLES
/*-----------------------------------------------------------------------------------*/
$(document).ready(function(){
	
	$("#accordion h4").eq(2).addClass("active");
	$("#accordion .accordion_content").eq(2).show();

	$("#accordion h4").click(function(){
		$(this).next(".accordion_content").slideToggle("slow")
		.siblings(".accordion_content:visible").slideUp("slow");
		$(this).toggleClass("active");
		$(this).siblings("h4").removeClass("active");
	});

});






/*-----------------------------------------------------------------------------------*/
/*	VIDEO PLAYER
/*-----------------------------------------------------------------------------------*/
$(document).ready(function(){
	$('.video_container').click(function(){
	var video = '<iframe src="'+ $(this).attr('data-video') +'"></iframe>';
	$(this).replaceWith(video); });
});




/*-----------------------------------------------------------------------------------*/
/*	CONTACT FORM
/*-----------------------------------------------------------------------------------*/
jQuery(document).ready(function() {
	$("#ajax-contact-form").submit(function() {
		var str = $(this).serialize();		
		$.ajax({
			type: "POST",
			url: "contact_form/contact_process.php",
			data: str,
			success: function(msg) {
				// Message Sent - Show the 'Thank You' message and hide the form
				if(msg == 'OK') {
					result = '<div class="notification_ok">Your message has been sent. Thank you!</div>';
					$("#fields").hide();
				} else {
					result = msg;
				}
				$('#note').html(result);
			}
		});
		return false;
	});
});





