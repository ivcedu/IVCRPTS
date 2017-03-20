<?php
    require("config.php");

    $query = "SELECT AdminName, CASE WHEN Active = 1 THEN 'Yes' ELSE 'No' END AS Active, AdminEmail, "
            . "'<a href=# id=''admin_id_' + CONVERT(NVARCHAR(255), AdminID) + '''><i class=''iconic iconic-sm iconic-lock-unlocked iconic-color-default'' style=''color: grey;''></i></a>' "
            . "FROM [".$dbDatabase."].[dbo].[Admin] ORDER BY AdminName ASC";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);