<?php
    $dbHost = "intdb2";
    $dbDatabase = "pharos";
    $dbUser = "phreports";
    $dbPass = "u50dIBzw1Qs6";

    // MSSQL database connection
    try {
        $dbConn = new PDO("sqlsrv:server=$dbHost;Database=$dbDatabase", $dbUser, $dbPass);
    } 
    catch (PDOException $e) {
        die ($e->getMessage());
    }