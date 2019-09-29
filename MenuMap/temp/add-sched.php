<?php
	$serverName = "149.4.211.180";
	$serverUser = "zhsh6528";
	$serverPsw = "14226528";

	if($_SERVER["REQUEST_METHOD"] == "POST"){
		$restid = $_POST["restid"];
		$schedules = json_decode($_POST["schedules"]);
		
		try {
			$conn = new PDO("mysql:host=$serverName; dbname=$serverUser", $serverUser, $serverPsw);
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

			$schedulestmt = $conn->prepare("INSERT INTO ".$serverUser.".Schedule (RestaurantID, Day, OpenTime, CloseTime, Open24Hrs, Closed) VALUES (:restid, :day, :opentime, :closetime, :open24, :closed);");
			$schedulestmt->bindParam(":restid", $restid);
			$schedulestmt->bindParam(":day", $day);
			$schedulestmt->bindParam(":opentime", $opentime);
			$schedulestmt->bindParam(":closetime", $closetime);
			$schedulestmt->bindParam(":open24", $open24);
			$schedulestmt->bindParam(":closed", $closed);

			$conn->beginTransaction();
			foreach($schedules as $day => $hours){
				$opentime = $hours->opentime ?: null;
				$closetime = $hours->closetime ?: null;
				$open24 = $hours->open24 ?: 0;
				$closed = $hours->closed ?: 0;
				$schedulestmt->execute();
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