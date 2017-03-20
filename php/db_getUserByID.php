<?php
    require("config.php");
    
    $UserID = filter_input(INPUT_POST, 'UserID');

    $query = "SELECT TOP(1) * FROM [".$dbDatabase."].[dbo].[User] WHERE UserID = '".$UserID."'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);