/* Fill in the preview menu on the right pane */
function updatePreviewMenu() {
	$(".preview").children().html("");
	$(".preview").show();
	var $restName = $("input[name='restname']").val();
	var $menuName = $(".menu.selected input[name='menuname']").val();
	var $menuDescript = $(".menu.selected input[name='menudescript']").val();
	var $menuTitle="";

	if($restName) {
		$("<div></div>").addClass("preview__restname").html($restName).appendTo($(".preview__header"));
	}
	if($menuName) {
		$("<div></div>").addClass("preview__menuname").html($menuName).appendTo($(".preview__header"));
	}
	if($menuDescript) {
		$("<div></div>").addClass("preview__menudescript").html($menuDescript).appendTo($(".preview__header"));
	}

	$(".menu.selected .group").each(function(){
		var $groupName = $("input[name='groupname']", this).val();
		var $groupDescript = $("input[name='groupdescript']",this).val();

		if($groupName) {
			$("<div></div>").addClass("preview__groupname").html("- " + $groupName + " -").appendTo($(".preview__body"));
		}
		if($groupDescript) {
			$("<div></div>").addClass("preview__groupdescript").html($groupDescript).appendTo($(".preview__body"));
		}

		$(".item", this).each(function(){
			var $itemName = $("input[name='itemname']", this ).val();
			var $itemDescript = $("input[name='itemdescript']", this).val();

			if($itemName) {
				$("<div></div>").addClass("preview__itemname").html($itemName).appendTo($(".preview__body"));
			}
			if($itemDescript) {
				$("<div></div>").addClass("preview__itemdescript").html($itemDescript).appendTo($(".preview__body"));
			}

			$(".price", this).each(function(){
				var $itemIsMP = $("input[name='isMP']", this).val();
				var $itemPrice = $("input[name='price']", this).val();
				var $itemSize = $("input[name='size']", this).val();

				if($itemPrice){
					var $price = $("<div></div>").addClass("preview__itemprice").html("$" + $itemPrice);
					if($itemSize){
						$price.append("/" + $itemSize);
					}
					$price.appendTo($(".preview__body"));
				}
				else if($itemIsMP === "1") {
					$("<div></div>").addClass("preview__itemprice").html("M.P.").appendTo($(".preview__body"));
				}
			});
		});
	});
}

/*	Update buttons on the left pane menu list. 
	If a required value has not been assigned, hide the delete and edit buttons.
	The user should only be allowed to add a second value to an item if its first price has a size */
function updateCtrlButtons() {
	$(".menus .menu.selected .ctrl__btn").prop("disabled", false);;
	$(".menus .menu.selected .editable__inputs input:first-child[value='']").each(function() {
		$(this).closest(".editable").find(".ctrl__edit-btn, .ctrl__del-btn").prop("disabled", true);
	});

	$(".menus .menu.selected .price .editable__inputs").filter(function(){
		if(($("input[name='isMP']", this).val() || $("input[name='price']", this).val()) && !($("input[name='size']", this).val())){
			return this;
		}
	}).closest(".editable").find(".ctrl__add-btn").prop("disabled", true);
}

$(document).ready(function(){
	$(".step:not(:first)").hide();
	$(".modal").hide();
	$(".menus .menu").hide();
	$(".preview").hide();
	$("menus .selected").removeClass("selected");
	
	$days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	for($i = 0; $i < $days.length; $i++){
		$(".schedule-input").append(
			"<tr class='schedule-input__day'>" + 
				"<td class='schedule-input__dayname'>" + $days[$i] + "</td>" + 
				"<td class='schedule-input__opentime'><input class='time-input' type='time' name='opentime' required></td>" + 
				"<td class='schedule-input__closetime'><input class='time-input' type='time' name='closetime' required></td>" + 
				"<td class='schedule-input__open24'><input class='checkbox-input' type='checkbox' name='open24'></td>" + 
				"<td class='schedule-input__closed'><input class='checkbox-input' type='checkbox' name='closed'></td>" + 
			"</tr>");
	}
	/*	Validate step 1: 
		- Restaurant name, address, and schedule must be provided.
		- Address (x, y) must not be taken.
		- x and y coordinates must be between 0 and 100 (inclusive).
		- If a phone number is provided, it must have ten digits and be in the format xxx-xxx-xxxx.
		- Each day in the schedule must have opening and closing hours, be closed or open 24 hours. Additionally, 
		a restaurant cannot be open and closed on the same hour (i.e. Open 8:00am to 8:00am). This would imply that 
		the restaurant is open 24 hours, and the 'Open 24 Hours' checkbox should be checked.
	*/
	$("#step-1 .step__next-btn").click(function(){
		var $errorsFound = 0;
		$("#step-1 .errors").hide();
		$("#step-1 .error").children().hide();
		$("input").css("background","white");

		/* Check for any empty required inputs */
		if($("#step-1 input[required]").filter(function(){
			return !this.value;
		}).css("background", "#ff000052").length > 0) {
			$errorsFound++;
			$("#step-1 .error__required").show();
		}

		/* Check phone number format, if a phone number is provided */
		var $phoneVal = $("#step-1 input[name='phone']").val();
		if($phoneVal) {
			var $phonePatt = /^\d{3}\-\d{3}\-\d{4}$/;
			if(!$phonePatt.test($phoneVal)){
				$errorsFound++;
				$("#step-1 input[name='phone']").css("background", "#ff000052");
				$("#step-1 .error__phone").show();
			}
		}

		/* Check for any times where opening time is the same as closing time */
		if($("#step-1 .schedule-input__day").filter(function(){
			var time1 = $("input[name='opentime'][required]", this).val();
			var time2 = $("input[name='closetime'][required]", this).val();
			if(time1 && time2 && (time1 == time2)){
				$(".time-input", this).css("background", "#ff000052");
				return this;
			}
		}).length > 0){
			$errorsFound++;  
			$("#step-1 .error__time").show();
		}

		var $addXVal = $("#step-1 input[name='addressx']").val();
		var $addYVal = $("#step-1 input[name='addressy']").val();
		/* Check for address inputs that are out of bounds */
		if($("#step-1 .address-input__value").filter(function(){
			return this.value > 100 || this.value < 0;
		}).css("background", "#ff000052").length > 0) {
			$errorsFound++;
			$("#step-1 .error__addr-bounds").show();
		}

		/* Check for unique addresses. If a database error occurs, the user will be redirected to an error page. */
		else if($addXVal && $addYVal){
			$.ajax(
		    {
		        url: "check-rest.php",
		        type: 'post',
		        data: {	addX: $addXVal, addY: $addYVal },
		        success: function(data){
					if(data > 0) {
						$errorsFound++;
						$("#step-1 .error__addr-taken").show();
						$("#step-1 .address-input__value").css("background", "#ff000052");	
					}
					if(data < 0) {
						window.location.href = "error.html";
					}

					if($errorsFound < 1){
						$("#step-1").hide().next(".step").fadeIn(500);
						$(":root").animate({scrollTop: 0}, 300);
					}
					else {
						$("#step-1 .errors").slideDown("fast");
						$(":root").animate({scrollTop: $("#step-1 .errors").offset().top}, 300);
					}
				}
			});
		}
		else {
			$("#step-1 .errors").slideDown("fast");
			$(":root").animate({scrollTop: $("#step-1 .errors").offset().top}, 300);
		}
	});
	
	/*	Validate step 2: Check that all required inputs have a value. */
	$("#step-2 .step__next-btn").click(function(){
		$("#step-2 .errors").hide();
		$("#step-2 .error").children().hide();
		$("#step-2 input:radio").parent().css("border", "none");

		/* Check for any empty required inputs */
		if($("#step-2 .question__answer").has("input[required]").filter(function(){
			return !$("input:checked", this).val();
		}).css("border", "1px solid #ff000052").length > 0){
			$("#step-2 .error__required").show().closest(".errors").slideDown("fast");
			$(":root").animate({scrollTop: $("#step-2 .errors").offset().top}, 300);
		}
		else {
			$("#step-2").hide().next(".step").fadeIn(500);
			$(":root").animate({scrollTop: 0}, 300);
		}	
	});

	/*	Validate step 3: At least one menu must be entered. */
	$("#step-3 .step__next-btn").click(function(){
		$("#step-3 .errors").hide();
		$("#step-3 .error").children().hide();
		if($("#step-3 .menus .menu").length < 1) {
			$("#step-3 .error__required").show().closest(".errors").slideDown("fast");
			$(":root").animate({scrollTop: $("#step-3 .errors").offset().top}, 300);
		}
		else {
			var $schedules = [];
			$(".schedule-input .schedule-input__day").each(function(){
				var day = {
					"opentime": $("input[name='opentime']", this).val(),
					"closetime": $("input[name='closetime']", this).val(),
					"open24": $("input[name='open24']", this).prop("checked"),
					"closed": $("input[name='closed']", this).prop("checked")
				};
				$schedules.push(day);
			});

			var $menus = [];
			$(".menus .menu").each(function(){
				var menu = {
					"menuname": $("input[name='menuname']", this).val(),
					"menudescript": $("input[name='menudescript']", this).val(),
					"groups": []
				};
				$(".group", this).each(function(){
					var group = {
						"groupname": $("input[name='groupname']", this).val(),
						"groupdescript": $("input[name='groupdescript']", this).val(),
						"items": []
					};
					$(".item", this).each(function(){
						var item = {
							"itemname": $("input[name='itemname']", this).val(),
							"itemdescript": $("input[name='itemdescript']", this).val(),
							"prices": []
						};
						$(".price", this).each(function(){
							var price = {
								"isMP": $("input[name='isMP']", this).val(),
								"priceval": $("input[name='price']", this).val(),
								"size": $("input[name='size']", this).val()
							}
							item.prices.push(price);
						});
						group.items.push(item);
					});
					menu.groups.push(group);
				});
				$menus.push(menu);
			});
			
			$.ajax(
		    {
		        url: "add-rest.php",
		        type: 'post',
		        data:
		        	{	
		        		restname: $("#step-1 input[name='restname']").val(),
		        		addX: $("#step-1 input[name='addressx']").val(),
		        		addY: $("#step-1 input[name='addressy']").val(),
		        		phone: $("#step-1 input[name='phone']").val(),
		        		delivery: $("#step-2 input[name='deliver']:checked").val(),
		        		takeout: $("#step-2 input[name='takeout']:checked").val(),
		        		reservations: $("#step-2 input[name='reservations']:checked").val(),
		        		cards: $("#step-2 input[name='cards']:checked").val(),
		        		restdescript: $("#step-2 textarea[name='restdescript']").val(),
		        		schedules: JSON.stringify($schedules),
		        		menus: JSON.stringify($menus)
		        	},
		        success: function(data){
		        	window.location.href = "confirmation.php?restID=" + data;
		        }
			});
		}
	});	


	$(".step__prev-btn:not(:disabled)").click(function(){
		$(this).closest(".step").hide().prev().fadeIn(500);
		$(":root").animate({scrollTop: 0}, 300);
	});

	$(".schedule-input .time-input").keydown(function(){
		$(this).css("background", "white");
		$(this).closest(".schedule-input__day").find(".time-input").attr("required", true);
		$(this).closest(".schedule-input__day").find(".checkbox-input").prop("checked", false);
	});

	$(".schedule-input .checkbox-input").click(function(){
		if($(this).prop("checked")){
			$(this).closest(".schedule-input__day").find(".time-input").css("background", "white").attr("required", false).val("");
			$(this).parent().siblings().children(".checkbox-input").prop("checked", false);
		}
		else {
			$(this).closest(".schedule-input__day").find(".time-input").attr("required", true);
		}
	});

	$(".schedule-input .schedule-input__header:contains('Open 24')").click(function(){
		if($(".schedule-input input[name='open24']:checked").length > 0){
			$(".schedule-input input[name='open24']").prop("checked", false);
			$(".time-input").attr("required", true);
		}
		else {
			$(".schedule-input input[name='open24']").prop("checked", true);
			$(".schedule-input input[name='closed']").prop("checked", false);
			$(".time-input").css("background", "white").attr("required", false).val("");
		}
	});


	/* Show add/delete/edit buttons on hover */
	// $(".editable").hover(function() {
	// 	$(".ctrl", this).css("visibility", "visible");
	// }, function() {
	// 	$(".ctrl", this).css("visibility", "hidden");
	// });

	$(".editable .ctrl").hover(function(){
		$(this).siblings(".editable__label").css("color", "var(--red)");
	}, function(){
		$(this).siblings(".editable__label").css("color", "black");
	});


	/* Anytime an input is in focus, its background appearance should be white */
	$(".modal input:not(:radio)").focusin(function() {
		$(this).css("background-color","white");
	});

	/* Show selected menu */
	$(".menunav__menu").click(function() {
		$(".menus .menu.selected").hide();
		$(".menunav .menunav__menu.selected").removeClass("selected");
		$(".menus .menu.selected").removeClass("selected");
	
		var $i = $(this).index();
		$(this).addClass("menunav__menu selected");
		$(".menus .menu").eq($i).addClass("menu selected");
		$(".menus .menu").eq($i).show();

		updateCtrlButtons();
		updatePreviewMenu();
	});

	/* Display modal box to add a new menu */
	$(".menunav__add-menu-btn").click(function() {
		$(".menu-modal").removeClass("edit").addClass("add");
		$(".menu-modal .modal__title").html("Add New Menu");
		$(".menu-modal .modal__instructions").html("Complete the following form to add a new menu. <span class='asterisk'>*</span> = required field.")
		$(".menu-modal .errors").hide();
		$(".menu-modal .error").children().hide();
		$(".menu-modal").find("input, textarea").css("background", "white").val("");
		$(".menu-modal").show();
	});

	/* Display modal box to edit a menu */
	$(".menu > .editable .ctrl__edit-btn").click(function() {
		$(".menu-modal").removeClass("add").addClass("edit");
		$(".menu-modal .modal__title").html("Edit Menu");
		$(".menu-modal .modal__instructions").html("Complete the following form to edit the selected menu. <span class='asterisk'>*</span> = required field.")
		$(".menu-modal .errors").hide();
		$(".menu-modal .error").children().hide();
		$(".menu-modal").find("input, textarea").css("background", "white").val("");
		$(".menu-modal input[name='menunameinput']").val($(".menus .menu.selected input[name='menuname']").val());
		$(".menu-modal textarea[name='menudescriptinput']").val($(".menus .menu.selected input[name='menudescript']").val());
		$(".menu-modal").show();
	});

	/* Validate form for new menu, then save */
	$(".menu-modal .modal__save-btn").click(function() {
		var $errorFound = false;
		var $menuNameInput = $(".menu-modal input[name='menunameinput']").val().trim();
		var $menuDescriptInput = $(".menu-modal textarea[name='menudescriptinput']").val().trim();
		$(".menu-modal .errors").hide();
		$(".menu-modal .error").children().hide();

		/* Menu name must not be empty */
		if(!$menuNameInput) {
			$errorFound = true;
			$(".menu-modal .error__required").show();
			$(".menu-modal input[name='menunameinput']").css("background", "#ff000052");
		}

		/* Menu name must be unique */
		else {
			if($(".menu-modal").hasClass("add") && $(".menus input[name='menuname']").filter(function(){
				return $(this).val().toLowerCase() === $menuNameInput.toLowerCase();
			}).length > 0) {
				$errorFound = true;
				$(".menu-modal .error__exists").show();
				$(".menu-modal input[name='menunameinput']").css("background", "#ff000052");
			}
			else if($(".menu-modal").hasClass("edit") && $(".menus .menu:not('.menu.selected') input[name='menuname']").filter(function(){
				return $(this).val().toLowerCase() === $menuNameInput.toLowerCase();
			}).length > 0) {
				$errorFound = true;
				$(".menu-modal .error__exists").show();
				$(".menu-modal input[name='menunameinput']").css("background", "#ff000052");
			}
		}

		/* If no errors, add menu. New menu will be selected by default. */
		if(!$errorFound) {
			$(".menu-modal").hide();
			if($(".menu-modal").hasClass("add")){
				$(".menu-modal").removeClass("add");
				$(".menus .menu.selected").hide();
				$(".menunav .menunav__menu.selected").removeClass("selected");
				$(".menus .menu.selected").removeClass("selected");

				$newMenuNav = $("#samples .menunav__menu").clone(true).html($menuNameInput);
				$newMenuNav.appendTo($(".menunav__options"));

				$newMenu = $("#samples .menu").clone(true);
				$("#menuname", $newMenu).html($menuNameInput);
				$("input[name='menuname']", $newMenu).val($menuNameInput);
				$("input[name='menudescript']", $newMenu).val($menuDescriptInput);
				$(".items", $newMenu).hide();
				$newMenu.appendTo($(".menus")).show();
			}

			if($(".menu-modal").hasClass("edit")){
				$(".menu-modal").removeClass("edit");
				$(".menunav__options .menunav__menu.selected").html($menuNameInput);
				$(".menus .menu.selected #menuname").html($menuNameInput);
				$(".menus .menu.selected input[name='menuname']").val($menuNameInput);
				$(".menus .menu.selected input[name='menudescript']").val($menuDescriptInput);
			}

			updateCtrlButtons();
			updatePreviewMenu();
		}
		else {
			$(".menu-modal .errors").slideDown("fast");
		}
	});

	/* Display modal box to add a new group */
	$(".group > .editable .ctrl__add-btn").click(function() {
		$(".group-modal").removeClass("edit").addClass("add");
		$(".group.selected").removeClass("selected");
		$(this).closest(".group").addClass("group selected");
		$(".group-modal .modal__title").html("Add New Group");
		$(".group-modal .modal__instructions").html("Please complete the following form to add a new group. <span class='asterisk'>*</span> = required field.")
		$(".group-modal .errors").hide();
		$(".group-modal .error").children().hide();
		$(".group-modal").find("input, textarea").css("background", "white").val("");
		$(".group-modal").show();
	});

	/* Display modal box to edit a group */
	$(".group > .editable .ctrl__edit-btn").click(function() {
		$(".group-modal").removeClass("add").addClass("edit");
		$(".group.selected").removeClass("selected");
		$(this).closest(".group").addClass("group selected");
		$(".group-modal .modal__title").html("Edit Group");
		$(".group-modal .modal__instructions").html("Complete the following form to edit the selected group. <span class='asterisk'>*</span> = required field.")
		$(".group-modal .errors").hide();
		$(".group-modal .error").children().hide();
		$(".group-modal").find("input, textarea").css("background", "white").val("");
		$(".group-modal input[name='groupnameinput']").val($(".groups .group.selected input[name='groupname']").val());
		$(".group-modal textarea[name='groupdescriptinput']").val($(".groups .group.selected input[name='groupdescript']").val());
		$(".group-modal").show();
	});

	/* Validate form for new group, then save */
	$(".group-modal .modal__save-btn").click(function() {
		var $errorFound = false;
		var $groupNameInput = $(".group-modal input[name='groupnameinput']").val().trim();
		var $groupDescriptInput = $(".group-modal textarea[name='groupdescriptinput']").val().trim();
		$(".group-modal .errors").hide();
		$(".group-modal .error").children().hide();

		/* Group name must not be empty */
		if(!$groupNameInput) {
			$errorFound = true;
			$(".group-modal .error__required").show();
			$(".group-modal input[name='groupnameinput']").css("background", "#ff000052");
		}
		/* Group name must be unique within the selected menu*/
		else {
			if($(".group-modal").hasClass("add") && $(".menus .menu.selected input[name='groupname']").filter(function(){
				return $(this).val().toLowerCase() === $groupNameInput.toLowerCase();
			}).length > 0){
				$errorFound = true;
				$(".group-modal .error__exists").show();
				$(".group-modal input[name='groupnameinput']").css("background", "#ff000052");
			}
			else if($(".group-modal").hasClass("edit") && $(".menus .menu.selected .group:not('.group.selected') input[name='groupname']").filter(function(){
				return $(this).val().toLowerCase() === $groupNameInput.toLowerCase();
			}).length > 0) {
				$errorFound = true;
				$(".group-modal .error__exists").show();
				$(".group-modal input[name='groupnameinput']").css("background", "#ff000052");
			}
		}

		/* If no errors, add group.*/
		if(!$errorFound) {
			$(".group-modal").hide();
			if($(".group-modal").hasClass("add")){
				$(".group-modal").removeClass("add");

				var $newGroup = $("#samples .group").clone(true);
				$("#groupname", $newGroup).html($groupNameInput);
				$("input[name='groupname']", $newGroup).val($groupNameInput);
				$("input[name='groupdescript']", $newGroup).val($groupDescriptInput);
				$(".prices", $newGroup).hide();
				$newGroup.insertAfter($(".menus .group.selected"));

				if(!$(".menus .menu.selected .groups .group:first input[name='groupname']").val()){
					$(".menus .menu.selected .groups .group:first").remove();
				}
			}

			if($(".group-modal").hasClass("edit")){
				$(".group-modal").removeClass("edit");
				$(".menu.selected .group.selected #groupname").html($groupNameInput);
				$(".menu.selected .group.selected input[name='groupname']").val($groupNameInput);
				$(".menu.selected .group.selected input[name='groupdescript']").val($groupDescriptInput);
			}

			$(".group.selected").removeClass("selected");
			updateCtrlButtons();
			updatePreviewMenu();
		}
		else {
			$(".group-modal .errors").slideDown("fast");
		}
	});

	/* Display modal box to add a new item */
	$(".item > .editable .ctrl__add-btn").click(function() {
		$(".item-modal").removeClass("edit").addClass("add");
		$(".item.selected").removeClass("selected");
		$(this).closest(".item").addClass("item selected");
		$(".item-modal .modal__title").html("Add New Item");
		$(".item-modal .modal__instructions").html("Please complete the following form to add a new item. <span class='asterisk'>*</span> = required field.")
		$(".item-modal .errors").hide();
		$(".item-modal .error").children().hide();
		$(".item-modal").find("input, textarea").css("background", "white").val("");
		$(".item-modal").show();
	});

	/* Display modal box to edit an item */
	$(".item > .editable .ctrl__edit-btn").click(function() {
		$(".item-modal").removeClass("add").addClass("edit");
		$(".item.selected").removeClass("selected");
		$(this).closest(".item").addClass("item selected");
		$(".item-modal .modal__title").html("Edit Item");
		$(".item-modal .modal__instructions").html("Complete the following form to edit the selected item. <span class='asterisk'>*</span> = required field.")
		$(".item-modal .errors").hide();
		$(".item-modal .error").children().hide();
		$(".item-modal").find("input, textarea").css("background", "white").val("");
		$(".item-modal input[name='itemnameinput']").val($(".items .item.selected input[name='itemname']").val());
		$(".item-modal textarea[name='itemdescriptinput']").val($(".items .item.selected input[name='itemdescript']").val());
		$(".item-modal").show();
	});

	/* Validate form for new item, then save */
	$(".item-modal .modal__save-btn").click(function() {
		var $errorFound = false;
		var $itemNameInput = $(".item-modal input[name='itemnameinput']").val().trim();
		var $itemDescriptInput = $(".item-modal textarea[name='itemdescriptinput']").val().trim();
		$(".item-modal .errors").hide();
		$(".item-modal .error").children().hide();

		/* Item name must not be empty */
		if(!$itemNameInput) {
			$errorFound = true;
			$(".item-modal .error__required").show();
			$(".item-modal input[name='itemnameinput']").css("background", "#ff000052");
		}

		/* Item name must be unique */
		else {
			if($(".item-modal").hasClass("add") && $(".item.selected").parent(".items").find(".item input[name='itemname']").filter(function() {
				return $(this).val().toLowerCase() === $itemNameInput.toLowerCase();
			}).length > 0) {
				$errorFound = true;
				$(".item-modal .error__exists").show();
				$(".item-modal input[name='itemnameinput']").css("background", "#ff000052");
			}

			else if($(".item-modal").hasClass("edit") && $(".item.selected").parent(".items").find(".item:not('.item.selected') input[name='itemname']").filter(function(){
				return $(this).val().toLowerCase() === $itemNameInput.toLowerCase();
			}).length > 0) {
				$errorFound = true;
				$(".item-modal .error__exists").show();
				$(".item-modal input[name='itemnameinput']").css("background", "#ff000052");
			}
		}

		/* If no errors, add item. */
		if(!$errorFound) {
			$(".item-modal").hide();

			if($(".item-modal").hasClass("add")){
				$(".item-modal").removeClass("add");
				var $newItem = $("#samples .item").clone(true);
				$("#itemname", $newItem).html($itemNameInput);
				$("input[name='itemname']", $newItem).val($itemNameInput);
				$("input[name='itemdescript']", $newItem).val($itemDescriptInput);
				$newItem.insertAfter($(".menus .item.selected"));

				if(!$(".item.selected").parent(".items").find(".item:first input[name='itemname']:first").val()){
					$(".item.selected").parent(".items").find(".item:first").remove();
				}
			}

			if($(".item-modal").hasClass("edit")){
				$(".item-modal").removeClass("edit");
				$(".menu.selected .item.selected #itemname").html($itemNameInput);
				$(".menu.selected .item.selected input[name='itemname']").val($itemNameInput);
				$(".menu.selected .item.selected input[name='itemdescript']").val($itemDescriptInput);
			}

			$(".item.selected").removeClass("selected");
			updateCtrlButtons();
			updatePreviewMenu();
		}

		else {
			$(".item-modal .errors").slideDown("fast");
		}
	});

	/* Display modal box to add a new price */
	$(".price > .editable .ctrl__add-btn").click(function() {
		$(".price-modal").removeClass("edit").addClass("add");
		$(".price.selected").removeClass("selected");
		$(this).closest(".price").addClass("selected");
		$(".price-modal .modal__title").html("Add New Price");
		$(".price-modal .modal__instructions").html("Please complete the following form to add a new price for an item. <span class='asterisk'>*</span> = required field.")
		$(".price-modal .errors").hide();
		$(".price-modal .error").children().hide();
		$(".price-modal .container").css("opacity", "1");
		$(".price-modal input:not(:radio)").attr("readonly", false).css("background", "white").val("");
		
		if($(this).closest(".prices").find(".price:first input[name='price']").val()) {
			$(".price-modal input[name='mpinput']").closest(".question").hide();
			$(".price-modal input[name='mpinput']").attr("required", false);
			$(".price-modal input[name='sizeinput']").attr("required", true).closest(".question").children(".question__text:first").html("Item Size<span class='asterisk'>*</span>:");
		}
		else {
			$(".price-modal input[name='mpinput']").closest(".question").show();
			$(".price-modal input[name='mpinput']").attr("required", true).parent().css("border", "none");
			$(".price-modal input[name='mpinput'][value='0']").prop("checked", true);
			$(".price-modal input[name='sizeinput']").attr("required", false).closest(".question").children(".question__text:first").html("Item Size:");
		}
		$(".price-modal").show();
	});

	/* Display modal box to edit price */
	$(".price > .editable .ctrl__edit-btn").click(function() {
		$(".price-modal").removeClass("add").addClass("edit");
		$(".price.selected").removeClass("selected");
		$(this).closest(".price").addClass("selected");
		$(".price-modal .modal__title").html("Edit Price");
		$(".price-modal .modal__instructions").html("Complete the following form to edit the selected price. <span class='asterisk'>*</span> = required field.")
		$(".price-modal .errors").hide();
		$(".price-modal .error").children().hide();
		$(".price-modal input:not(:radio)").attr("readonly", false).css("background", "white").val("");

		if($(this).closest(".prices").children().length > 1) {
			$(".price-modal input[name='mpinput']").closest(".question").hide();
			$(".price-modal input[name='mpinput']").attr("required", false);
			$(".price-modal input[name='sizeinput']").attr("required", true).closest(".question").children(".question__text:first").html("Item Size<span class='asterisk'>*</span>:");
			$(".price-modal input[name='priceinput']").val($(".prices .price.selected input[name='price']").val());
			$(".price-modal input[name='sizeinput']").val($(".prices .price.selected input[name='size']").val());
		}
		else {
			$(".price-modal input[name='mpinput']").closest(".question").show();
			$(".price-modal input[name='mpinput']").attr("required", true).parent().css("border", "none");
			$(".price-modal input[name='sizeinput']").attr("required", false).closest(".question").children(".question__text:first").html("Item Size:");
			if($(".prices .price.selected input[name='isMP']").val() === "1"){
				$(".price-modal input[name='mpinput'][value='1']").prop("checked", true);
				$(".price-modal input:not(:radio)").attr("readonly", true).css("background", "white").val("");
				$(".price-modal .container").css("opacity", "0.2");
			}
			else {
				$(".price-modal input[name='mpinput'][value='0']").prop("checked", true);
				$(".price-modal input:not(:radio)").attr("readonly", false).css("background", "white").val("");
				$(".price-modal .container").css("opacity", "1");
				$(".price-modal input[name='priceinput']").val($(".prices .price.selected input[name='price']").val());
				$(".price-modal input[name='sizeinput']").val($(".prices .price.selected input[name='size']").val());
			}
		}
		$(".price-modal").show();
	});

	/* Validate form for new price, then save */
	$(".price-modal .modal__save-btn").click(function() {
		var $errorFound = false;
		var $mpVal = $(".price-modal input[name='mpinput']:checked").val();
		var $priceVal = "";
		var $sizeVal = "";
		$(".price-modal .errors").hide();
		$(".price-modal .error").children().hide();

		/* The M.P. question cannot be left unanswered if user is adding first price of an item */
		if($(".price-modal input[name='mpinput']").attr("required") && !$mpVal){
			$errorFound = true;
			$(".price-modal .error__required").show();
			$(".price-modal input[name='mpinput']").parent().css("border", "1px solid #ff000052");
		}

		else {
			$priceVal = $(".price-modal input[name='priceinput']").val();
			$sizeVal = $(".price-modal input[name='sizeinput']").val();
			var pricePatt = /^(\d{1,4})?(\.\d\d)?$/;
			
			if(!$(".price-modal input[name='mpinput']").attr("required") || $mpVal === "0" ){
				/* Check for empty required inputs */
				if($(".price-modal input[required]:not(:radio)").filter(function(){
					return !this.value;
				}).css("background", "#ff000052").length > 0) {
					$errorFound = true;
					$(".price-modal .error__required").show();
				}

				//Check format of price entered (must be xxxx.xx) 
				if($priceVal && !pricePatt.test($priceVal)) {
					$errorFound = true;
					$(".price-modal .error__format").show();
					$(".price-modal input[name='priceinput']").css("background", "#ff000052");
				}

				// Duplicate sizes not allowed
				if($sizeVal && $(".price-modal input[name='sizeinput']").attr("required")){
					if($(".price-modal").hasClass("add") && $(".menus .price.selected").parent().find(".price input[name='size']").filter(function(){
						return $(this).val().toLowerCase() === $sizeVal.trim().toLowerCase();
					}).length > 0) {
						$errorFound = true;
						$(".price-modal .error__exists").show();
						$(".price-modal input[name='sizeinput']").css("background", "#ff000052");
					}
					else if($(".price-modal").hasClass("edit") && $(".price.selected").parent(".prices").find(".price:not('.price.selected') input[name='size']").filter(function(){
						return $(this).val().toLowerCase() === $sizeVal.toLowerCase();
					}).length > 0) {
						$errorFound = true;
						$(".price-modal .error__exists").show();
						$(".price-modal input[name='sizeinput']").css("background", "#ff000052");
					}
				}	
			}
		}

		if(!$errorFound){
			$(".price-modal").hide();
			if($(".price-modal").hasClass("add")){	
				$(".price-modal").removeClass("add");
				var $newPrice = $("#samples .price").clone(true);
				if($priceVal) {
					$("#pricevalue", $newPrice).html("$" + $priceVal);
				}
				else if($mpVal === "1"){
					//$priceVal = "M.P."
					$("#pricevalue", $newPrice).html("M.P.");
				}
				if($sizeVal) {
					$("#sizevalue", $newPrice).html(" / " + $sizeVal);
				}
				
				$("input[name='isMP']", $newPrice).val($mpVal);
				$("input[name='price']", $newPrice).val($priceVal);
				$("input[name='size']", $newPrice).val($sizeVal);
				$newPrice.insertAfter($(".menus .price.selected"));
				
				if(!$(".price.selected").parent(".prices").find(".price:first input[name='price']").val()){
					$(".price.selected").parent(".prices").find(".price:first").remove();
				}
			}

			if($(".price-modal").hasClass("edit")){
				$(".price-modal").removeClass("edit");
				if($priceVal) {
					$(".menu.selected .price.selected #pricevalue").html("$" + $priceVal);
				}
				else if($mpVal === "1"){
					//$priceVal = "M.P.";
					$(".menu.selected .price.selected #pricevalue").html("M.P.");
				}
				if($sizeVal) {
					$(".menu.selected .price.selected #sizevalue").html("/" + $sizeVal);
				}
				else {
					$(".menu.selected .price.selected #sizevalue").html("");
				}

				$(".menu.selected .price.selected input[name='isMP']").val($mpVal)
				$(".menu.selected .price.selected input[name='price']").val($priceVal);
				$(".menu.selected .price.selected input[name='size']").val($sizeVal);
			}

			$(".price.selected").removeClass("selected");

			updateCtrlButtons();
			updatePreviewMenu();
		}
		else {
			$(".price-modal .errors").slideDown("fast");
		}

	});

	/* Hide/show price and size input areas depending on whether item has market price or not */
	$(".price-modal input[name='mpinput']").change(function() {
		var $mpVal = $(this).val();
		$(this).closest(".question__answer").css("border", "none");
		if($mpVal === "1"){
			$(".price-modal .error-container").css("opacity", 0).children().hide();
			$(".price-modal input:not(:radio)").attr("readonly", true).css("background", "white").val("");
			$(".price-modal .container").animate({opacity: "0.2"}, "fast");
		}

		if($mpVal === "0"){
			$(".price-modal input:not(:radio)").attr("readonly", false).css("background", "white").val("");
			$(".price-modal .container").animate({opacity: "1"}, "fast");
		}
	});

	/* Display modal box to confirm deletion */
	$(".editable .ctrl__del-btn").click(function() {
		$(".del-modal").show();
		$(this).closest(".editable").parent().addClass("selected");
	});

	/* Delete selected object upon confirmation */
	$(".del-modal .modal__save-btn").click(function(){
		$(".del-modal").hide();
		var $delObject = $(".menus .selected").last();
		if($delObject.is(".menu")){
			$(".menunav .menunav__menu.selected").remove();
			$delObject.remove();
			updateCtrlButtons();
			$(".menus .menu").hide();
			$(".preview").hide();

		}
		else {
			if(!$delObject.is(".menu") && $delObject.siblings().length === 0){
				$(".editable__value", $delObject).html("");
				$(".editable__inputs input", $delObject).val("");
				$($delObject).children(".list").hide();
				$($delObject).removeClass("selected");
			}
			else {
				$delObject.remove();
			}
			updateCtrlButtons();
			updatePreviewMenu();
		}
	});
	
	/* Close the current modal box */
	$(".modal__cancel-btn").click(function() {
		$(this).closest(".modal").removeClass("add edit").hide();
		$(".groups .selected").removeClass("selected");
	});
});


