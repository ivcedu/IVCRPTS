<?php
    require("config_ireport.php");
    $output_dir = "C:/xampp/htdocs/IVCRPTS/temp/";

    if(isset($_FILES["files"])) {
        $user_college = filter_input(INPUT_POST, 'college');
        $file_name = $_FILES["files"]["name"][0];
        $result = move_uploaded_file($_FILES["files"]["tmp_name"][0], $output_dir.$file_name);
        
        $ldap_server = "ivc.edu";
        $ldap_dc = "dc=ivc,dc=edu";
        $db_table = "IVCBeaconUserData";
        if ($user_college === "saddleback") {
            $ldap_server = "saddleback.edu";
            $ldap_dc = "dc=saddleback,dc=edu";
            $db_table = "SBCBeaconUserData";
        }
        else if ($user_college === "socccd") {
            $ldap_server = "socccd.edu";
            $ldap_dc = "dc=socccd,dc=edu";
            $db_table = "DSTBeaconUserData";
        }
        
        $getHeader = true;
        if (($handle = fopen($output_dir.$file_name, "r")) !== FALSE) {            
            while (($data = fgetcsv($handle, ",")) !== FALSE) {
                if ($getHeader) {
                    if(count($data) !== 6) {
                        unlink($output_dir.$file_name);
                        echo json_encode(false);
                    }
                    $getHeader = false;
                    continue;
                }
                
                $year_mon = $data[0];
                $user_id = $data[1];
                $total_pages = $data[2];
                $mono_pages = $data[3];
                $color_pages = $data[4];
                $total_cost = $data[5];
                
                $user_data = ldapGetUserInfo($ldap_server, $ldap_dc, $user_id);
                $num_cost_center = intval($user_data['count']);
                if ($num_cost_center === 0) {
                    continue;
                }
                else if ($num_cost_center === 1) {
                    $user_cost_center_code = $user_data[0];
                    
                    if (insertIVCBeaconUserData($dbConn, $dbDatabase, $db_table, $user_id, $user_cost_center_code, $year_mon, $total_pages, $mono_pages, $color_pages, $total_cost) === "") {
                        deleteIVCBeaconUserDate($dbConn, $dbDatabase, $db_table, $PrintDate);
                        fclose($handle);
                        unlink($output_dir.$file_name);
                        echo json_encode(false);
                    }
                }
                else {
                    $new_t_pages = ceil($total_pages / $num_cost_center);
                    $new_m_pages = ceil($mono_pages / $num_cost_center);
                    $new_c_pages = ceil($color_pages / $num_cost_center);
                    $new_t_cost = $total_cost / $num_cost_center;
                    
                    for ($i = 0; $i < $num_cost_center; $i++) {
                        $user_cost_center_code = $user_data[$i];
                        if (insertIVCBeaconUserData($dbConn, $dbDatabase, $db_table, $user_id, $user_cost_center_code, $year_mon, $new_t_pages, $new_m_pages, $new_c_pages, $new_t_cost) === "") {
                            deleteIVCBeaconUserDate($dbConn, $dbDatabase, $db_table, $PrintDate);
                            fclose($handle);
                            unlink($output_dir.$file_name);
                            echo json_encode(false);
                        }
                    }
                }
            }
                
            fclose($handle);
            $result = unlink($output_dir.$file_name);
        }

        echo json_encode($result);
    }
    else {
        echo json_encode(false);
    }
    
    function insertIVCBeaconUserData($dbConn, $dbDatabase, $db_table, $userID, $CostCenter, $PrintDate, $TotalPages, $MonoPages, $ColorPages, $TotalCost) {        
        $insert_query = "INSERT INTO [".$dbDatabase."].[dbo].[".$db_table."] "
                    ."(UserID, CostCenter, PrintDate, TotalPages, MonoPages, ColorPages, TotalCost) "
                    ."VALUES ('$userID', '$CostCenter', CONVERT(DateTime, '".$PrintDate."', 121), '$TotalPages', '$MonoPages', '$ColorPages', '$TotalCost')";

        $cmd = $dbConn->prepare($insert_query);
        $cmd->execute();
        $ResultID = $dbConn->lastInsertId();
        
        return $ResultID;
    }
    
    function deleteIVCBeaconUserDate($dbConn, $dbDatabase, $db_table, $PrintDate) {
        $delete_query = "DELETE [".$dbDatabase."].[dbo].[".$db_table."] WHERE PrintDate = CONVERT(DateTime, '".$PrintDate."', 121)";
        $cmd = $dbConn->prepare($delete_query);
        $result = $cmd->execute(); 
        
        return $result;
    }
    
    function ldapGetUserInfo($server, $baseDN, $searchUser) {
        $login = "wifilookup";
        $password = "lookitup";
        $result = array();

        $ldapconn = ldap_connect($server);   
        if($ldapconn) {          
            ldap_set_option($ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
            ldap_set_option($ldapconn, LDAP_OPT_REFERRALS, 0);

            $ldapbind = ldap_bind($ldapconn, $login, $password);  
            if($ldapbind) {
                $filter = "(&(objectClass=user)(objectCategory=person)(cn=".$searchUser."))";
                $ladp_result = ldap_search($ldapconn, $baseDN, $filter);
                $data = ldap_get_entries($ldapconn, $ladp_result);

                $result = $data[0]["costcenter"];
            }          
            ldap_close($ldapconn);
        }
        
        return $result;
    }