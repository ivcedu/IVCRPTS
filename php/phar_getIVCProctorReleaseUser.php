<?php
    require("config_pharos.php");
    
    $StartDate = filter_input(INPUT_POST, 'StartDate');
    $EndDate = filter_input(INPUT_POST, 'EndDate');
    
    $dbConn->setAttribute(constant('PDO::SQLSRV_ATTR_DIRECT_QUERY'), true);
    
    $query_create_table = "CREATE TABLE #REPORTS (ProctorID nvarchar(255), Pages int, Cost money, Device nvarchar(255))";
    $query_drop_table = "DROP TABLE #REPORTS";
    
    $query_ivc_proctor_1 = "INSERT INTO #REPORTS SELECT "
                            . "SUBSTRING([message], 2, CHARINDEX(' ', [message])-3) AS proctor, "
                            . "SUBSTRING([message], CHARINDEX('printed', [message])+8, CHARINDEX('page job', [message]) - (CHARINDEX('printed', [message])+8)) AS pages, "
                            . "SUBSTRING([message], CHARINDEX(', costing', [message])+10, CHARINDEX(', on', [message]) - (CHARINDEX(', costing', [message])+10)) AS cost, "
                            . "SUBSTRING([message], CHARINDEX(', on', [message])+6, CHARINDEX(', and charged it to', [message]) - (CHARINDEX(', on', [message])+7)) AS printer "
                            . "FROM [pharos].[dbo].[alerts] "
                            . "WHERE error_code = 29505 "
                            . "AND [message] LIKE '%printed%' "
                            . "AND [message] LIKE '%page job%' "
                            . "AND [message] LIKE '%belonging to%' "
                            . "AND [message] LIKE '%, costing%' "
                            . "AND [message] LIKE '%, on%' "
                            . "AND [message] LIKE '%, and charged it to%' "
                            . "AND [time] BETWEEN '".$StartDate."' AND '".$EndDate."'";
    
    $query_ivc_proctor_2 = "INSERT INTO #REPORTS SELECT "
                            . "SUBSTRING([message], 2, CHARINDEX(' ', [message])-3) AS proctor, "
                            . "SUBSTRING([message], CHARINDEX('printed', [message])+8, CHARINDEX('page job', [message]) - (CHARINDEX('printed', [message])+8)) AS pages, "
                            . "SUBSTRING([message], CHARINDEX(', costing', [message])+10, CHARINDEX(', on', [message]) - (CHARINDEX(', costing', [message])+10)) AS cost, "
                            . "SUBSTRING([message], CHARINDEX(', on', [message])+6, CHARINDEX(', without charging', [message]) - (CHARINDEX(', on', [message])+7)) AS printer "
                            . "FROM [pharos].[dbo].[alerts] "
                            . "WHERE error_code = 29505 "
                            . "AND [message] LIKE '%printed%' "
                            . "AND [message] LIKE '%page job%' "
                            . "AND [message] LIKE '%belonging to%' "
                            . "AND [message] LIKE '%, costing%' "
                            . "AND [message] LIKE '%, on%' "
                            . "AND [message] LIKE '%, without charging%' "
                            . "AND [time] BETWEEN '".$StartDate."' AND '".$EndDate."'";
    
    $query_get_result = "SELECT rept.ProctorID, role.name AS RoleName, SUM(rept.Pages) AS TotalPages, '$' + convert(varchar, SUM(rept.Cost), 1) AS TotalCost "
                        . "FROM #REPORTS AS rept INNER JOIN [pharos].[dbo].[devices] AS devc ON rept.Device = devc.device "
                        . "INNER JOIN [pharos].[dbo].[print_group_members] AS prgm ON devc.device_id = prgm.printer_id "
                        . "INNER JOIN [pharos].[dbo].[print_groups] AS prgp ON prgm.print_group_id = prgp.print_group_id "
                        . "INNER JOIN [pharos].[dbo].[users] AS usrs ON rept.ProctorID = usrs.id "
                        . "INNER JOIN [pharos].[dbo].[role] AS role ON usrs.role_id = role.role_id "
                        . "WHERE devc.[description] = 'IVC' AND prgp.print_group = 'IVC' "
                        . "GROUP BY rept.ProctorID, role.name "
                        . "ORDER BY SUM(rept.Pages) DESC";
    
    $dbConn->query($query_create_table);
    $dbConn->query($query_ivc_proctor_1);
    $dbConn->query($query_ivc_proctor_2);

    $cmd = $dbConn->prepare($query_get_result);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    $dbConn->query($query_drop_table);

    echo json_encode($data);