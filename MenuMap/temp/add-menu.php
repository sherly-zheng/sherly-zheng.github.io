<?php
	$serverName = "149.4.211.180";
	$serverUser = "zhsh6528";
	$serverPsw = "14226528";

	if($_SERVER["REQUEST_METHOD"] == "POST"){
		$restid = $_POST["restid"];
		$menus = json_decode($_POST["menus"]);
		
		try {
			$conn = new PDO("mysql:host=$serverName; dbname=$serverUser", $serverUser, $serverPsw);
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

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

			$conn->beginTransaction();
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
			echo true;
		}
		catch(PDOException $e){
			$conn->rollback();
			echo false;
		}
	}
?>