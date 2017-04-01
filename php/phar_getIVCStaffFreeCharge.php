<?php
    require("config_pharos.php");
    
    $StartDate = filter_input(INPUT_POST, 'StartDate');
    $EndDate = filter_input(INPUT_POST, 'EndDate');
    $College = filter_input(INPUT_POST, 'College');
    
    $dbConn->setAttribute(constant('PDO::SQLSRV_ATTR_DIRECT_QUERY'), true);
    
    $query_create_table = "CREATE TABLE #REPORTS (NumMonth int, RptMonth nvarchar(255), RptYear nvarchar(255), TotalPages int)";
    $query_drop_table = "DROP TABLE #REPORTS";
    
    $query_ivc_staff = "INSERT INTO #REPORTS SELECT "
                        . "MONTH(trns.[time]) AS num_month, "
                        . "LEFT(DATENAME(month, trns.[time]), 3) AS rpt_month, "
                        . "YEAR(trns.[time]) AS rpt_year, "
                        . "trns.qty AS TotalPages "
                        . "FROM [pharos].[dbo].[transactions] AS trns INNER JOIN [pharos].[dbo].[transaction_types] AS ttyp ON trns.ttype_id = ttyp.ttype_id "
                        . "LEFT JOIN [pharos].[dbo].[print_transactions] AS prtn ON trns.transaction_id = prtn.transaction_id "
                        . "LEFT JOIN [pharos].[dbo].[copy_transactions] AS cptn ON trns.transaction_id = cptn.transaction_id "
                        . "INNER JOIN [pharos].[dbo].[devices] AS devc ON trns.ref_id = devc.device_id "
                        . "INNER JOIN [pharos].[dbo].[print_group_members] AS prgm ON devc.device_id = prgm.printer_id "
                        . "INNER JOIN [pharos].[dbo].[print_groups] AS prgp ON prgm.print_group_id = prgp.print_group_id "
                        . "INNER JOIN [pharos].[dbo].[users] AS usrs ON trns.[user_id] = usrs.[user_id] "
                        . "INNER JOIN [pharos].[dbo].[groups] AS grup ON usrs.group_id = grup.group_id "
                        . "WHERE devc.[description] = 'IVC' AND prgp.print_group = 'IVCStaff' "
                        . "AND (ttyp.[type] = 'PR' OR ttyp.[type] = 'CP') "
                        . "AND (grup.group_id = -7 OR grup.group_id = -6 OR grup.group_id = -5) "
                        . "AND trns.amount = 0.00 AND trns.qty <> 0 "
                        . "AND trns.[time] BETWEEN '".$StartDate."' AND '".$EndDate."'";
    
    $query_sc_staff = "INSERT INTO #REPORTS SELECT "
                        . "MONTH(trns.[time]) AS num_month, "
                        . "LEFT(DATENAME(month, trns.[time]), 3) AS rpt_month, "
                        . "YEAR(trns.[time]) AS rpt_year, "
                        . "trns.qty AS TotalPages "
                        . "FROM [pharos].[dbo].[transactions] AS trns INNER JOIN [pharos].[dbo].[transaction_types] AS ttyp ON trns.ttype_id = ttyp.ttype_id "
                        . "LEFT JOIN [pharos].[dbo].[print_transactions] AS prtn ON trns.transaction_id = prtn.transaction_id "
                        . "LEFT JOIN [pharos].[dbo].[copy_transactions] AS cptn ON trns.transaction_id = cptn.transaction_id "
                        . "INNER JOIN [pharos].[dbo].[devices] AS devc ON trns.ref_id = devc.device_id "
                        . "INNER JOIN [pharos].[dbo].[print_group_members] AS prgm ON devc.device_id = prgm.printer_id "
                        . "INNER JOIN [pharos].[dbo].[print_groups] AS prgp ON prgm.print_group_id = prgp.print_group_id "
                        . "INNER JOIN [pharos].[dbo].[users] AS usrs ON trns.[user_id] = usrs.[user_id] "
                        . "INNER JOIN [pharos].[dbo].[groups] AS grup ON usrs.group_id = grup.group_id "
                        . "WHERE devc.[description] = 'SC' "
                        . "AND (ttyp.[type] = 'PR' OR ttyp.[type] = 'CP') "
                        . "AND (grup.group_id = -7 OR grup.group_id = -6 OR grup.group_id = -5) "
                        . "AND trns.amount = 0.00 AND trns.qty <> 0 "
                        . "AND trns.[time] BETWEEN '".$StartDate."' AND '".$EndDate."'";
    
    $query_get_result = "SELECT RptMonth, RptYear, SUM(TotalPages) AS TotalPages "
                        . "FROM #REPORTS "
                        . "GROUP BY NumMonth, RptMonth, RptYear "
                        . "ORDER BY RptYear, NumMonth ASC";
    
    $dbConn->query($query_create_table);
    
    if ($College === "All") {
        $dbConn->query($query_ivc_staff);
        $dbConn->query($query_sc_staff);
    }
    else if ($College === "IVC") {
        $dbConn->query($query_ivc_staff);
    }
    else if ($College === "Saddleback") {
        $dbConn->query($query_sc_staff);
    }

    $cmd = $dbConn->prepare($query_get_result);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    $dbConn->query($query_drop_table);

    echo json_encode($data);