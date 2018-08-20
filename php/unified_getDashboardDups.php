<?php
    require("config_dups.php");
    
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
    
    // Data Source: IVC Duplicating Center --------------------------------------------------------------------------------------------------------------------------------------
    // dupliating
    $query_dup_duplicating = "INSERT INTO #DATA_TABLE SELECT "
                            . "'Duplicating', "
                            . "MONTH(CONVERT(DATETIME, prrq.DTStamp, 101)), "
                            . "LEFT(DATENAME(month, CONVERT(DATETIME, prrq.DTStamp, 101)), 3), "
                            . "YEAR(CONVERT(DATETIME, prrq.DTStamp, 101)), "
                            . "dupl.TotalPrint, "
                            . "CASE WHEN dupl.ColorCopy = 1 THEN 0 ELSE dupl.TotalPrint END, "
                            . "CASE WHEN dupl.ColorCopy = 1 THEN dupl.TotalPrint ELSE 0 END, "
                            . "dupl.TotalCost "
                            . "FROM [IVCDCENTER].[dbo].[PrintRequest] AS prrq INNER JOIN [IVCDCENTER].[dbo].[Duplicating] AS dupl ON prrq.PrintRequestID = dupl.PrintRequestID "
                            . "INNER JOIN [IVCDCENTER].[dbo].[CostCenter] AS csct ON dupl.CostCenterID = csct.CostCenterID "
                            . "INNER JOIN [IVCDCENTER].[dbo].[JobStatusDup] AS jstd ON dupl.JobStatusDupID = jstd.JobStatusDupID "
                            . "WHERE jstd.JobStatusDupID = '5' AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."'";
    
    // drop off
    $query_dup_drop_off = "INSERT INTO #DATA_TABLE SELECT "
                            . "'Duplicating', "
                            . "MONTH(CONVERT(DATETIME, prrq.DTStamp, 101)), "
                            . "LEFT(DATENAME(month, CONVERT(DATETIME, prrq.DTStamp, 101)), 3), "
                            . "YEAR(CONVERT(DATETIME, prrq.DTStamp, 101)), "
                            . "droj.TotalPrint, "
                            . "CASE WHEN droj.ColorCopy = 1 THEN 0 ELSE droj.TotalPrint END, "
                            . "CASE WHEN droj.ColorCopy = 1 THEN droj.TotalPrint ELSE 0 END, "
                            . "droj.TotalCost "
                            . "FROM [IVCDCENTER].[dbo].[PrintRequest] AS prrq INNER JOIN [IVCDCENTER].[dbo].[DropOffJob] AS droj ON prrq.PrintRequestID = droj.PrintRequestID "
                            . "INNER JOIN [IVCDCENTER].[dbo].[CostCenter] AS csct ON droj.CostCenterID = csct.CostCenterID "
                            . "INNER JOIN [IVCDCENTER].[dbo].[JobStatusDup] AS jstd ON droj.JobStatusDupID = jstd.JobStatusDupID "
                            . "WHERE jstd.JobStatusDupID = '5' AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."'";
    
    // catalog
    $query_dup_catalog = "INSERT INTO #DATA_TABLE SELECT "
                            . "'Duplicating', "
                            . "MONTH(CONVERT(DATETIME, prrq.DTStamp, 101)), "
                            . "LEFT(DATENAME(month, CONVERT(DATETIME, prrq.DTStamp, 101)), 3), "
                            . "YEAR(CONVERT(DATETIME, prrq.DTStamp, 101)), "
                            . "ctlg.TotalPrint, "
                            . "ctlg.TotalPrint, "
                            . "0, "
                            . "ctlg.TotalCost "
                            . "FROM [IVCDCENTER].[dbo].[PrintRequest] AS prrq INNER JOIN [IVCDCENTER].[dbo].[Catalog] AS ctlg ON prrq.PrintRequestID = ctlg.PrintRequestID "
                            . "INNER JOIN [IVCDCENTER].[dbo].[CostCenter] AS csct ON ctlg.CostCenterID = csct.CostCenterID "
                            . "INNER JOIN [IVCDCENTER].[dbo].[JobStatusDup] AS jstd ON ctlg.JobStatusDupID = jstd.JobStatusDupID "
                            . "WHERE jstd.JobStatusDupID = '5' AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."'";
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
    
    // execute IVC Duplicating Center data source
    $dbConn->query($query_dup_duplicating);
    $dbConn->query($query_dup_drop_off);
    $dbConn->query($query_dup_catalog);

    // get mail data source
    $cmd = $dbConn->prepare($query_get_result);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    // delete main data source table
    $dbConn->query($query_drop_data_table);

    echo json_encode($data);