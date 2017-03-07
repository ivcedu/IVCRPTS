////////////////////////////////////////////////////////////////////////////////
window.onload = function() {
    $('#logn_error').hide();
    var curBrowser = bowser.name;
    var curVersion = Number(bowser.version);
    
    switch (curBrowser) {
        case "Safari":
            if (curVersion < 6)
                window.open('browser_not_support.html', '_self');
            break;
        case "Chrome":
            if (curVersion < 7)
                window.open('browser_not_support.html', '_self');
            break;
        case "Firefox":
            if (curVersion < 22)
                window.open('browser_not_support.html', '_self');
            break;
        case "Internet Explorer":
            if (curVersion < 11)
                window.open('browser_not_support.html', '_self');
            break;
        default:     
            break;
    }
};

////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {      
    $('#btn_login').click(function() { 
        // ireport.ivc.edu validation //////////////////////////////////////////
        if(location.href.indexOf("ireport.ivc.edu") >= 0 && !ireportValidation()) {
            swal({  title: "Access Denied",
                    text: "This is a Development site. It will redirect to IVC Application site",
                    type: "error",
                    confirmButtonText: "OK" },
                    function() {
                        sessionStorage.clear();
                        window.open('https://services.ivc.edu/', '_self');
                        return false;
                    }
            );
        }
        ////////////////////////////////////////////////////////////////////////
        else {
            var login_error = loginInfo();
            if(login_error === "") {
                window.open('home.html', '_self');
            }
            else if (login_error === "Invalid Username or Password") {
                $('#error_msg').html(login_error);
                $('#logn_error').show();
                this.blur();
            }
            else if (login_error === "Access Denied") {
                swal({title: "Error", text: "You do not have access to IVC Reports site", type: "error"});
            }
            return false;
        }
    });
    
    $.backstretch(["images/ivcrpts_back_web_1.jpg"], {duration: 3000, fade: 750});
});

////////////////////////////////////////////////////////////////////////////////
function loginInfo() {   
    var username = $('#username').val().toLowerCase().replace("@ivc.edu", "");
    var password = $('#password').val();
    
    var result = new Array();
    result = getLoginUserInfo("php/ldap_login_staff.php", username, password);    
    if (result.length === 0) {
        return "Invalid Username or Password";
    }
    else {
        var name = objToString(result[0]);
        var email = objToString(result[1]);
        var err = userAccessValidation(email);
        
        if (err !== "") {
            return err;
        }
        else {
            sessionData_login(name, email);
            return "";
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
function ireportValidation() {
    var username = $('#username').val().toLowerCase().replace("@ivc.edu", "").replace("@saddleback.edu", "");
    if (ireportDBgetUserAccess(username) !== null) {
        return true;
    }
    else {
        return false;
    }
}

////////////////////////////////////////////////////////////////////////////////
function userAccessValidation(email) {
    var result = new Array();
    result = db_getUserByUserEmail(email);  
    
    if (result.length === 1) {
        return "";
    }
    else {
        return "Access Denied";
    }
}