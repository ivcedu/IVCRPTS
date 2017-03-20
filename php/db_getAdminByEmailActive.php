<?php
    require("config.php");
    
    $AdminEmail = filter_input(INPUT_POST, 'AdminEmail');
    
    $AdminEmail = str_replace("'", "", $AdminEmail);

    $query = "SELECT TOP(1) * FROM [".$dbDatabase."].[dbo].[Admin] WHERE AdminEmail = '".$AdminEmail."' AND Active = 1";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);