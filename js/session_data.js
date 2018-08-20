////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function sessionData_login(loginName, loginEmail) {  
    sessionStorage.setItem('ss_rpts_loginName', loginName);
    sessionStorage.setItem('ss_rpts_loginEmail', loginEmail);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function objToString(obj) {
    if (obj === null) {
        return "";
    }
    else {
        return obj;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function formatDollar(num, digit) {
    if (digit === 0) {
        var int_num = parseInt(num);
        return "$" + int_num;
    }
    else {
        var p = num.toFixed(digit).split(".");
        return "$" + p[0].split("").reverse().reduce(function(acc, num, i, orig) {
            return  num + (i && !(i % 3) ? "," : "") + acc;
        }, "") + "." + p[1];
    }
}

function revertDollar(amount) {
    var result = 0;
    
    if(amount !== "") {
        amount = amount.replace("$", "");
        amount = amount.replace(/\,/g,'');
        result = parseFloat(amount);
    }
    
    return result;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function textTruncate(t_size, t_value) {
    var t_default = t_value.length;
    var tr_text = "";
    
    if (t_default > t_size) {
        tr_text = t_value.substring(0, t_size);
        tr_text += " ...";
    }
    else
        tr_text = t_value;
    
    return tr_text;
}

function textReplaceApostrophe(str_value) {
    return str_value.replace(/'/g, "''");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getFileExtension(file_name) {
    return file_name.substr((file_name.lastIndexOf('.') +1)).toLowerCase();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
}

function isValidPhoneNumber(phoneNumber) {
    var pattern = new RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
    return pattern.test(phoneNumber);
}

function removeIllegalCharacters(str_value) {
    return str_value.replace(/[#%|&;{}\<>()*?/$!'",:@+^]/g, "");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getCurrentFirstDayOfMonth() {
    var cur_date = new Date();
    var dt_firstDay = new Date(cur_date.getFullYear(), cur_date.getMonth(), 1);

    var yrs = dt_firstDay.getFullYear();
    var mon = dt_firstDay.getMonth() + 1;
    var day = dt_firstDay.getDate();
    
    return mon + "/" + day + "/" + yrs;
}

function getCurrentLastDayOfMonth() {
    var cur_date = new Date();
    var dt_lastDay = new Date(cur_date.getFullYear(), cur_date.getMonth() + 1, 0);
    
    var yrs = dt_lastDay.getFullYear();
    var mon = dt_lastDay.getMonth() + 1;
    var day = dt_lastDay.getDate();
    
    return mon + "/" + day + "/" + yrs;
}

function getFistDayOfMothWithSetMonth(change_month) {
    var cur_date = new Date();
    cur_date.setMonth(cur_date.getMonth() + change_month);
    var dt_firstDay = new Date(cur_date.getFullYear(), cur_date.getMonth(), 1);

    var yrs = dt_firstDay.getFullYear();
    var mon = dt_firstDay.getMonth() + 1;
    var day = dt_firstDay.getDate();
    
    return mon + "/" + day + "/" + yrs;
}

function getCalculateMonthYear(change_month) {
    var cur_date = new Date();  
    cur_date.setDate(1);
    cur_date.setMonth(cur_date.getMonth() + change_month);  
    
    var yrs = cur_date.getFullYear();
    var mon = cur_date.getMonth() + 1;
    
    return mon + "-" + yrs;
}

function getFirstDateOfMonthYear(month_year) {
    var arr = month_year.split("-");
    
    return arr[1] + "-" + arr[0] + "-01";
}

function getLastDateOfMonthYear(month_year) {
    var arr = month_year.split("-");
    var mon = arr[0];
    var year = arr[1];
    var dt_last_date = new Date(year, Number(mon), 0);
    var str_last_date = dt_last_date.toISOString();
    var index = Number(str_last_date.indexOf('T'));
    
    return str_last_date.slice(0, index);
}

function getToday() {
    var today = new Date();
    var day = today.getDate();
    var mon = today.getMonth()+1;
    var yr = today.getFullYear();
    
    return mon + "/" + day + "/" + yr;
}

function convertDBDateTimeToString(date_time) {
    if (date_time === null || date_time === "") {
        return "";
    }
    else {
        var a = date_time.split(" ");
        var d = a[0].split("-");
        var t = a[1].split(":");
        var sel_date_time = new Date(d[0],(d[1]-1),d[2],t[0],t[1],t[2]);

        var day = sel_date_time.getDate();
        var mon = sel_date_time.getMonth()+1;
        var yrs = sel_date_time.getFullYear();
        var hrs = sel_date_time.getHours();
        var min = sel_date_time.getMinutes();
        var shift = "AM";
        if (hrs >= 12) {
            if (hrs > 12) {
                hrs -= 12;
            }
            shift = "PM";
        }

        if (min < 10) {
            min = "0" + min;
        }

        return mon + "/" + day + "/" + yrs + " " + hrs + ":" + min + " " + shift;
    }
}

function convertDBDateToString(date_time) {
    if (date_time === null || date_time === "") {
        return "";
    }
    else {
        var a = date_time.split(" ");
        var d = a[0].split("-");
        var t = a[1].split(":");
        var sel_date_time = new Date(d[0],(d[1]-1),d[2],t[0],t[1],t[2]);

        var day = sel_date_time.getDate();
        var mon = sel_date_time.getMonth()+1;
        var yrs = sel_date_time.getFullYear();
        
        if (mon < 10) {
            mon = "0" + mon;
        }

        return mon + "/" + day + "/" + yrs;
    }
}

function convertSQLDateTimeFormat(dt_date, dt_time) {
    var yrs = dt_date.getFullYear();
    var mon = dt_date.getMonth() + 1;
    var day = dt_date.getDate();
    
    if (mon < 10) {
        mon = '0' + mon;
    }
    if (day < 10) {
        day = '0' + day;
    }
    
    return yrs + "-" + mon + "-" + day  + " " + dt_time;
}

function getBeaconStartDate() {
    var result = new Array(); 
    result = unified_getBeaconStartDate();
    
    if (result.length === 1) {
        var start_date = result[0]['PrintDate'];
        var arr = start_date.split("-");
        return arr[1] + "-" + arr[0];
    }
    else {
        return getCalculateMonthYear(-1);
    }
}

function getBeaconEndDate() {
    var result = new Array(); 
    result = unified_getBeaconEndDate();
    
    if (result.length === 1) {
        var start_date = result[0]['PrintDate'];
        var arr = start_date.split("-");
        return arr[1] + "-" + arr[0];
    }
    else {
        return getCalculateMonthYear(-1);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getDTUIStamp() {
    var result = "";
    var cur_dt = new Date();
    
    result += cur_dt.getFullYear();
    result += cur_dt.getMonth() + 1;
    result += cur_dt.getDate();
    result += cur_dt.getHours();
    result += cur_dt.getMinutes();
    result += cur_dt.getMilliseconds();
    
    return result;
}