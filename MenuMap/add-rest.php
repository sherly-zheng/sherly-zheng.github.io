<?php
	$serverName = "149.4.211.180";
	$serverUser = "zhsh6528";
	$serverPsw = "14226528";

	if($_SERVER["REQUEST_METHOD"] == "POST"){
		$restname = urlencode($_POST["restname"]);
		$addX = $_POST["addX"];
		$addY = $_POST["addY"];
		$phone = urlencode($_POST["phone"]);
		$delivery = $_POST["delivery"];
		$takeout = $_POST["takeout"];
		$reservations = $_POST["reservations"];
		$cards = $_POST["cards"];
		$restdescript = urlencode($_POST["restdescript"]);
		$schedules = json_decode($_POST["schedules"]);
		$menus = json_decode($_POST["menus"]);

		try {
			$conn = new PDO("mysql:host=$serverName; dbname=$serverUser", $serverUser, $serverPsw);
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

			$conn->beginTransaction();

			/* Insert new restaurant */
			$sql = "INSERT INTO ".$serverUser.".Restaurant(Name, AddressX, AddressY, Phone, Delivery, Takeout, Reservations, CreditCards, Description)
				VALUES ('".$restname."', '".$addX."', '".$addY."', '".$phone."', ".$delivery.", ".$takeout.", ".$reservations.", ".$cards.", '".$restdescript."')";
			$conn->exec($sql);
			$restid = $conn->lastInsertId();

			/* Insert schedule for new restaurant */
			$schedulestmt = $conn->prepare("INSERT INTO ".$serverUser.".Schedule (RestaurantID, Day, OpenTime, CloseTime, Open24Hrs, Closed) VALUES (:restid, :day, :opentime, :closetime, :open24, :closed);");
			$schedulestmt->bindParam(":restid", $restid);
			$schedulestmt->bindParam(":day", $day);
			$schedulestmt->bindParam(":opentime", $opentime);
			$schedulestmt->bindParam(":closetime", $closetime);
			$schedulestmt->bindParam(":open24", $open24);
			$schedulestmt->bindParam(":closed", $closed);

			foreach($schedules as $day => $hours){
				$opentime = $hours->opentime ?: null;
				$closetime = $hours->closetime ?: null;
				$open24 = $hours->open24 ?: 0;
				$closed = $hours->closed ?: 0;
				$schedulestmt->execute();
			}

			/* Insert menu for new restaurant */
			$menustmt = $conn->prepare("INSERT INTO ".$serverUser.".Menu (RestaurantID, Name, Description) 
				VALUES (:restid, :menuname, :menudescript);");
			$menustmt->bindParam(":restid", $restid);
			$menustmt->bindParam(":menuname", $menuname);
			$menustmt->bindParam(":menudescript", $menudescript);

			$groupstmt = $conn->prepare("INSERT INTO ".$serverUser.".MenuGroup (MenuID, Name, Description) 
				VALUES (:menuid, :groupname, :groupdescript);");
			$groupstmt->bindParam(":menuid", $menuid);
			$groupstmt->bindParam(":groupname", $groupname);
			$groupstmt->bindParam(":groupdescript", $groupdescript);

			$itemstmt = $conn->prepare("INSERT INTO ".$serverUser.".Item (MenuGroupID, Name, Description) 
				VALUES (:groupid, :itemname, :itemdescript);");
			$itemstmt->bindParam(":groupid", $groupid);
			$itemstmt->bindParam(":itemname", $itemname);
			$itemstmt->bindParam(":itemdescript", $itemdescript);

			$pricestmt = $conn->prepare("INSERT INTO ".$serverUser.".Price (ItemID, Price, Size, MP) 
				VALUES (:itemid, :priceval, :size, :mp);");
			$pricestmt->bindParam(":itemid", $itemid);
			$pricestmt->bindParam(":priceval", $priceval);
			$pricestmt->bindParam(":size", $size);
			$pricestmt->bindParam(":mp", $mp);

			foreach($menus as $menu){
				$menuname = urlencode($menu->menuname);
				$menudescript = urlencode($menu->menudescript);
				$menustmt->execute();
				$menuid = $conn->lastInsertId();
				foreach($menu->groups as $group){
					$groupname = urlencode($group->groupname);
					$groupdescript = urlencode($group->groupdescript);
					$groupstmt->execute();
					$groupid = $conn->lastInsertId();
					foreach($group->items as $item){
						$itemname = urlencode($item->itemname);
						$itemdescript = urlencode($item->itemdescript);
						$itemstmt->execute();
						$itemid = $conn->lastInsertId();
						foreach($item->prices as $price){
							$priceval = $price->priceval ?: null;
							$size = urlencode($price->size);
							$mp = $price->isMP ?: 0;
							$pricestmt->execute();
						}
					}
				}
			}

			$conn->commit();
			$conn = null;
			echo $restid;
		}
		catch(PDOException $e){
			$conn->rollback();
			echo -1;
		}
	}
?>