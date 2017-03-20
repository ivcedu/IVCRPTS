<?php
    require("config.php");

    $query = "SELECT UserName, CASE WHEN Active = 1 THEN 'Yes' ELSE 'No' END AS Active, UserEmail, "
            . "'<a href=# id=''user_id_' + CONVERT(NVARCHAR(255), UserID) + '''><i class=''iconic iconic-sm iconic-lock-unlocked iconic-color-default'' style=''color: grey;''></i></a>' "
            . "FROM [".$dbDatabase."].[dbo].[User] ORDER BY UserName ASC";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);