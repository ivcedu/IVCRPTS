<?php
    require("config_ireport.php");
    
    $query = "SELECT TOP(1) PrintDate FROM [IREPORT].[dbo].[IVCBeaconUserData] GROUP BY PrintDate ORDER BY PrintDate DESC";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);