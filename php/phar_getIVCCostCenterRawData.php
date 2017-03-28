<?php
    require("config_pharos.php");
    
    $StartDate = filter_input(INPUT_POST, 'StartDate');
    $EndDate = filter_input(INPUT_POST, 'EndDate');
    
    $dbConn->setAttribute(constant('PDO::SQLSRV_ATTR_DIRECT_QUERY'), true);
    
    $query_create_table = "CREATE TABLE #REPORTS (UserName nvarchar(255), CostCenterID nvarchar(255), CostCenter nvarchar(255), TotalPages int, ColorPages int, TotalCost money)";
    $query_drop_table = "DROP TABLE #REPORTS";
    
    $query_ivc_cost_center = "INSERT INTO #REPORTS SELECT "
                            . "usrs.id AS UserName, "
                            . "ccnt.name AS CostCenterID, "
                            . "ccnt.[description] AS CostCenter, "
                            . "trns.qty AS TotalPages, "
                            . "CASE WHEN trns.resource_id = 1 THEN prtn.num_color_pages ELSE cptn.num_color_pages END AS ColorPages, "
                            . "trns.amount AS TotalCost "
                            . "FROM [pharos].[dbo].[transactions] AS trns INNER JOIN [pharos].[dbo].[transaction_types] AS ttyp ON trns.ttype_id = ttyp.ttype_id "
                            . "LEFT JOIN [pharos].[dbo].[print_transactions] AS prtn ON trns.transaction_id = prtn.transaction_id "
                            . "LEFT JOIN [pharos].[dbo].[copy_transactions] AS cptn ON trns.transaction_id = cptn.transaction_id "
                            . "LEFT JOIN [pharos].[dbo].[cc_transactions] AS cctr ON trns.transaction_id = cctr.transaction_id "
                            . "LEFT JOIN [pharos].[dbo].[cost_centers] AS ccnt ON cctr.cost_center_id = ccnt.cost_center_id "
                            . "INNER JOIN [pharos].[dbo].[devices] AS devc ON trns.ref_id = devc.device_id "
                            . "INNER JOIN [pharos].[dbo].[print_group_members] AS prgm ON devc.device_id = prgm.printer_id "
                            . "INNER JOIN [pharos].[dbo].[print_groups] AS prgp ON prgm.print_group_id = prgp.print_group_id "
                            . "INNER JOIN [pharos].[dbo].[users] AS usrs ON trns.[user_id] = usrs.[user_id] "
                            . "INNER JOIN [pharos].[dbo].[groups] AS grup ON usrs.group_id = grup.group_id "
                            . "WHERE devc.[description] = 'IVC' AND prgp.print_group = 'IVCStaff' "
                            . "AND (ttyp.[type] = 'PR' OR ttyp.[type] = 'CP') "
                            . "AND (grup.group_id = -7 OR grup.group_id = -6 OR grup.group_id = -5) "
                            . "AND trns.amount <> 0.00 AND trns.charging_type = 1 "
                            . "AND trns.[time] BETWEEN '".$StartDate."' AND '".$EndDate."'";
    
    $query_get_result = "SELECT CostCenterID, CostCenter, UserName, "
                        . "SUM(TotalPages) - SUM(ColorPages) AS BWPages, "
                        . "SUM(ColorPages) AS ColorPages, "
                        . "SUM(TotalPages) AS TotalPages, "
                        . "'$' + convert(varchar, SUM(TotalCost)*-1, 1) AS TotalCost "
                        . "FROM #REPORTS "
                        . "GROUP BY CostCenterID, CostCenter, UserName "
                        . "ORDER BY CostCenter, UserName ASC";
    
    $dbConn->query($query_create_table);
    $dbConn->query($query_ivc_cost_center);

    $cmd = $dbConn->prepare($query_get_result);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    $dbConn->query($query_drop_table);

    echo json_encode($data);