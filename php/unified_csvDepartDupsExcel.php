<?php
    require("config_ireport.php");
    
    $StartDate = filter_input(INPUT_GET, 'StartDate');
    $EndDate = filter_input(INPUT_GET, 'EndDate');
    $Param = filter_input(INPUT_GET, 'Param');
    $FileName = filter_input(INPUT_GET, 'FileName');
    
    $dbConn->setAttribute(constant('PDO::SQLSRV_ATTR_DIRECT_QUERY'), true);
    
    $query_create_data_table = "CREATE TABLE #DATA_TABLE (CostCenter nvarchar(255), "
                                                        . "LoginID nvarchar(255), "
                                                        . "TotalPages int, "
                                                        . "MonoPages int, "
                                                        . "ColorPages int, "
                                                        . "TotalCost money)";
    
    $query_drop_data_table = "DROP TABLE #DATA_TABLE";
    
    // Data Source: IVC Duplicating Center --------------------------------------------------------------------------------------------------------------------------------------
    // dupliating
    $query_dup_duplicating = "INSERT INTO #DATA_TABLE SELECT "
                            . "csct.CostCenterCode, "
                            . "REPLACE(REPLACE(prrq.Email, '@ivc.edu', ''), '@saddleback.edu', ''), "
                            . "dupl.TotalPrint, "
                            . "CASE WHEN dupl.ColorCopy = 1 THEN 0 ELSE dupl.TotalPrint END, "
                            . "CASE WHEN dupl.ColorCopy = 1 THEN dupl.TotalPrint ELSE 0 END, "
                            . "dupl.TotalCost AS TotalCost "
                            . "FROM [IEXDBLISTNR].[IVCDCENTER].[dbo].[PrintRequest] AS prrq INNER JOIN [IEXDBLISTNR].[IVCDCENTER].[dbo].[Duplicating] AS dupl ON prrq.PrintRequestID = dupl.PrintRequestID "
                            . "INNER JOIN [IEXDBLISTNR].[IVCDCENTER].[dbo].[CostCenter] AS csct ON dupl.CostCenterID = csct.CostCenterID "
                            . "INNER JOIN [IEXDBLISTNR].[IVCDCENTER].[dbo].[JobStatusDup] AS jstd ON dupl.JobStatusDupID = jstd.JobStatusDupID "
                            . "WHERE jstd.JobStatusDupID = '5' AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."'";
    
    // drop off
    $query_dup_drop_off = "INSERT INTO #DATA_TABLE SELECT "
                            . "csct.CostCenterCode, "
                            . "REPLACE(REPLACE(prrq.Email, '@ivc.edu', ''), '@saddleback.edu', ''), "
                            . "droj.TotalPrint, "
                            . "CASE WHEN droj.ColorCopy = 1 THEN 0 ELSE droj.TotalPrint END, "
                            . "CASE WHEN droj.ColorCopy = 1 THEN droj.TotalPrint ELSE 0 END, "
                            . "droj.TotalCost AS TotalCost "
                            . "FROM [IEXDBLISTNR].[IVCDCENTER].[dbo].[PrintRequest] AS prrq INNER JOIN [IEXDBLISTNR].[IVCDCENTER].[dbo].[DropOffJob] AS droj ON prrq.PrintRequestID = droj.PrintRequestID "
                            . "INNER JOIN [IEXDBLISTNR].[IVCDCENTER].[dbo].[CostCenter] AS csct ON droj.CostCenterID = csct.CostCenterID "
                            . "INNER JOIN [IEXDBLISTNR].[IVCDCENTER].[dbo].[JobStatusDup] AS jstd ON droj.JobStatusDupID = jstd.JobStatusDupID "
                            . "WHERE jstd.JobStatusDupID = '5' AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."'";
    
    // catalog
    $query_dup_catalog = "INSERT INTO #DATA_TABLE SELECT "
                            . "csct.CostCenterCode, "
                            . "REPLACE(REPLACE(prrq.Email, '@ivc.edu', ''), '@saddleback.edu', ''), "
                            . "ctlg.TotalPrint, "
                            . "CASE WHEN ctlg.ColorCopy = 1 THEN 0 ELSE ctlg.TotalPrint END, "
                            . "CASE WHEN ctlg.ColorCopy = 1 THEN ctlg.TotalPrint ELSE 0 END, "
                            . "ctlg.TotalCost AS TotalCost "
                            . "FROM [IEXDBLISTNR].[IVCDCENTER].[dbo].[PrintRequest] AS prrq INNER JOIN [IEXDBLISTNR].[IVCDCENTER].[dbo].[Catalog] AS ctlg ON prrq.PrintRequestID = ctlg.PrintRequestID "
                            . "INNER JOIN [IEXDBLISTNR].[IVCDCENTER].[dbo].[CostCenter] AS csct ON ctlg.CostCenterID = csct.CostCenterID "
                            . "INNER JOIN [IEXDBLISTNR].[IVCDCENTER].[dbo].[JobStatusDup] AS jstd ON ctlg.JobStatusDupID = jstd.JobStatusDupID "
                            . "WHERE jstd.JobStatusDupID = '5' AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."'";
    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    // execute main data source query
    if ($Param === "Department_Section") {
        $query_get_result = "SELECT "
                            . "dttb.CostCenter AS Code, "
                            . "wdcc.CostCenter AS CostCenter, "
                            . "dttb.LoginID, "
                            . "SUM(dttb.TotalPages) AS TotalPages, "
                            . "SUM(dttb.MonoPages) AS MonoPages, "
                            . "SUM(dttb.ColorPages) AS ColorPages, "
                            . "SUM(dttb.TotalCost) AS TotalCost "
                            . "FROM #DATA_TABLE AS dttb INNER JOIN [IREPORT].[dbo].[WorkdayCostCenter] AS wdcc ON dttb.CostCenter = wdcc.Code "
                            . "GROUP BY dttb.CostCenter, wdcc.CostCenter, dttb.LoginID "
                            . "ORDER BY wdcc.CostCenter, dttb.LoginID";
    }
    else if ($Param === "User_Section") {
        $query_get_result = "SELECT "
                            . "dttb.LoginID, "
                            . "dttb.CostCenter AS Code, "
                            . "wdcc.CostCenter AS CostCenter, "
                            . "SUM(dttb.TotalPages) AS TotalPages, "
                            . "SUM(dttb.MonoPages) AS MonoPages, "
                            . "SUM(dttb.ColorPages) AS ColorPages, "
                            . "SUM(dttb.TotalCost) AS TotalCost "
                            . "FROM #DATA_TABLE AS dttb INNER JOIN [IREPORT].[dbo].[WorkdayCostCenter] AS wdcc ON dttb.CostCenter = wdcc.Code "
                            . "GROUP BY dttb.CostCenter, wdcc.CostCenter, dttb.LoginID "
                            . "ORDER BY dttb.LoginID, wdcc.CostCenter";
    }
    
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
    
    // create csv file
    $filename = $FileName.".csv";  
    header("Content-Disposition: attachment; filename=\"$filename\"");
    header("Content-Type: text/csv;");
    $out = fopen("php://output", 'w+');

    if ($Param === "Department_Section") {
        // Write the spreadsheet column titles / labels
        fputcsv($out, array('Code','CostCenter', 'UserID', 'TotalPages', 'MonoPages', 'ColorPages', 'TotalCost'));
        // Write all the records to the spreadsheet
        foreach($data as $row) {
            fputcsv($out, array($row['Code'], $row['CostCenter'], $row['LoginID'], $row['TotalPages'], $row['MonoPages'], $row['ColorPages'], $row['TotalCost']));
        }
    }
    else if ($Param === "User_Section") {
        // Write the spreadsheet column titles / labels
        fputcsv($out, array('UserID', 'Code','CostCenter', 'TotalPages', 'MonoPages', 'ColorPages', 'TotalCost'));
        // Write all the records to the spreadsheet
        foreach($data as $row) {
            fputcsv($out, array($row['LoginID'], $row['Code'], $row['CostCenter'], $row['TotalPages'], $row['MonoPages'], $row['ColorPages'], $row['TotalCost']));
        }
    }

    fclose($out);
    exit;