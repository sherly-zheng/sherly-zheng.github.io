<?php
	$serverName = "149.4.211.180";
	$serverUser = "zhsh6528";
	$serverPsw = "14226528";

	if($_SERVER["REQUEST_METHOD"] == "POST"){
		$addX = $_POST["addX"];
		$addY = $_POST["addY"];
		
		try {
			$conn = new PDO("mysql:host=$serverName; dbname=$serverUser", $serverUser, $serverPsw);
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

			$q = "SELECT COUNT(*) FROM ".$serverUser.".Restaurant WHERE AddressX = ".$addX." AND AddressY = ".$addY;
			echo $conn->query($q)->fetchColumn();
			$conn = null;
		}
		catch(PDOException $e){
			echo -1;
		}
	}
?>