function updateStar() {
	var star = document.getElementById("mapobject").contentDocument.getElementById("star");
	var searchX = ($("#searchX").val()* 5) - 9.52;
	var searchY = 500 - (($("#searchY").val()* 5) - 20);
	star.setAttributeNS(null, "transform", "translate("+ searchX + ", " + searchY +")");
}

function updatePins(){
	var pins = document.getElementById("mapobject").contentDocument.getElementById("pins");
	pins.textContent = "";
	$(".results__item:not(:hidden)").each(function(){
		var pinX = ($(".addX", this).val() * 5) - 8.5;
		var pinY = 500 - (($(".addY", this).val() * 5) - 22);
		var newPin = document.createElementNS("http://www.w3.org/2000/svg", "use")
		newPin.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#pin");
		newPin.setAttributeNS(null, "class", "pin");
		newPin.setAttributeNS(null, "transform", "translate("+ pinX + ", " + pinY +")");
		pins.appendChild(newPin);
	});
}

$(document).ready(function(){
	window.addEventListener("load", function() {
		$(".map").css("visibility", "hidden");
		updateStar();
		updatePins();
		$(".map").css("visibility", "visible");
	});

	/* Show/hide filters & rotate arrow*/
	$(".filter__more").hide();
	$("#morefiltersbtn").click(function(){
		$(".filter__more").slideToggle("slow");
		$(".arrow").toggleClass("arrow--rotatedown");		
	});

	$("#applyfiltersbtn").click(function(){
		$(".map").css("visibility", "hidden");
		$(".filter__more").slideToggle("slow");
		$(".arrow").toggleClass("arrow--rotatedown");
		$(".results__item").show().filter(function(){
			if($("#deliveryfilter").prop("checked") && $(".delivery", this).val() != true){
				return this;
			}
			if($("#takeoutfilter").prop("checked") && $(".takeout", this).val() != true){
				return this;
			}
			if($("#reservationsfilter").prop("checked") && $(".reservations", this).val() != true){
				return this;
			}
			if($("#cardsfilter").prop("checked") && $(".creditcards", this).val() != true){
				return this;
			}
		}).hide();
		updatePins();
		$(".map").css("visibility", "visible");
	});

	$("#resetfiltersbtn").click(function(){
		$(".map").css("visibility", "hidden");
		$(".filter__more").slideToggle("slow").find("input[type='checkbox']:checked").prop("checked", false);
		$(".arrow").toggleClass("arrow--rotatedown");
		$(".results__item").show();
		updatePins();
		$(".map").css("visibility", "visible");
	});

	$(".results__name").hover(function(){
		var curIndex = $(this).closest(".results__item").index();
		var pins = document.getElementById("mapobject").contentDocument.getElementById("pins");
		$(".pin", pins).eq(curIndex).css("fill", "#ed0707");
	}, function(){
		var curIndex = $(this).closest(".results__item").index();
		var pins = document.getElementById("mapobject").contentDocument.getElementById("pins");
		$(".pin", pins).eq(curIndex).css("fill", "#525252")
	});
});

