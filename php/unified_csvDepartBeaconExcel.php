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