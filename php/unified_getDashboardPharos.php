<?php
    require("config_ireport.php");
    
    $StartDate = filter_input(INPUT_POST, 'StartDate');
    $EndDate = filter_input(INPUT_POST, 'EndDate');
    
    $dbConn->setAttribute(constant('PDO::SQLSRV_ATTR_DIRECT_QUERY'), true);
    
    $query_create_data_table = "CREATE TABLE #DATA_TABLE (DataSource nvarchar(255), "
                                                        . "NumMonth int, "
                                                        . "RptMonth nvarchar(255), "
                                                        . "RptYear int, "
                                                        . "TotalPages int, "
                                                        . "MonoPages int, "
                                                        . "ColorPages int, "
                                                        . "TotalCost money)";
    
    $query_drop_data_table = "DROP TABLE #DATA_TABLE";
    
    // Data Source: Pharos System -----------------------------------------------------------------------------------------------------------------------------------------------
    $query_create_pharos_table = "CREATE TABLE #PHAROS (UserID nvarchar(255), "
                                                        . "CostCenter nvarchar(255), "
                                                        . "PrintDate datetime, "
                                                        . "TotalPages int, "
                                                        . "MonoPages int, "
                                                        . "ColorPages int, "
                                                        . "TotalCost money)";
    
    $query_drop_pharos_table = "DROP TABLE #PHAROS";
    
    $query_pharos_insert_table = "INSERT INTO #PHAROS SELECT "
                                . "usrs.id, "
                                . "ccnt.name, "
                                . "trns.[time], "
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
                                . "'Pharos', "
                                . "MONTH(CONVERT(DATETIME, PrintDate, 101)), "
                                . "LEFT(DATENAME(month, CONVERT(DATETIME, PrintDate, 101)), 3), "
                                . "YEAR(CONVERT(DATETIME, PrintDate, 101)), "
                                . "TotalPages, "
                                . "MonoPages, "
                                . "ColorPages, "
                                . "TotalCost "
                                . "FROM #PHAROS";
    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    // execute main data source query
    $query_get_result = "SELECT "
                        . "dttb.DataSource, "
                        . "dttb.RptYear, "
                        . "dttb.RptMonth, "
                        . "SUM(dttb.TotalPages) AS TotalPages, "
                        . "SUM(dttb.MonoPages) AS MonoPages, "
                        . "SUM(dttb.ColorPages) AS ColorPages, "
                        . "SUM(dttb.TotalCost) AS TotalCost "
                        . "FROM	#DATA_TABLE AS dttb "
                        . "GROUP BY dttb.RptYear, dttb.NumMonth, dttb.RptMonth, dttb.DataSource "
                        . "ORDER BY dttb.RptYear, dttb.NumMonth, dttb.DataSource";
    
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