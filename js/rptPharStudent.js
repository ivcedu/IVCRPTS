var ct_month_data;
var ct_device_data;
var cf_month_data;
var cf_device_data;

var ct_table;
var cf_table;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function() {
    if (sessionStorage.key(0) !== null) {
        $('#spinner_loader').hide();
        getLoginInfo();
        isLoginAdmin();
        getDefaultStartEndDate();
        setHeaderSectionTitle();

        pharos_getIVCTotalPagesCost(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), 
                                    convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"),
                                    $('#rpt_college').val());
        pharos_getIVCTotalPagesCostDevice(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), 
                                            convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"),
                                            $('#rpt_college').val());
        pharos_getIVCTotalPagesCostRawData(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), 
                                            convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"),
                                            $('#rpt_college').val());
                                            
        pharos_getIVCFreeCharge(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), 
                                convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"),
                                $('#rpt_college').val());
        pharos_getIVCFreeChargeDevice(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), 
                                        convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"),
                                        $('#rpt_college').val());
        pharos_getIVCFreeChargeRawData(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), 
                                        convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"),
                                        $('#rpt_college').val());

        drawMorrisBarChartTotalPagesCost('chart_total_by_month', ct_month_data);
        drawMorrisBarChartFreeCharge('chart_free_by_month', cf_month_data);
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
    
    // total pages/cost tab click event ///////////////////////////////////////
    $('#ct_tabs a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        var target = $(e.target).attr("href");

        if (target === "#chart_total_tab_month") {
            drawMorrisBarChartTotalPagesCost('chart_total_by_month', ct_month_data);
        }
        else if (target === "#chart_total_tab_device") {
            drawMorrisBarChartTotalPagesCostDevice('chart_total_by_device', ct_device_data);
        }
        
        return false;
    });
    
    // free of charge tab click event /////////////////////////////////////////
    $('#cf_tabs a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        var target = $(e.target).attr("href");
        
        if (target === "#chart_free_tab_month") {
            drawMorrisBarChartFreeCharge('chart_free_by_month', cf_month_data);
        }
        else if (target === "#chart_free_tab_device") {
            drawMorrisBarChartFreeChargeDevice('chart_free_by_device', cf_device_data);
        }
        
        return false;
    });
    
    // refresh button click ///////////////////////////////////////////////////
    $('#btn_refresh').click(function() {
        setHeaderSectionTitle();
        emptyTotalPagesSection();
        emptyFreeOfChargeSection();
        
        $('#spinner_loader_img').addClass('preloader__spinner');
        $('#spinner_loader').show();
        
        setTimeout(function() { 
            pharos_getIVCTotalPagesCost(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), 
                                    convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"),
                                    $('#rpt_college').val());
            pharos_getIVCTotalPagesCostDevice(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), 
                                                convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"),
                                                $('#rpt_college').val());
            pharos_getIVCTotalPagesCostRawData(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), 
                                                convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"),
                                                $('#rpt_college').val());

            pharos_getIVCFreeCharge(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), 
                                    convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"),
                                    $('#rpt_college').val());
            pharos_getIVCFreeChargeDevice(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), 
                                            convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"),
                                            $('#rpt_college').val());
            pharos_getIVCFreeChargeRawData(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), 
                                            convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"),
                                            $('#rpt_college').val());
                                            
            if ($("ul#ct_tabs li.active").attr('id') === "ct_tab_month") {
                drawMorrisBarChartTotalPagesCost('chart_total_by_month', ct_month_data);
            }
            else if ($("ul#ct_tabs li.active").attr('id') === "ct_tab_device") {
                drawMorrisBarChartTotalPagesCostDevice('chart_total_by_device', ct_device_data);
            }

            if ($("ul#cf_tabs li.active").attr('id') === "cf_tab_month") {
                drawMorrisBarChartFreeCharge('chart_free_by_month', cf_month_data);
            }
            else if ($("ul#cf_tabs li.active").attr('id') === "cf_tab_device") {
                drawMorrisBarChartFreeChargeDevice('chart_free_by_device', cf_device_data);
            }
            
            $('#spinner_loader').hide();
            $('#spinner_loader_img').removeClass('preloader__spinner');
        }, 1000);
        
        this.blur();
        return false;
    });
    
    // jquery datatables initialize ////////////////////////////////////////////
    ct_table = $('#tbl_ct_raw_data_list').DataTable({ responsive: true, paging: false, bInfo: false, searching: false, order: [[ 3, "desc" ]] });
    cf_table = $('#tbl_cf_raw_data_list').DataTable({ responsive: true, paging: false, bInfo: false, searching: false, order: [[ 3, "desc" ]] });

    // datepicker
    $('#start_date').datepicker();
    $('#end_date').datepicker();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getLoginInfo() {
    var login_name = sessionStorage.getItem('ss_rpts_loginName');
    $('#login_user').html(login_name + " <span class=\"caret\"></span>");
    
    $('#pg_title').html("Pharos");
    $('#pg_sub_title').html("Pharos Students Printer and Copier Dashboard");
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
function emptyTotalPagesSection() {
    $('#ct_month_pages').html("Total Pages: ");
    $('#ct_month_cost').html("Total Cost: ");
    $('#chart_total_by_month').empty();
    
    $('#ct_device_pages').html("Total Pages: ");
    $('#ct_device_cost').html("Total Cost: ");
    $('#chart_total_by_device').empty();
    
    ct_table.clear();
    ct_table.draw();
}

function emptyFreeOfChargeSection() {
    $('#cf_month_pages').html("Total Pages: ");
    $('#chart_free_by_month').empty();
    
    $('#cf_device_pages').html("Total Pages: ");
    $('#chart_free_by_device').empty();
    
    cf_table.clear();
    cf_table.draw();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function setHeaderSectionTitle() {
    if ($('#rpt_college').val() === "All") {
        $('#ct_header_title').html("IVC/Saddleback Students Total Pages/Cost included all $0.00 and other unknown charges");
        $('#cf_header_title').html("IVC/Saddleback Free of Charge");
    }
    else if ($('#rpt_college').val() === "IVC") {
        $('#ct_header_title').html("IVC Students Total Pages/Cost included all $0.00 and other unknown charges");
        $('#cf_header_title').html("IVC Free of Charge");
    }
    else if ($('#rpt_college').val() === "Saddleback") {
        $('#ct_header_title').html("Saddleback Students Total Pages/Cost included all $0.00 and other unknown charges");
        $('#cf_header_title').html("Saddleback Free of Charge");
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function pharos_getIVCTotalPagesCost(start_date, end_date, college) {
    var result = new Array(); 
    result = phar_getIVCTotalPagesCost(start_date, end_date, college);
    
    ct_month_data = [];
    var ct_total_pages = 0;
    var ct_total_cost = 0.00;
    
    for (var i = 0; i < result.length; i++) {    
        ct_total_pages += Number(result[i]['TotalPages']);
        ct_total_cost += Number(result[i]['TotalCost']);
        ct_month_data.push({ month: result[i]['RptMonth'] + ' ' + result[i]['RptYear'], tpages: Number(result[i]['TotalPages']), tcost: Number(result[i]['TotalCost']) });
    }
    
    $('#ct_month_pages').html("Total Pages: " + ct_total_pages);
    $('#ct_month_cost').html("Total Cost: " + formatDollar(ct_total_cost, 2));
}

function drawMorrisBarChartTotalPagesCost(chart_section, chart_data) {
    $('#' + chart_section).empty();

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
function pharos_getIVCTotalPagesCostDevice(start_date, end_date, college) {
    var result = new Array(); 
    result = phar_getIVCTotalPagesCostDevice(start_date, end_date, college);

    ct_device_data = [];
    var ct_device_pages = 0;
    var ct_device_cost = 0.00;
    
    for (var i = 0; i < result.length; i++) { 
        ct_device_pages += Number(result[i]['TotalPages']);
        ct_device_cost += Number(result[i]['TotalCost']);
        ct_device_data.push({ device: result[i]['Device'], tpages: Number(result[i]['TotalPages']), tcost: Number(result[i]['TotalCost']) });
    }
    
    $('#ct_device_pages').html("Total Pages: " + ct_device_pages);
    $('#ct_device_cost').html("Total Cost: " + formatDollar(ct_device_cost, 2));
}

function drawMorrisBarChartTotalPagesCostDevice(chart_section, chart_data) {   
    $('#' + chart_section).empty();

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
function pharos_getIVCFreeCharge(start_date, end_date, college) {
    var result = new Array(); 
    result = phar_getIVCFreeCharge(start_date, end_date, college);
    
    cf_month_data = [];
    var cf_total_pages = 0;

    for (var i = 0; i < result.length; i++) {  
        cf_total_pages += Number(result[i]['TotalPages']);
        cf_month_data.push({ month: result[i]['RptMonth'] + ' ' + result[i]['RptYear'], tpages: Number(result[i]['TotalPages']) });
    }
    
    $('#cf_month_pages').html("Total Pages: " + cf_total_pages);
}

function drawMorrisBarChartFreeCharge(chart_section, chart_data) {
    $('#' + chart_section).empty();
    
    Morris.Bar({
        element: chart_section,
        data: chart_data,
        xkey: 'month',
        xLabelMargin: 10,
        ykeys: ['tpages'],
        labels: ['Pages'],
        hideHover: 'auto',
        resize: true, //defaulted to true
        gridLineColor: '#eeeeee',
        barSizeRatio: 0.4,
        barColors: ['#009933'],
        redraw: true
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function pharos_getIVCFreeChargeDevice(start_date, end_date, college) {
    var result = new Array(); 
    result = phar_getIVCFreeChargeDevice(start_date, end_date, college);

    cf_device_data = [];
    var cf_device_pages = 0;

    for (var i = 0; i < result.length; i++) {  
        cf_device_pages += Number(result[i]['TotalPages']);
        cf_device_data.push({ device: result[i]['Device'], tpages: Number(result[i]['TotalPages']) });
    }
    
    $('#cf_device_pages').html("Total Pages: " + cf_device_pages);
}

function drawMorrisBarChartFreeChargeDevice(chart_section, chart_data) {
    $('#' + chart_section).empty();

    Morris.Bar({
        element: chart_section,
        data: chart_data,
        xkey: 'device',
        xLabelMargin: 10,
        ykeys: ['tpages'],
        labels: ['Pages'],
        hideHover: 'auto',
        resize: true, //defaulted to true
        gridLineColor: '#eeeeee',
        barSizeRatio: 0.4,
        barColors: ['#009933'],
        redraw: true
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function pharos_getIVCTotalPagesCostRawData(start_date, end_date, college) {
    var result = new Array(); 
    result = phar_getIVCTotalPagesCostRawData(start_date, end_date, college);
    
    ct_table.clear();
    ct_table.rows.add(result).draw();
}

function pharos_getIVCFreeChargeRawData(start_date, end_date, college) {
    var result = new Array(); 
    result = phar_getIVCFreeChargeRawData(start_date, end_date, college);
    
    cf_table.clear();
    cf_table.rows.add(result).draw();
}