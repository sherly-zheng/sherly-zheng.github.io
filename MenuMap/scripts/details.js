$(document).ready(function(){
	$(".menulist__menu").first().addClass("selected");
	$(".preview").first().show();
	$(".restmenus__previews").css("visibility", "visible");

	$(".menulist__menu").click(function(){
		$(this).addClass("selected").siblings(".selected").removeClass("selected");
		$(".preview").hide().eq($(this).index()).show();
	});
});