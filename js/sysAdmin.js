var m_table;
var admin_id = "";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function() {
    if (sessionStorage.key(0) !== null) {
        getLoginInfo();
        isLoginAdmin();
        getAdminList();
    }
    else {
        window.open('login.html', '_self');
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {    
    // spark 1.1 initialization ///////////////////////////////////////////////
    Spark.init();
    
    ///////////////////////////////////////////////////////////////////////////
    $('#nav_logout').click(function() {
        sessionStorage.clear();
        window.open('login.html', '_self');
        return false;
    });
    
    // new admin button click //////////////////////////////////////////////////
    $('#btn_new_admin').click(function() {
        admin_id = "";
        clearModalSection();
        $('#mod_admin_header').html("New Administrator Setting");
        $("#mod_admin_active").iCheck('check');
        $('#mod_admin_setting').modal('show');
        return false;
    });

    // admin list edit button click ////////////////////////////////////////////
    $('#tbl_admin_list').on('click', 'a[id^="admin_id_"]', function() {
        admin_id = $(this).attr('id').replace("admin_id_", "");
        var result = new Array();
        result = db_getAdminByID(admin_id);
        
        clearModalSection();
        $('#mod_admin_header').html("Edit Administrator Setting");
        if (result[0]['Active'] === "1") {
            $("#mod_admin_active").iCheck('check');
        }
        else {
            $("#mod_admin_active").iCheck('unchecke');
        }
        $('#mod_admin_mame').val(result[0]['AdminName']);
        $('#mod_admin_email').val(result[0]['AdminEmail']);
        $('#mod_admin_setting').modal('show');
        return false;
    });
    
    // modal admin delete button click //////////////////////////////////////////
    $('#mod_btn_admin_delete').click(function() {
        if (admin_id === "") {
            swal({title: "Error", text: "Application system error, cannot get AdminID", type: "error"});
            return false;
        }
        else {
            if (!db_deleteAdminByID(admin_id)) {
                $('#mod_admin_setting').modal('hide');
                var str_msg = "DB system error DELETE ADMIN - AdminID: " + admin_id;
                return dbSystemErrorHandling(str_msg);
            }
        }
        
        getAdminList();
        $('#mod_admin_setting').modal('hide');
        return false;
    });
    
    // modal admin save button click ////////////////////////////////////////////
    $('#mod_btn_admin_save').click(function() {
        var admin_active = ($('#mod_admin_active').is(':checked') ? true : false);
        var admin_name = $.trim($('#mod_admin_mame').val());
        var admin_email = $.trim($('#mod_admin_email').val());
        
        if (admin_id === "") {
            if (!adminValidation()) {
                return false;
            }
            else {                
                if (db_insertAdmin(admin_active, admin_name, admin_email) === "") {
                    $('#mod_admin_setting').modal('hide');
                    var str_msg = "DB system error INSERT ADMIN";
                    return dbSystemErrorHandling(str_msg);
                }
            }
        }
        else {
            if (!db_updateAdminByID(admin_id, admin_active, admin_name, admin_email)) {
                $('#mod_admin_setting').modal('hide');
                var str_msg = "DB system error UPDATE ADMIN - AdminID: " + admin_id;
                return dbSystemErrorHandling(str_msg);
            }
        }
        
        getAdminList();
        $('#mod_admin_setting').modal('hide');
        return false;
    });
    
    // jquery datatables initialize ////////////////////////////////////////////
    m_table = $('#tbl_admin_list').DataTable({ paging: false, bInfo: false, searching: false, columnDefs:[{ className: "dt-center", orderable: false, targets: 3 }] });
    
    // iCheck initialize
    $('input').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
        increaseArea: '20%' // optional
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getLoginInfo() {
    var login_name = sessionStorage.getItem('ss_rpts_loginName');
    $('#login_user').html(login_name + " <span class=\"caret\"></span>");
    
    $('#pg_title').html("Administrator");
    $('#pg_sub_title').html("Administrator setting");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function adminValidation() {
    if ($.trim($('#mod_admin_mame').val()) === "") {
        swal({title: "Error", text: "Administrator name is a required field", type: "error"});
        return false;
    }
    else if ($.trim($('#mod_admin_email').val()) === "") {
        swal({title: "Error", text: "Administrator email is a required field", type: "error"});
        return false;        
    }
    else {
        var result = new Array();
        result = db_getAdminByEmail($.trim($('#mod_admin_email').val()));
        if (result.length === 1) {
            swal({title: "Error", text: "Administrator " + $('#mod_admin_email').val() + " already exist", type: "error"});
            return false;
        }
        else {
            return true;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function isLoginAdmin() {
    var result = new Array();
    result = db_getAdminByEmailActive(sessionStorage.getItem('ss_rpts_loginEmail'));
    
    if (result.length === 1) {
        $('.menu-system-setting').attr("style", "display: block !important");
    }
}

////////////////////////////////////////////////////////////////////////////////
function clearModalSection() {
    $('#mod_admin_header').html("");
    $("#mod_admin_active").iCheck('uncheck');
    $('#mod_admin_mame').val("");
    $('#mod_admin_email').val("");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getAdminList() {
    var result = new Array();
    result = db_getAdminListDataTable();
    
    m_table.clear();
    m_table.rows.add(result).draw();
}