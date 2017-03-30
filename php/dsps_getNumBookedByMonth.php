<?php
    require("config_dsps.php");
    
    $StartDate = filter_input(INPUT_POST, 'StartDate');
    $EndDate = filter_input(INPUT_POST, 'EndDate');
    
    $dbConn->setAttribute(constant('PDO::SQLSRV_ATTR_DIRECT_QUERY'), true);
    
    $query_create_table = "CREATE TABLE #REPORTS (TestDate nvarchar(255), "
                            . "RptStatus nvarchar(255), "
                            . "RptStep nvarchar(255), "
                            . "NumMonth int, "
                            . "RptMonth nvarchar(255), "
                            . "RptYear int, "
                            . "NumWeekday int, "
                            . "RptWeekday nvarchar(255))";
    
    $query_drop_table = "DROP TABLE #REPORTS";
    
    $query_dsps_by_month = "INSERT INTO #REPORTS SELECT "
                            . "prct.TestDate, "
                            . "stus.Status AS rpt_status, "
                            . "step.Step AS rpt_step, "
                            . "MONTH(CONVERT(DATETIME, prct.TestDate, 101)) AS num_month, "
                            . "LEFT(DATENAME(month, CONVERT(DATETIME, prct.TestDate, 101)), 3) AS rpt_month, "
                            . "YEAR(CONVERT(DATETIME, prct.TestDate, 101)) AS rpt_year, "
                            . "DATEPART(dw, CONVERT(DATETIME, prct.TestDate, 101)) AS num_weekday, "
                            . "DATENAME(dw, CONVERT(DATETIME, prct.TestDate, 101)) AS rpt_weekday "
                            . "FROM [IVCDSPS].[dbo].[Proctor] AS prct INNER JOIN [IVCDSPS].[dbo].[Status] AS stus ON prct.StatusID = stus.StatusID "
                            . "INNER JOIN [IVCDSPS].[dbo].[Step] AS step ON prct.StepID = step.StepID "
                            . "WHERE prct.StatusID <> 1 AND prct.StatusID <> 2 "
                            . "AND CONVERT(DATETIME, prct.TestDate, 101) BETWEEN '".$StartDate."' AND '".$EndDate."'";
    
    $query_get_result = "SELECT RptMonth, RptYear, COUNT(*) AS NumBooked "
                        . "FROM #REPORTS "
                        . "WHERE RptStatus = 'Completed' "
                        . "GROUP BY NumMonth, RptMonth, RptYear "
                        . "ORDER BY RptYear, NumMonth ASC";
    
    $dbConn->query($query_create_table);
    $dbConn->query($query_dsps_by_month);

    $cmd = $dbConn->prepare($query_get_result);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    $dbConn->query($query_drop_table);

    echo json_encode($data);