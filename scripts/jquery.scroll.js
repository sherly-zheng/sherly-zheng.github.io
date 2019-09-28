$(document).ready(function(){
	$(window).scroll(function(){
		var section;
		if($(this).scrollTop() + $(this).height() == $(document).height()){
			section = $(".body__section").last();
		}
		else {
			section = $(".body__section").first();
			while((section.index() >= 0 ) && ($(this).scrollTop() >= section.position().top + section.outerHeight())){
				section = section.next();
			}
		}
		$(".nav__right .nav__link").eq(section.index()).css("font-weight", 700).siblings().css("font-weight", "300");
	});

	$(".nav__link").on("click", function(event){
		var clickedLink = this;
		event.preventDefault();
		if(this.hash != ""){
			hash = this.hash;
			$(":root").animate({scrollTop: $(hash).offset().top}, 300, function(){
				window.location.hash = hash;
				$(clickedLink).css("font-weight", 700).siblings().css("font-weight", "300");
			});
		}
		else {
			$(":root").animate({scrollTop: 0}, 300, function(){
				window.location.hash = "";
			});
		}
	});

	if(window.innerWidth < 768){
		var prevScrollPos = window.pageYOffset;
		$(window).scroll(function(){
			var curScrollPos = window.pageYOffset;
			if(prevScrollPos < curScrollPos){
				$(".nav").css("top", -($(".nav").outerHeight()));
			}
			else {
				$(".nav").css("top", 0);
			}
			prevScrollPos = curScrollPos;
		});
	}
});
