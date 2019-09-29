<?php
	$serverName = "149.4.211.180";
	$serverUser = "zhsh6528";
	$serverPsw = "14226528";
	$items = "";
	$searchX = $searchY = 0;

	if($_SERVER["REQUEST_METHOD"] == "GET"){
		if(!empty($_GET["searchX"])){
			$searchX = $_GET["searchX"];
		}
		if(!empty($_GET["searchY"])){
			$searchY = $_GET["searchY"];
		}

		try {
			$conn = new PDO("mysql:host=$serverName; dbname=$serverUser", $serverUser, $serverPsw);
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

			$q = "SELECT RestaurantID, Name, AddressX, AddressY, Delivery, Takeout, Reservations, CreditCards
				FROM ".$serverUser.".Restaurant
				ORDER BY SQRT(POWER((AddressX - ".$searchX."),2) + POWER((AddressY - ".$searchY."),2)) asc, Name;";
			$result = $conn->query($q);
			if($result){
				foreach($result as $row){
					$restID = $row["RestaurantID"];
					$restName = urldecode($row["Name"]); 
					$addX = $row["AddressX"];
					$addY = $row["AddressY"];
					$delivery = $row["Delivery"];
					$takeout = $row["Takeout"];
					$reservations = $row["Reservations"];
					$creditcards = $row["CreditCards"];

					$items .= 
					'<li class="results__item">
						<div class="results__details">
							<a class="results__name" href="details.php?restID='.$restID.'">'.$restName.'</a>
							<div class="results__address">('.$addX.', '.$addY.')</div>
							<input type="hidden" class="addX" value="'.$addX.'">
							<input type="hidden" class="addY" value="'.$addY.'">
							<input type="hidden" class="delivery" value="'.$delivery.'">
							<input type="hidden" class="takeout" value="'.$takeout.'">
							<input type="hidden" class="reservations" value="'.$reservations.'">
							<input type="hidden" class="creditcards" value="'.$creditcards.'">
						</div>
					</li>';
				}
			}
			$conn = null;
		}
		catch(PDOException $e){
			echo $e;
		}
	}
?>
<!DOCTYPE html>
<html>
	<head>
		<title>MenuMap</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="stylesheets/default.css">
		<link href="https://fonts.googleapis.com/css?family=Raleway|Roboto+Slab" rel="stylesheet">
		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/solid.css" integrity="sha384-QokYePQSOwpBDuhlHOsX0ymF6R/vLk/UQVz3WHa6wygxI5oGTmDTv8wahFOSspdm" crossorigin="anonymous">
    	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/fontawesome.css" integrity="sha384-vd1e11sR28tEK9YANUtpIOdjGW14pS87bUBuOIoBILVWLFnS+MCX9T6MMf0VdPGq" crossorigin="anonymous">
    	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	</head>
	<body>
		<div class="topnav topnav--fixed row">
			<a class="topnav__link col-12" href="home.html">MenuMap</a>
		</div>
		<div class="body body--fixed row">
			<div class="map col-6">
				<object class="map__object" id="mapobject" data="svg/mapobject.svg" width="500" height="500"></object>
			</div>
			<div class="results col-6">
				<div class="results__filter filter">
					<form class="filter__searchbar searchbar" action="list.php" name="search" method="GET">
						<h4 class="searchbar__heading searchbar__heading--inline">Showing restaurants near: </h4>
						<span class="searchbar__container searchbar__container--sm">(
							<input class="searchbar__coord searchbar__coord--sm" type="number" name="searchX" id="searchX" class="filter__coord" placeholder="X" value="<?php echo $searchX ?>" min=0 max=100 required>,
							<input class="searchbar__coord searchbar__coord--sm" type="number" name="searchY" id="searchY" class="filter__coord" placeholder="Y" value="<?php echo $searchY ?>" min=0 max=100 required>
							)
						</span>
						<button class="searchbar__submit searchbar__submit--sm"type="submit" > 
							<i class="fas fa-search"></i>
						</button>
					</form>
					<button type="button" class="filter__morefiltersbtn" id="morefiltersbtn">Filters <i class="arrow fas fa-angle-up"></i></button>
					<div class="filter__more">
						<span class="filter__container">
							<input type="checkbox" name="delivery" id="deliveryfilter"><label for="deliveryfilter">Offers Delivery</label>
						</span>
						<span class="filter__container">
							<input type="checkbox" name="takeout" id="takeoutfilter"><label for="takeoutfilter">Offers Take Out</label>
						</span>
						<span class="filter__container">
							<input type="checkbox" name="reservations" id="reservationsfilter"><label for="reservationsfilter">Accepts Reservations</label>
						</span>
						<span class="filter__container">
							<input type="checkbox" name="cards" id="cardsfilter"><label for="cardsfilter">Accepts Credit Cards</label>
						</span>
						
						<button type="button" class="filter__btn filter__btn--attn" id="applyfiltersbtn">Apply</button>
						<button type="reset" class="filter__btn filter__btn--not-attn" id="resetfiltersbtn">Reset</button>
					</div>
				</div>
				<div class="results__container">
					<ol class="results__list">
						<?php echo $items ?>
					</ol>	
				</div>
				<form class="results__newrest" method="get" action="newrest.html">
					<button type="submit" class="results__newrestbtn">Don't see your restaurant?<span class="block">Add it to our map!</span></button>
				</form>
			</div>
			
		</div>

	</body>
	<script type="text/javascript" src="scripts/list.js"></script>
</html>