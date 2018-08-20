<?php
    require("config_ireport.php");
    
    $query = "SELECT Code, CostCenter FROM [IREPORT].[dbo].[WorkdayCostCenter]";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);