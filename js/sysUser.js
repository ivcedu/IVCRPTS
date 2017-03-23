var m_table;
var user_id = "";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function() {
    if (sessionStorage.key(0) !== null) {
        getLoginInfo();
        isLoginAdmin();
        getUserList();
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
    
    // new user button click //////////////////////////////////////////////////
    $('#btn_new_user').click(function() {
        user_id = "";
        clearModalSection();
        $('#mod_user_header').html("New User Setting");
        $("#mod_user_active").iCheck('check');
        $('#mod_user_setting').modal('show');
        return false;
    });

    // user list edit button click ////////////////////////////////////////////
    $('#tbl_user_list').on('click', 'a[id^="user_id_"]', function() {
        user_id = $(this).attr('id').replace("user_id_", "");
        var result = new Array();
        result = db_getUserByID(user_id);
        
        clearModalSection();
        $('#mod_user_header').html("Edit Administrator Setting");
        if (result[0]['Active'] === "1") {
            $("#mod_user_active").iCheck('check');
        }
        else {
            $("#mod_user_active").iCheck('unchecke');
        }
        $('#mod_user_mame').val(result[0]['UserName']);
        $('#mod_user_email').val(result[0]['UserEmail']);
        $('#mod_user_setting').modal('show');
        return false;
    });
    
    // modal user delete button click //////////////////////////////////////////
    $('#mod_btn_user_delete').click(function() {
        if (user_id === "") {
            swal({title: "Error", text: "Application system error, cannot get UserID", type: "error"});
            return false;
        }
        else {
            if (!db_deleteUserByID(user_id)) {
                $('#mod_user_setting').modal('hide');
                var str_msg = "DB system error DELETE USER - UserID: " + user_id;
                return dbSystemErrorHandling(str_msg);
            }
        }
        
        getUserList();
        $('#mod_user_setting').modal('hide');
        return false;
    });
    
    // modal user save button click ////////////////////////////////////////////
    $('#mod_btn_user_save').click(function() {
        var user_active = ($('#mod_user_active').is(':checked') ? true : false);
        var user_name = $.trim($('#mod_user_mame').val());
        var user_email = $.trim($('#mod_user_email').val());
        
        if (user_id === "") {
            if (!userValidation()) {
                return false;
            }
            else {                
                if (db_insertUser(user_active, user_name, user_email) === "") {
                    $('#mod_user_setting').modal('hide');
                    var str_msg = "DB system error INSERT USER";
                    return dbSystemErrorHandling(str_msg);
                }
            }
        }
        else {
            if (!db_updateUserByID(user_id, user_active, user_name, user_email)) {
                $('#mod_user_setting').modal('hide');
                var str_msg = "DB system error UPDATE USER - UserID: " + user_id;
                return dbSystemErrorHandling(str_msg);
            }
        }
        
        getUserList();
        $('#mod_user_setting').modal('hide');
        return false;
    });
    
    // jquery datatables initialize ////////////////////////////////////////////
    m_table = $('#tbl_user_list').DataTable({ paging: false, bInfo: false, searching: false, columnDefs:[{ className: "dt-center", orderable: false, targets: 3 }] });
    
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
    
    $('#pg_title').html("Users");
    $('#pg_sub_title').html("User setting");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function userValidation() {
    if ($.trim($('#mod_user_mame').val()) === "") {
        swal({title: "Error", text: "User name is a required field", type: "error"});
        return false;
    }
    else if ($.trim($('#mod_user_email').val()) === "") {
        swal({title: "Error", text: "User email is a required field", type: "error"});
        return false;        
    }
    else {
        var result = new Array();
        result = db_getUserByEmail($.trim($('#mod_user_email').val()));
        if (result.length === 1) {
            swal({title: "Error", text: "User " + $('#mod_user_email').val() + " already exist", type: "error"});
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
    $('#mod_user_header').html("");
    $("#mod_user_active").iCheck('uncheck');
    $('#mod_user_mame').val("");
    $('#mod_user_email').val("");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getUserList() {
    var result = new Array();
    result = db_getUserListDataTable();
    
    m_table.clear();
    m_table.rows.add(result).draw();
}