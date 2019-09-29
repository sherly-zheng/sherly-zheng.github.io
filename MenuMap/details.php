<?php
	function getString($value){
		if($value === "1"){
			return "Yes";
		}
		else if($value === "0"){
			return "No";
		}
		else {
			return "N/A";
		}
	}

	$serverName = "149.4.211.180";
	$serverUser = "zhsh6528";
	$serverPsw = "14226528";
	$restName = $addX = $addY = $description = $phone = $delivery = $takeout = $reservations = $creditcards = $menubtns = $previews = "";
	$schedule = array();
	
	if($_SERVER["REQUEST_METHOD"] == "GET"){
		if(!empty($_GET["restID"])){
			$restID = $_GET["restID"];
			try {
				$conn = new PDO("mysql:host=$serverName; dbname=$serverUser", $serverUser, $serverPsw);
				$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

				$q = "SELECT Name, AddressX, AddressY, Description, Delivery, Takeout, Reservations, CreditCards, Phone
					FROM ".$serverUser.".Restaurant
					WHERE RestaurantID = ".$restID.";";
				$result = $conn->query($q);
				if($result){
					$row = $result->fetch(PDO::FETCH_ASSOC);
					$restName = urldecode($row["Name"]); 
					$addX = $row["AddressX"];
					$addY = $row["AddressY"];
					$description = urldecode($row["Description"]);
					$delivery = getString($row["Delivery"]);
					$takeout = getString($row["Takeout"]);
					$reservations = getString($row["Reservations"]);
					$creditcards = getString($row["CreditCards"]);
					if($row["Phone"]){
						$phone = $row["Phone"];
					}
					else {
						$phone = "N/A";
					}
				}

				$q = "SELECT Day, OpenTime, CloseTime, Closed, Open24Hrs 
					FROM ".$serverUser.".Schedule
					WHERE RestaurantID = ".$restID."
					ORDER BY Day asc;";
				$result = $conn->query($q);
				if($result){
					foreach($result as $row){
						if($row["Closed"] > 0){
							$schedule[$row["Day"]] = "Closed";
						}
						else if($row["Open24Hrs"] > 0){
							$schedule[$row["Day"]] = "Open 24 Hours";
						}
						else {
							$schedule[$row["Day"]] = date("g:iA",strtotime($row["OpenTime"])) ." to ". date("g:iA", strtotime($row["CloseTime"]));
						}
					}
				}

				$qMenu = $conn->prepare("SELECT MenuID, Name, Description
										FROM ".$serverUser.".Menu
										WHERE RestaurantID = :restID
										ORDER BY MenuID asc;");
				$qGroup = $conn->prepare("SELECT MenuGroupID, Name, Description
										FROM ".$serverUser.".MenuGroup
										WHERE MenuID = :menuID
										ORDER BY MenuGroupID asc;");
				$qItem = $conn->prepare("SELECT ItemID, Name, Description
										FROM ".$serverUser.".Item
										WHERE MenuGroupID = :groupID
										ORDER BY ItemID asc;");
				$qPrice = $conn->prepare("SELECT Price, Size, MP
										FROM ".$serverUser.".Price
										WHERE ItemID = :itemID
										ORDER BY PriceID asc;");

				$qMenu->bindParam(":restID", $restID);
				$qMenu->execute();
				foreach($qMenu as $menu) {
					$previews .= '<div class="preview">
									<div class="preview__header">
									<div class="preview__restname">'.$restName.'</div>';
					if($menu["Name"]){
						$menubtns .= '<button class="menulist__menu">'.urldecode($menu["Name"]).'</button>';
						$previews .= '<div class="preview__menuname">'.urldecode($menu["Name"]).'</div>';
					}
					if($menu["Description"]){
						$previews .= '<div class="preview__menudescript">'.urldecode($menu["Description"]).'</div>';
					}
					$previews .= '</div><div class="preview__body">';
					$menuID = $menu["MenuID"];
					$qGroup->bindParam(":menuID", $menuID);
					$qGroup->execute();
					foreach($qGroup as $group){
						if($group["Name"]){
							$previews .= '<div class="preview__groupname">- '.urldecode($group["Name"]).' -</div>';
						}
						if($group["Description"]){
							$previews .= '<div class="preview__groupdescript">'.urldecode($group["Description"]).'</div>';
						}
						$groupID = $group["MenuGroupID"];
						$qItem->bindParam(":groupID", $groupID);
						$qItem->execute();
						foreach($qItem as $item){
							if($item["Name"]){
								$previews .= '<div class="preview__itemname">'.urldecode($item["Name"]).'</div>';
							}
							if($item["Description"]){
								$previews .= '<div class="preview__itemdescript">'.urldecode($item["Description"]).'</div>';
							}
							$itemID = $item["ItemID"];
							$qPrice->bindParam(":itemID", $itemID);
							$qPrice->execute();
							foreach($qPrice as $price){
								if($price["Price"]){
									$previews .= '<div class="preview__itemprice">$'.$price["Price"];
									if($price["Size"]){
										$previews .= '/'.urldecode($price["Size"]);
									}
									$previews .= '</div>';
								}
								else if($price["MP"] > 0){
									$previews .= '<div class="preview__itemprice">M.P.</div>';
								}
							}
						}
					}
					$previews .= '</div></div>';
				}
				$conn = null;
			}
			catch(PDOException $e){
				echo $e;
			}
		}
		else {
			//Show error message
			echo "error";
		}
		
	}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo $restName ?> | MenuMap</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="stylesheets/default.css">
		<link href="https://fonts.googleapis.com/css?family=EB+Garamond|Raleway|Roboto+Slab&display=swap" rel="stylesheet">
		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/solid.css" integrity="sha384-QokYePQSOwpBDuhlHOsX0ymF6R/vLk/UQVz3WHa6wygxI5oGTmDTv8wahFOSspdm" crossorigin="anonymous">
    	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/fontawesome.css" integrity="sha384-vd1e11sR28tEK9YANUtpIOdjGW14pS87bUBuOIoBILVWLFnS+MCX9T6MMf0VdPGq" crossorigin="anonymous">
    	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	</head>
	<body>
		<div class="topnav row">
			<a class="topnav__link col-12" href="home.html">MenuMap</a>
		</div>
		<div class="body">
			<div class="intro">
				<h1 class="intro__name"><?php echo $restName ?> <span class="intro__address">(<?php echo $addX ?>, <?php echo $addY ?>)</span></h1>
				
				<p class="intro__descript"><?php echo $description ?></p>
			</div>
			<div class="details row">
				<div class="info col-8">
					<h3 class="info__heading">Information</h3>
					<span class="info__container">
						<span class="info__label">Phone: </span><?php echo $phone ?>
					</span>
					<span class="info__container">
						<span class="info__label">Offers Delivery: </span><?php echo $delivery ?>
					</span>
					<span class="info__container">
						<span class="info__label">Offers Takeout: </span><?php echo $takeout ?>
					</span>
					<span class="info__container">
						<span class="info__label">Accepts Reservations: </span><?php echo $reservations ?>
					</span>
					<span class="info__container">
						<span class="info__label">Accepts Credit Cards: </span><?php echo $creditcards ?>
					</span>
				</div>
				<div class="schedule col-4">
					<h3 class="schedule__heading">Opening Hours</h3>
					<div class="schedule__day">
						<span class="schedule__label">Monday: </span>
						<span class="schedule__hours"><?php echo $schedule[0] ?></span>
					</div>
					<div class="schedule__day">
						<span class="schedule__label">Tuesday: </span>
						<span class="schedule__hours"><?php echo $schedule[1] ?></span>
					</div>
					<div class="schedule__day">
						<span class="schedule__label">Wednesday: </span>
						<span class="schedule__hours"><?php echo $schedule[2] ?></span>
					</div>
					<div class="schedule__day">
						<span class="schedule__label">Thursday: </span>
						<span class="schedule__hours"><?php echo $schedule[3] ?></span>
					</div>
					<div class="schedule__day">
						<span class="schedule__label">Friday: </span>
						<span class="schedule__hours"><?php echo $schedule[4] ?></span>
					</div>
					<div class="schedule__day">
						<span class="schedule__label">Saturday: </span>
						<span class="schedule__hours"><?php echo $schedule[5] ?></span>
					</div>
					<div class="schedule__day">
						<span class="schedule__label">Sunday: </span>
						<span class="schedule__hours"><?php echo $schedule[6] ?></span>
					</div>				
				</div>
			</div>

			<div class="restmenus">
				<h3 class="restmenus__heading">Menus</h3>
				<div class="restmenus__menulist menulist">
					<?php echo $menubtns ?>
				</div>

				<div class="restmenus__previews">
					<?php echo $previews ?>
				</div>
			</div>
		</div>

	</body>
	<script type="text/javascript" src="scripts/details.js"></script>
</html>