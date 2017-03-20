<?php
    require("config.php");
    
    $UserID = filter_input(INPUT_POST, 'UserID');
    $Active = filter_input(INPUT_POST, 'Active');
    $UserName= filter_input(INPUT_POST, 'UserName');
    $UserEmail = filter_input(INPUT_POST, 'UserEmail');
    
    $UserName = str_replace("'", "''", $UserName);
    $UserEmail = str_replace("'", "", $UserEmail);

    $query = "UPDATE [".$dbDatabase."].[dbo].[User] "
                . "SET Active = '".$Active."', UserName = '".$UserName."', UserEmail = '".$UserEmail."', Modified = getdate() "
                . "WHERE UserID = '".$UserID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);