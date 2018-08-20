<?php
    require("config_ireport.php");
    
    $StartDate = filter_input(INPUT_POST, 'StartDate');
    $EndDate = filter_input(INPUT_POST, 'EndDate');
    $Param = filter_input(INPUT_POST, 'Param');
    $Value = filter_input(INPUT_POST, 'Value');
    
    $dbConn->setAttribute(constant('PDO::SQLSRV_ATTR_DIRECT_QUERY'), true);
    
    $query_create_data_table = "CREATE TABLE #DATA_TABLE (CostCenter nvarchar(255), "
                                                        . "LoginID nvarchar(255), "
                                                        . "TotalPages int, "
                                                        . "MonoPages int, "
                                                        . "ColorPages int, "
                                                        . "TotalCost money)";
    
    $query_drop_data_table = "DROP TABLE #DATA_TABLE";
    
    // Data Source: Beacon System -----------------------------------------------------------------------------------------------------------------------------------------------
    $query_beacon_ivc = "INSERT INTO #DATA_TABLE SELECT "
                        . "CostCenter,"
                        . "UserID, "
                        . "TotalPages, "
                        . "MonoPages, "
                        . "ColorPages, "
                        . "TotalCost "
                        . "FROM [IREPORT].[dbo].[IVCBeaconUserData] "
                        . "WHERE PrintDate BETWEEN '".$StartDate."' AND '".$EndDate."'";
    
    $query_beacon_saddleback = "INSERT INTO #DATA_TABLE SELECT "
                        . "CostCenter, "
                        . "UserID, "
                        . "TotalPages, "
                        . "MonoPages, "
                        . "ColorPages, "
                        . "TotalCost "
                        . "FROM [IREPORT].[dbo].[SBCBeaconUserData] "
                        . "WHERE PrintDate BETWEEN '".$StartDate."' AND '".$EndDate."'";
    
    $query_beacon_socccd = "INSERT INTO #DATA_TABLE SELECT "
                        . "CostCenter, "
                        . "UserID, "
                        . "TotalPages, "
                        . "MonoPages, "
                        . "ColorPages, "
                        . "TotalCost "
                        . "FROM [IREPORT].[dbo].[DSTBeaconUserData] "
                        . "WHERE PrintDate BETWEEN '".$StartDate."' AND '".$EndDate."'";
    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    // execute main data source query
    if ($Param === "Department_Section") {
        $query_get_result = "SELECT "
                            . "'<a href=# id=''cost_center_' + dttb.CostCenter + '''><i class=''iconic iconic-sm iconic-caret-right iconic-color-default'' style=''color: grey;''></i></a>', "
                            . "dttb.CostCenter AS Code, "
                            . "wdcc.CostCenter AS CostCenter, "
                            . "SUM(dttb.TotalPages) AS TotalPages, "
                            . "SUM(dttb.MonoPages) AS MonoPages, "
                            . "SUM(dttb.ColorPages) AS ColorPages, "
                            . "'$' + REPLACE(CONVERT(varchar, SUM(dttb.TotalCost), 1), '-', '') AS TotalCost "
                            . "FROM #DATA_TABLE AS dttb INNER JOIN [IREPORT].[dbo].[WorkdayCostCenter] AS wdcc ON dttb.CostCenter = wdcc.Code "
                            . "GROUP BY dttb.CostCenter, wdcc.CostCenter";
    }
    else if ($Param === "User_Section") {
        $query_get_result = "SELECT "
                            . "'<a href=# id=''user_id_' + dttb.LoginID + '''><i class=''iconic iconic-sm iconic-caret-right iconic-color-default'' style=''color: grey;''></i></a>', "
                            . "dttb.LoginID AS LoginID, "
                            . "SUM(dttb.TotalPages) AS TotalPages, "
                            . "SUM(dttb.MonoPages) AS MonoPages, "
                            . "SUM(dttb.ColorPages) AS ColorPages, "
                            . "'$' + REPLACE(CONVERT(varchar, SUM(dttb.TotalCost), 1), '-', '') AS TotalCost "
                            . "FROM #DATA_TABLE AS dttb INNER JOIN [IREPORT].[dbo].[WorkdayCostCenter] AS wdcc ON dttb.CostCenter = wdcc.Code "
                            . "GROUP BY dttb.LoginID";
    }
    else if ($Param === "CostCenter") {
        $query_get_result = "SELECT "
                            . "dttb.LoginID AS LoginID, "
                            . "SUM(dttb.TotalPages) AS TotalPages, "
                            . "SUM(dttb.MonoPages) AS MonoPages, "
                            . "SUM(dttb.ColorPages) AS ColorPages, "
                            . "'$' + REPLACE(CONVERT(varchar, SUM(dttb.TotalCost), 1), '-', '') AS TotalCost "
                            . "FROM #DATA_TABLE AS dttb INNER JOIN [IREPORT].[dbo].[WorkdayCostCenter] AS wdcc ON dttb.CostCenter = wdcc.Code "
                            . "WHERE dttb.CostCenter = '".$Value."' "
                            . "GROUP BY dttb.LoginID "
                            . "ORDER BY SUM(dttb.TotalPages) DESC";
    }
    else if ($Param === "UserID") {
        $query_get_result = "SELECT "
                            . "dttb.CostCenter AS Code, "
                            . "wdcc.CostCenter AS CostCenter, "
                            . "SUM(dttb.TotalPages) AS TotalPages, "
                            . "SUM(dttb.MonoPages) AS MonoPages, "
                            . "SUM(dttb.ColorPages) AS ColorPages, "
                            . "'$' + REPLACE(CONVERT(varchar, SUM(dttb.TotalCost), 1), '-', '') AS TotalCost "
                            . "FROM #DATA_TABLE AS dttb INNER JOIN [IREPORT].[dbo].[WorkdayCostCenter] AS wdcc ON dttb.CostCenter = wdcc.Code "
                            . "WHERE dttb.LoginID = '".$Value."' "
                            . "GROUP BY dttb.CostCenter, wdcc.CostCenter "
                            . "ORDER BY SUM(dttb.TotalPages) DESC";
    }
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create main data source table
    $dbConn->query($query_create_data_table);
    
    // execute Beacon System data source
    $dbConn->query($query_beacon_ivc);
    $dbConn->query($query_beacon_saddleback);
    $dbConn->query($query_beacon_socccd);

    // get mail data source
    $cmd = $dbConn->prepare($query_get_result);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    // delete main data source table
    $dbConn->query($query_drop_data_table);

    echo json_encode($data);