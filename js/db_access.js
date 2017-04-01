////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ireportDBgetUserAccess(Username) {   
    var Result = "";
    $.ajax({
        type:"POST",
        url:"php/ireport_db_getUserAccess.php",
        data:{Username:Username},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// get AD login info ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getLoginUserInfo(php_file, user, pass) {
    var result = new Array();
    $.ajax({
        type:"POST",
        datatype:"json",
        url:php_file,
        data:{username:user, password:pass},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function getSearchUserInfo(php_file, user) {
    var result = new Array();
    $.ajax({
        type:"POST",
        datatype:"json",
        url:php_file,
        data:{username:user},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// get DB //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function db_getAdminByID(AdminID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAdminByID.php",
        data:{AdminID:AdminID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAdminByEmail(AdminEmail) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAdminByEmail.php",
        data:{AdminEmail:AdminEmail},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAdminByEmailActive(AdminEmail) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAdminByEmailActive.php",
        data:{AdminEmail:AdminEmail},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAdminListDataTable() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAdminListDataTable.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getUserByID(UserID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getUserByID.php",
        data:{UserID:UserID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getUserByEmail(UserEmail) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getUserByEmail.php",
        data:{UserEmail:UserEmail},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getUserByEmailActive(UserEmail) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getUserByEmailActive.php",
        data:{UserEmail:UserEmail},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getUserListDataTable() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getUserListDataTable.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// insert DB ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function db_insertAdmin(Active, AdminName, AdminEmail) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertAdmin.php",
        data:{Active:Active, AdminName:AdminName, AdminEmail:AdminEmail},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertUser(Active, UserName, UserEmail) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertUser.php",
        data:{Active:Active, UserName:UserName, UserEmail:UserEmail},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// update DB ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function db_updateAdminByID(AdminID, Active, AdminName, AdminEmail) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateAdminByID.php",
        data:{AdminID:AdminID, Active:Active, AdminName:AdminName, AdminEmail:AdminEmail},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateUserByID(UserID, Active, UserName, UserEmail) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateUserByID.php",
        data:{UserID:UserID, Active:Active, UserName:UserName, UserEmail:UserEmail},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// delete DB ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function db_deleteAdminByID(AdminID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_deleteAdminByID.php",
        data:{AdminID:AdminID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_deleteUserByID(UserID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_deleteUserByID.php",
        data:{UserID:UserID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// pharos DB reports ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function phar_getIVCTotalPagesCost(StartDate, EndDate, College) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/phar_getIVCTotalPagesCost.php",
        data:{StartDate:StartDate, EndDate:EndDate, College:College},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function phar_getIVCTotalPagesCostDevice(StartDate, EndDate, College) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/phar_getIVCTotalPagesCostDevice.php",
        data:{StartDate:StartDate, EndDate:EndDate, College:College},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function phar_getIVCTotalPagesCostRawData(StartDate, EndDate, College) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/phar_getIVCTotalPagesCostRawData.php",
        data:{StartDate:StartDate, EndDate:EndDate, College:College},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function phar_getIVCFreeCharge(StartDate, EndDate, College) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/phar_getIVCFreeCharge.php",
        data:{StartDate:StartDate, EndDate:EndDate, College:College},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function phar_getIVCFreeChargeDevice(StartDate, EndDate, College) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/phar_getIVCFreeChargeDevice.php",
        data:{StartDate:StartDate, EndDate:EndDate, College:College},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function phar_getIVCFreeChargeRawData(StartDate, EndDate, College) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/phar_getIVCFreeChargeRawData.php",
        data:{StartDate:StartDate, EndDate:EndDate, College:College},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function phar_getIVCStaffTotalPagesCost(StartDate, EndDate, College) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/phar_getIVCStaffTotalPagesCost.php",
        data:{StartDate:StartDate, EndDate:EndDate, College:College},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function phar_getIVCStaffTotalPagesCostDevice(StartDate, EndDate, College) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/phar_getIVCStaffTotalPagesCostDevice.php",
        data:{StartDate:StartDate, EndDate:EndDate, College:College},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function phar_getIVCStaffTotalPagesCostRawData(StartDate, EndDate, College) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/phar_getIVCStaffTotalPagesCostRawData.php",
        data:{StartDate:StartDate, EndDate:EndDate, College:College},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function phar_getIVCStaffFreeCharge(StartDate, EndDate, College) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/phar_getIVCStaffFreeCharge.php",
        data:{StartDate:StartDate, EndDate:EndDate, College:College},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function phar_getIVCStaffFreeChargeDevice(StartDate, EndDate, College) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/phar_getIVCStaffFreeChargeDevice.php",
        data:{StartDate:StartDate, EndDate:EndDate, College:College},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function phar_getIVCStaffFreeChargeRawData(StartDate, EndDate, College) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/phar_getIVCStaffFreeChargeRawData.php",
        data:{StartDate:StartDate, EndDate:EndDate, College:College},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function phar_getIVCProctorReleaseMonth(StartDate, EndDate, College) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/phar_getIVCProctorReleaseMonth.php",
        data:{StartDate:StartDate, EndDate:EndDate, College:College},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function phar_getIVCProctorReleaseDevice(StartDate, EndDate, College) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/phar_getIVCProctorReleaseDevice.php",
        data:{StartDate:StartDate, EndDate:EndDate, College:College},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function phar_getIVCProctorReleaseUser(StartDate, EndDate, College) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/phar_getIVCProctorReleaseUser.php",
        data:{StartDate:StartDate, EndDate:EndDate, College:College},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function phar_getIVCCostCenter(StartDate, EndDate) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/phar_getIVCCostCenter.php",
        data:{StartDate:StartDate, EndDate:EndDate},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function phar_getIVCCostCenterUsers(StartDate, EndDate) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/phar_getIVCCostCenterUsers.php",
        data:{StartDate:StartDate, EndDate:EndDate},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function phar_getIVCCostCenterRawData(StartDate, EndDate) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/phar_getIVCCostCenterRawData.php",
        data:{StartDate:StartDate, EndDate:EndDate},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DSPS Exam DB reports ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function dsps_getNumBookedByMonth(StartDate, EndDate) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/dsps_getNumBookedByMonth.php",
        data:{StartDate:StartDate, EndDate:EndDate},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function dsps_getNumBookedByWeekDay(StartDate, EndDate) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/dsps_getNumBookedByWeekDay.php",
        data:{StartDate:StartDate, EndDate:EndDate},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function dsps_getNumBookedRawData(StartDate, EndDate) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/dsps_getNumBookedRawData.php",
        data:{StartDate:StartDate, EndDate:EndDate},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function dsps_getNumStatusStatistics(StartDate, EndDate) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/dsps_getNumStatusStatistics.php",
        data:{StartDate:StartDate, EndDate:EndDate},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function dsps_getNumStepNotCompleted(StartDate, EndDate) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/dsps_getNumStepNotCompleted.php",
        data:{StartDate:StartDate, EndDate:EndDate},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}