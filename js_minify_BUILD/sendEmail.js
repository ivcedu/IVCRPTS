
function dbSystemErrorHandling(a){sendEmailToDeveloper(a);swal({title:"System Error",text:a+", please contact IVC Tech Support at 949.451.5696",type:"error",confirmButtonText:"OK"},function(){sessionStorage.clear();window.open("login.html","_self");return false})}function sendEmailToDeveloper(a){proc_sendEmail("donotreply@ivc.edu","IVC Application System","ykim160@ivc.edu","Rich Kim","","","Resource Form 2017: DB System Error",a)}function proc_sendEmail(g,c,d,a,e,h,f,i){var b=false;$.ajax({type:"POST",url:"php/sendEmail.php",data:{From:g,FromName:c,Email:d,Name:a,CCEmail:e,CCName:h,Subject:f,Message:i},async:false,success:function(j){b=JSON.parse(j)}});return b};