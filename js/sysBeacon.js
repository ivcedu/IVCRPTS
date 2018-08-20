////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function() {
    if (sessionStorage.key(0) !== null) {
        getLoginInfo();
        isLoginAdmin();
    }
    else {
        window.open('login.html', '_self');
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {    
    // spark 1.1 initialization ///////////////////////////////////////////////
    Spark.init();
    
    // iCheck initialize
    $('input').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
        increaseArea: '20%' // optional
    });
    
    ///////////////////////////////////////////////////////////////////////////
    $('#nav_logout').click(function() {
        sessionStorage.clear();
        window.open('login.html', '_self');
        return false;
    });
    
    // import button click ////////////////////////////////////////////////////
    $('#btn_import').click(function() {
        var user_college = $('#user_college').val();
        if (user_college === "") {
            swal({title: "Error", text: "Please select user college", type: "error"});
            return false;
        }
        
        if (!csvImportFileValidation()) {
            return false;
        }
        
        startSpinning();
        setTimeout(function() {
            if (insertCSVImportFileAttachment(user_college)) {
                swal({title: "Success!", text: "Import to Beacon data has been completed", type: "success"});
            }
            stopSpinning();
        }, 1500);
        
        return false;
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function startSpinning() {
    $('.panel').css('opacity', '0.5');
    $('#spinner_loader_img').addClass('preloader__spinner');
    $('#spinner_loader').show();
}

function stopSpinning() {
    $('.panel').css('opacity', '1');
    $('#spinner_loader_img').removeClass('preloader__spinner');
    $('#spinner_loader').hide();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getLoginInfo() {
    var login_name = sessionStorage.getItem('ss_rpts_loginName');
    $('#login_user').html(login_name + " <span class=\"caret\"></span>");
    
    $('#pg_title').html("Beacon");
    $('#pg_sub_title').html("Beacon Data Import");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function isLoginAdmin() {
    var result = new Array();
    result = db_getAdminByEmailActive(sessionStorage.getItem('ss_rpts_loginEmail'));
    
    if (result.length === 1) {
        $('.menu-system-setting').attr("style", "display: block !important");
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function csvImportFileValidation() {
    var file = $('#csv_import_file').get(0).files[0];

    if (typeof file !== "undefined" && file !== null) {
        var f_extension = getFileExtension(file.name);
        if (f_extension !== "csv") {
            swal({title: "Error", text: "Only CSV file can be import", type: "error"});
            return false;
        } 
        else {   
            if (file.size >= 2000000) {
                swal({title: "Error", text: "Attached file size is too big, max. file size allow is 2Mb or less", type: "error"});
                return false;
            }
            else {
                return true;
            }
        }
    }
    else {
        swal({title: "Error", text: "Please select file", type: "error"});
        return false;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function insertCSVImportFileAttachment(user_college) {
    var file = $('#csv_import_file').get(0).files[0];  
    var file_data = new FormData();
    var f_name = removeIllegalCharacters(file.name);
    file_data.append("files[]", file, f_name); 
    file_data.append("college", user_college);
    
    if (existCSVImportFilePrintDate(file_data)) {
        swal({title: "Error", text: "Attached file already imported into DB", type: "error"});
        return false;
    }
    if (!upload_csvImportFile(file_data)) {
        var str_msg = "DB system error INSERT BEACON DATA FROM CSV FILE ";
        return dbSystemErrorHandling(str_msg);
    }
    return true;
}