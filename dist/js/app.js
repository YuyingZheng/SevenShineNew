$(function() {

	// Nav Toggle
	(function handleNavToggle(){
		$('.J_NavToggle').click(function(e){
			var target = $(this).parents('.nav-toggle');
			if(!target.hasClass('active')){
				target.addClass('active')
				setTimeout(function(){
					$('.J_NavPanel').slideDown('slow');
	      }, 700);
			}
			else{
				$('.J_NavPanel').slideUp('700');
				setTimeout(function(){
					target.removeClass('active')
	      }, 700);
			}
		});
	})();

	// Slider
	(function handleSlider(){
	  var HomeSlider = new Swiper('.J_HomeSlider', {
	    paginationClickable: true,
	    autoplayDisableOnInteraction: false,
	    loop: true,
	    pagination: '.J_HomeSliderPagination',
	    prevButton: '.J_HomeSliderButtonPrev',
	    nextButton: '.J_HomeSliderButtonNext'
	  });
	  
	})();

	// Scroll Top
	(function handleScrollTop(){
		$('.J_ScrollTop').hide(),
		$(window).scroll(function() {
      $(this).scrollTop() > 300 ? $(".J_ScrollTop").fadeIn(300) : $(".J_ScrollTop").stop().fadeOut(300);
    }),
		$('.J_ScrollTop').click(function(e){
			$('html,body').animate({scrollTop: '0'}, 800);
		});
	})();

})

