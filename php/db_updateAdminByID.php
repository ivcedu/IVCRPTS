<?php
    require("config.php");
    
    $AdminID = filter_input(INPUT_POST, 'AdminID');
    $Active = filter_input(INPUT_POST, 'Active');
    $AdminName = filter_input(INPUT_POST, 'AdminName');
    $AdminEmail = filter_input(INPUT_POST, 'AdminEmail');
    
    $AdminName = str_replace("'", "''", $AdminName);
    $AdminEmail = str_replace("'", "", $AdminEmail);

    $query = "UPDATE [".$dbDatabase."].[dbo].[Admin] "
                ."SET Active = '".$Active."', AdminName = '".$AdminName."', AdminEmail = '".$AdminEmail."', Modified = getdate() "
                ."WHERE AdminID = '".$AdminID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);