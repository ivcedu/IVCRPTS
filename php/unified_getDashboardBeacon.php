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
    
    // Data Source: Beacon System -----------------------------------------------------------------------------------------------------------------------------------------------
    $query_beacon_ivc = "INSERT INTO #DATA_TABLE SELECT "
                        . "'Beacon', "
                        . "MONTH(CONVERT(DATETIME, PrintDate, 101)), "
                        . "LEFT(DATENAME(month, CONVERT(DATETIME, PrintDate, 101)), 3), "
                        . "YEAR(CONVERT(DATETIME, PrintDate, 101)), "
                        . "TotalPages, "
                        . "MonoPages, "
                        . "ColorPages, "
                        . "TotalCost "
                        . "FROM [IREPORT].[dbo].[IVCBeaconUserData] "
                        . "WHERE PrintDate BETWEEN '".$StartDate."' AND '".$EndDate."'";
    
    $query_beacon_saddleback = "INSERT INTO #DATA_TABLE SELECT "
                        . "'Beacon', "
                        . "MONTH(CONVERT(DATETIME, PrintDate, 101)), "
                        . "LEFT(DATENAME(month, CONVERT(DATETIME, PrintDate, 101)), 3), "
                        . "YEAR(CONVERT(DATETIME, PrintDate, 101)), "
                        . "TotalPages, "
                        . "MonoPages, "
                        . "ColorPages, "
                        . "TotalCost "
                        . "FROM [IREPORT].[dbo].[SBCBeaconUserData] "
                        . "WHERE PrintDate BETWEEN '".$StartDate."' AND '".$EndDate."'";
    
    $query_beacon_socccd = "INSERT INTO #DATA_TABLE SELECT "
                        . "'Beacon', "
                        . "MONTH(CONVERT(DATETIME, PrintDate, 101)), "
                        . "LEFT(DATENAME(month, CONVERT(DATETIME, PrintDate, 101)), 3), "
                        . "YEAR(CONVERT(DATETIME, PrintDate, 101)), "
                        . "TotalPages, "
                        . "MonoPages, "
                        . "ColorPages, "
                        . "TotalCost "
                        . "FROM [IREPORT].[dbo].[DSTBeaconUserData] "
                        . "WHERE PrintDate BETWEEN '".$StartDate."' AND '".$EndDate."'";
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