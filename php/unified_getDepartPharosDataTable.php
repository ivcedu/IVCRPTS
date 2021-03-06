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
    
    // Data Source: Pharos System -----------------------------------------------------------------------------------------------------------------------------------------------
    $query_create_pharos_table = "CREATE TABLE #PHAROS (CostCenter nvarchar(255), "
                                                        . "UserID nvarchar(255), "
                                                        . "TotalPages int, "
                                                        . "MonoPages int, "
                                                        . "ColorPages int, "
                                                        . "TotalCost money)";
    
    $query_drop_pharos_table = "DROP TABLE #PHAROS";
    
    $query_pharos_insert_table = "INSERT INTO #PHAROS SELECT "
                                . "ccnt.name, "
                                . "usrs.id AS UserID, "
                                . "trns.qty, "
                                . "trns.qty - (CASE WHEN trns.resource_id = 1 THEN prtn.num_color_pages ELSE cptn.num_color_pages END), "
                                . "CASE WHEN trns.resource_id = 1 THEN prtn.num_color_pages ELSE cptn.num_color_pages END, "
                                . "trns.amount * -1 "
                                . "FROM [IINTDB2].[pharos].[dbo].[transactions] AS trns INNER JOIN [IINTDB2].[pharos].[dbo].[transaction_types] AS ttyp ON trns.ttype_id = ttyp.ttype_id "
                                . "LEFT JOIN [IINTDB2].[pharos].[dbo].[print_transactions] AS prtn ON trns.transaction_id = prtn.transaction_id "
                                . "LEFT JOIN [IINTDB2].[pharos].[dbo].[copy_transactions] AS cptn ON trns.transaction_id = cptn.transaction_id "
                                . "LEFT JOIN [IINTDB2].[pharos].[dbo].[cc_transactions] AS cctr ON trns.transaction_id = cctr.transaction_id "
                                . "LEFT JOIN [IINTDB2].[pharos].[dbo].[cost_centers] AS ccnt ON cctr.cost_center_id = ccnt.cost_center_id "
                                . "INNER JOIN [IINTDB2].[pharos].[dbo].[devices] AS devc ON trns.ref_id = devc.device_id "
                                . "INNER JOIN [IINTDB2].[pharos].[dbo].[print_group_members] AS prgm ON devc.device_id = prgm.printer_id "
                                . "INNER JOIN [IINTDB2].[pharos].[dbo].[print_groups] AS prgp ON prgm.print_group_id = prgp.print_group_id "
                                . "INNER JOIN [IINTDB2].[pharos].[dbo].[users] AS usrs ON trns.[user_id] = usrs.[user_id] "
                                . "INNER JOIN [IINTDB2].[pharos].[dbo].[groups] AS grup ON usrs.group_id = grup.group_id "
                                . "WHERE devc.[description] = 'IVC' "
                                . "AND prgp.print_group = 'IVCStaff' "
                                . "AND (ttyp.[type] = 'PR' OR ttyp.[type] = 'CP') "
                                . "AND (grup.group_id = -7 OR grup.group_id = -6 OR grup.group_id = -5) "
                                . "AND ccnt.cost_center_id <> 1 "
                                . "AND trns.charging_type = 1 "
                                . "AND trns.[time] BETWEEN '".$StartDate."' AND '".$EndDate."'";
    
    $query_pharos_data_table = "INSERT INTO #DATA_TABLE SELECT "
                                . "CostCenter, "
                                . "UserID, "
                                . "TotalPages, "
                                . "MonoPages, "
                                . "ColorPages, "
                                . "TotalCost "
                                . "FROM #PHAROS";
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
    
    // execute Pharos System data source
    $dbConn->query($query_create_pharos_table);
    $dbConn->query($query_pharos_insert_table);
    $dbConn->query($query_pharos_data_table);
    $dbConn->query($query_drop_pharos_table);

    // get mail data source
    $cmd = $dbConn->prepare($query_get_result);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    // delete main data source table
    $dbConn->query($query_drop_data_table);

    echo json_encode($data);