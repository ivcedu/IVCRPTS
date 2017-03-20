<?php
    require("config.php");
    
    $AdminID = filter_input(INPUT_POST, 'AdminID');

    $query = "SELECT TOP(1) * FROM [".$dbDatabase."].[dbo].[Admin] WHERE AdminID = '".$AdminID."'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);