<?php
    require("config.php");
    
    $UserID = filter_input(INPUT_POST, 'UserID');
    
    $query = "DELETE [".$dbDatabase."].[dbo].[User] WHERE UserID = '".$UserID."'";
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute();           

    echo json_encode($result);