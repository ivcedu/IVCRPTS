<?php
    require("config_ireport.php");
    $output_dir = "C:/xampp/htdocs/IVCRPTS/temp/";

    if(isset($_FILES["files"])) {
        $user_college = filter_input(INPUT_POST, 'college');
        $file_name = $_FILES["files"]["name"][0];
        $result = move_uploaded_file($_FILES["files"]["tmp_name"][0], $output_dir.$file_name);
        
        $db_table = "IVCBeaconUserData";
        if ($user_college === "saddleback") {
            $db_table = "SBCBeaconUserData";
        }
        else if ($user_college === "socccd") {
            $db_table = "DSTBeaconUserData";
        }
        
        $result = false;
        $getHeader = true;
        if (($handle = fopen($output_dir.$file_name, "r")) !== FALSE) {            
            while (($data = fgetcsv($handle, ",")) !== FALSE) {
                if ($getHeader) {
                    $getHeader = false;
                    continue;
                }
                
                $year_mon = $data[0];
                $result_data = array();
                
                $result_data = getBeaconUserPrintDate($dbConn, $dbDatabase, $db_table, $year_mon);
                if(count($result_data) === 1) {
                    $result = true;
                }
                break;
            }
                
            fclose($handle);
            unlink($output_dir.$file_name);
        }

        echo json_encode($result);
    }
    else {
        echo json_encode(false);
    }
    
    function getBeaconUserPrintDate($dbConn, $dbDatabase, $db_table, $PrintDate) {        
        $query = "SELECT TOP(1) PrintDate FROM [".$dbDatabase."].[dbo].[".$db_table."] WHERE PrintDate = '".$PrintDate."'";
        
        $cmd = $dbConn->prepare($query);
        $cmd->execute(); 
        $data = $cmd->fetchAll();
        
        return $data;
    }