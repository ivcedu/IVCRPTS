////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function dbSystemErrorHandling(str_msg) {
    sendEmailToDeveloper(str_msg);
    swal({  title: "System Error",
            text: str_msg + ", please contact IVC Tech Support at 949.451.5696",
            type: "error",
            confirmButtonText: "OK" },
            function() {
                sessionStorage.clear();
                window.open('login.html', '_self');
                return false;
            }
    );
}

function sendEmailToDeveloper(str_msg) {
    proc_sendEmail("donotreply@ivc.edu", "IVC Application System", "ykim160@ivc.edu", "Rich Kim", "", "", "IVC Reports: DB System Error", str_msg);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function proc_sendEmail(from, from_name, email, name, cc_email, cc_name, subject, message) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/sendEmail.php",
        data:{From:from, FromName:from_name, Email:email, Name:name, CCEmail:cc_email, CCName:cc_name, Subject:subject, Message:message},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}