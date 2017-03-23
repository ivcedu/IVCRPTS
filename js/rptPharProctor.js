var ct_month_data;
var ct_device_data;

var ct_pages = 0;
var ct_cost = 0.00;

var ct_table;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function() {
    if (sessionStorage.key(0) !== null) {
        getLoginInfo();
        isLoginAdmin();
        getDefaultStartEndDate();

        pharos_getIVCProctorReleaseMonth(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"));
        pharos_getIVCProctorReleaseDevice(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"));
        pharos_getIVCProctorReleaseUser(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"));

        drawMorrisBarChartProctorReleaseMonth('chart_total_by_month', ct_month_data);
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
    
    // proctor release free of charge tab click event /////////////////////////
    $('#ct_tabs a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        var target = $(e.target).attr("href");

        if (target === "#chart_total_tab_month" && $('#chart_total_by_month').html() === "") {
            drawMorrisBarChartProctorReleaseMonth('chart_total_by_month', ct_month_data);
        }
        else if (target === "#chart_total_tab_device" && $('#chart_total_by_device').html() === "") {
            drawMorrisBarChartProctorReleaseDevice('chart_total_by_device', ct_device_data);
        }
        
        return false;
    });
    
    // refresh button click ///////////////////////////////////////////////////
    $('#btn_refresh').click(function() {
        pharos_getIVCProctorReleaseMonth(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"));    
        pharos_getIVCProctorReleaseDevice(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"));
        pharos_getIVCProctorReleaseUser(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"));
        
        if ($("ul#ct_tabs li.active").attr('id') === "ct_tab_month") {
            drawMorrisBarChartProctorReleaseMonth('chart_total_by_month', ct_month_data);
        }
        else if ($("ul#ct_tabs li.active").attr('id') === "ct_tab_device") {
            drawMorrisBarChartProctorReleaseDevice('chart_total_by_device', ct_device_data);
        }
        
        this.blur();
        return false;
    });
    
    // jquery datatables initialize ////////////////////////////////////////////
    ct_table = $('#tbl_ct_raw_data_list').DataTable({ responsive: true, paging: false, bInfo: false, searching: false, order: [[ 3, "desc" ]] });

    // datepicker
    $('#start_date').datepicker();
    $('#end_date').datepicker();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getLoginInfo() {
    var login_name = sessionStorage.getItem('ss_rpts_loginName');
    $('#login_user').html(login_name + " <span class=\"caret\"></span>");
    
    $('#pg_title').html("IVC Pharos");
    $('#pg_sub_title').html("IVC pharos proctor release free of charge printer dashboard");
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
function getDefaultStartEndDate() {
    $('#start_date').datepicker( "setDate", getFistDayOfMothWithSetMonth(-6) );
    $('#end_date').datepicker( "setDate", getCurrentLastDayOfMonth() );
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function pharos_getIVCProctorReleaseMonth(start_date, end_date) {
    var result = new Array(); 
    result = phar_getIVCProctorReleaseMonth(start_date, end_date);
    
    ct_month_data = [];
    ct_pages = 0;
    ct_cost = 0.00;
    
    for (var i = 0; i < result.length; i++) {    
        ct_pages += Number(result[i]['TotalPages']);
        ct_cost += Number(result[i]['TotalCost']);
        ct_month_data.push({ month: result[i]['RptMonth'] + ' ' + result[i]['RptYear'], tpages: Number(result[i]['TotalPages']), tcost: Number(result[i]['TotalCost']) });
    }
}

function drawMorrisBarChartProctorReleaseMonth(chart_section, chart_data) {
    $('#' + chart_section).empty();
    $('#ct_month_pages').html("Total Pages: " + ct_pages);
    $('#ct_month_cost').html("Total Cost: " + formatDollar(ct_cost, 2));

    Morris.Bar({
        element: chart_section,
        data: chart_data,
        xkey: 'month',
        xLabelMargin: 10,
        ykeys: ['tpages', 'tcost'],
        labels: ['Pages', 'Cost'],
        hideHover: 'auto',
        resize: true,
        gridLineColor: '#eeeeee',
        barSizeRatio: 0.7,
        barColors: ['#006699', '#993300'],
        redraw: true,
        hoverCallback: function (index, options, content, row) {
            var row = options.data[index];
            month = "<b>" + row.month + "</b>";
            tpages = "<font color='#006699'>Pages: " + row.tpages + "</font>";
            tcost = "<font color='#993300'>Cost: $" + row.tcost + "</font>";
            return [month, tpages, tcost].join('<br/>');
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function pharos_getIVCProctorReleaseDevice(start_date, end_date) {
    var result = new Array(); 
    result = phar_getIVCProctorReleaseDevice(start_date, end_date);

    ct_device_data = [];
    ct_pages = 0;
    ct_cost = 0.00;
    
    for (var i = 0; i < result.length; i++) { 
        ct_pages += Number(result[i]['TotalPages']);
        ct_cost += Number(result[i]['TotalCost']);
        ct_device_data.push({ device: result[i]['Device'], tpages: Number(result[i]['TotalPages']), tcost: Number(result[i]['TotalCost']) });
    }
}

function drawMorrisBarChartProctorReleaseDevice(chart_section, chart_data) {   
    $('#' + chart_section).empty();
    $('#ct_device_pages').html("Total Pages: " + ct_pages);
    $('#ct_device_cost').html("Total Cost: " + formatDollar(ct_cost, 2));

    Morris.Bar({
        element: chart_section,
        data: chart_data,
        xkey: 'device',
        xLabelMargin: 10,
        ykeys: ['tpages', 'tcost'],
        labels: ['Pages', 'Cost'],
        hideHover: 'auto',
        resize: true,
        gridLineColor: '#eeeeee',
        barSizeRatio: 0.7,
        barColors: ['#006699', '#993300'],
        redraw: true,
        hoverCallback: function (index, options, content, row) {
            var row = options.data[index];
            device = "<b>" + row.device + "</b>";
            tpages = "<font color='#006699'>Pages: " + row.tpages + "</font>";
            tcost = "<font color='#993300'>Cost: $" + row.tcost + "</font>";
            return [device, tpages, tcost].join('<br/>');
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function pharos_getIVCProctorReleaseUser(start_date, end_date) {
    var result = new Array(); 
    result = phar_getIVCProctorReleaseUser(start_date, end_date);
    
    ct_table.clear();
    ct_table.rows.add(result).draw();
}