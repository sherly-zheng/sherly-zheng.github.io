function copy(btn){
	$(btn).siblings(".contact__input").select();
	document.execCommand("copy");
	$(".far", btn).removeClass("far").addClass("fas");
}

$(document).ready(function(){
	$(".contact__container").focusout(function(){
		$(".contact__copy .fas").removeClass("fas").addClass("far");
		document.getSelection().removeAllRanges();
	});
})