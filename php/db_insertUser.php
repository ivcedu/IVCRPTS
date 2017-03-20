<?php
    require("config.php");
    
    $Active = filter_input(INPUT_POST, 'Active');
    $UserName = filter_input(INPUT_POST, 'UserName');
    $UserEmail = filter_input(INPUT_POST, 'UserEmail');
    
    $UserName = str_replace("'", "''", $UserName);
    $UserEmail = str_replace("'", "", $UserEmail);
    
    $query = "INSERT INTO [".$dbDatabase."].[dbo].[User] (Active, UserName, UserEmail) "
                ."VALUES ('$Active', '$UserName', '$UserEmail')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);