<?php
	$header = "An error occurred :(";
	$text = "Your restaurant has been could not be added to the map. </br>Please try again later.";
	$link = "Return to <a class='confirmation__link' href='home.html'>home</a>.";

	if($_SERVER["REQUEST_METHOD"] == "GET"){
		if(!empty($_GET["restID"]) && $_GET["restID"] >= 0){
			$header = "Success!";
			$text = "Your restaurant has been successfully added to the map.";
			$link = "Click <a class='confirmation__link' href='details.php?restID=".$_GET["restID"]."'>here</a> to view your restaurant's menu!";
		}
	}

?><!DOCTYPE html>
<html>
	<head>
		<title>Confirmation | MenuMap</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="stylesheets/default.css">
		<link href="https://fonts.googleapis.com/css?family=Raleway|Roboto+Slab" rel="stylesheet">
	</head>
	<body>
		<div class="topnav row">
			<a class="topnav__link col-12" href="home.html">MenuMap</a>
		</div>
		<div class="body body--centered row">
			<span class="confirmation col-12">
				<h2 class="confirmation__header"><?php echo $header ?></h2>
				<span class="confirmation__text"><?php echo $text ?></span>
				<span class="confirmation__text"><?php echo $link ?></span>
			</span>
		</div>
	</body>
</html>