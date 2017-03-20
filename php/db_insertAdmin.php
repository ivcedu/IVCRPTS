<?php
    require("config.php");
    
    $Active = filter_input(INPUT_POST, 'Active');
    $AdminName = filter_input(INPUT_POST, 'AdminName');
    $AdminEmail = filter_input(INPUT_POST, 'AdminEmail');
    
    $AdminName = str_replace("'", "''", $AdminName);
    $AdminEmail = str_replace("'", "", $AdminEmail);
    
    $query = "INSERT INTO [".$dbDatabase."].[dbo].[Admin] (Active, AdminName, AdminEmail) "
                ."VALUES ('$Active', '$AdminName', '$AdminEmail')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);