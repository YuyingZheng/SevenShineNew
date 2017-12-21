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
	    nextButton: '.J_HomeSliderButtonNext',
	    autoplay :3000
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
  
  // nav toggle
   (function ToggleNav(){
   	var urlstr = location.href;
   	var urlstatus = false;
   	$('.nav li a').each(function() {
   		if((urlstr + '/').indexOf($(this).attr('href'))> -1 && $(this).attr('href')!='') {
   			  $(this).addClass('active');
   			   urlstatus = true;  
   		}
   		else {  
          $(this).removeClass('active');  
     	}})
   	  // if (!urlstatus) {$('.nav li').eq(5).addClass('active'); }  
		// $('.nav li').click(function(e){
  //   		$('.nav li').removeClass('active')
  //   	    $(this).addClass('active')
		// });
	})();
   
   //READ MORE
 	(function ReadMore(){
		$('.readMore').click(function(e){
      target = $(this).next('.poem')
		  if(!target.hasClass('hidden')) {
        	target.addClass('hidden')
        	$(this).text('查看更多')
		  }
		  else {
		  	target.removeClass('hidden')
		  	$(this).text('收起')
		  }
		});
	})();
  

})

