var cc_table;
var ur_table;
var rd_table;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function() {
    if (sessionStorage.key(0) !== null) {
        $('#spinner_loader').hide();
        getLoginInfo();
        isLoginAdmin();
        getDefaultStartEndDate();
        
        pharos_getIVCCostCenter(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"));
        pharos_getIVCCostCenterUsers(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"));
        pharos_getIVCCostCenterRawData(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"));
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
    
    // refresh button click ///////////////////////////////////////////////////
    $('#btn_refresh').click(function() {
        emptyCostCenterTables();
        
        $('.panel').css('opacity', '0.5');
        $('#spinner_loader_img').addClass('preloader__spinner');
        $('#spinner_loader').show();
        
        setTimeout(function() {
            pharos_getIVCCostCenter(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"));
            pharos_getIVCCostCenterUsers(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"));
            pharos_getIVCCostCenterRawData(convertSQLDateTimeFormat($('#start_date').datepicker("getDate"), "00:00:00.000"), convertSQLDateTimeFormat($('#end_date').datepicker("getDate"), "23:59:59.000"));
            
            $('#spinner_loader').hide();
            $('#spinner_loader_img').removeClass('preloader__spinner');
            $('.panel').css('opacity', '1');
        }, 1000);

        this.blur();
        return false;
    });
    
    // jquery datatables initialize ////////////////////////////////////////////
    cc_table = $('#tbl_cost_center_list').DataTable({ responsive: true, paging: false, bInfo: false, order: [[ 4, "desc" ]],
                                                        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                                                        "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                                                        buttons: [  {extend: 'copy', className: 'btn-sm'},
                                                                    {extend: 'csv', title: 'export_csv', className: 'btn-sm'},
                                                                    {extend: 'pdf', title: 'export_pdf', className: 'btn-sm'},
                                                                    {extend: 'print', className: 'btn-sm'}
                                                                ] });
    ur_table = $('#tbl_user_list').DataTable({ responsive: true, paging: false, bInfo: false, order: [[ 3, "desc" ]],
                                                dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                                                "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                                                buttons: [  {extend: 'copy', className: 'btn-sm'},
                                                            {extend: 'csv', title: 'export_csv', className: 'btn-sm'},
                                                            {extend: 'pdf', title: 'export_pdf', className: 'btn-sm'},
                                                            {extend: 'print', className: 'btn-sm'}
                                                        ] });
    rd_table = $('#tbl_raw_data_list').DataTable({ responsive: true, paging: false, bInfo: false, order: [[ 1, "asc" ]],
                                                    dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                                                    "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                                                    buttons: [  {extend: 'copy', className: 'btn-sm'},
                                                                {extend: 'csv', title: 'export_csv', className: 'btn-sm'},
                                                                {extend: 'pdf', title: 'export_pdf', className: 'btn-sm'},
                                                                {extend: 'print', className: 'btn-sm'}
                                                            ] });

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
    $('#pg_sub_title').html("IVC Printer and Copier Dashboard for Cost Center");
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
function emptyCostCenterTables() {
    $('#cost_center_total_pages').html("Total Pages: ");
    $('#cost_center_total_cost').html("Total Cost: ");
    cc_table.clear();
    cc_table.draw();
    
    $('#user_total_pages').html("Total Pages: ");
    $('#user_total_cost').html("Total Cost: ");
    ur_table.clear();
    ur_table.draw();
    
    $('#raw_data_total_pages').html("Total Pages: ");
    $('#raw_data_total_cost').html("Total Cost: ");
    rd_table.clear();
    rd_table.draw();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function pharos_getIVCCostCenter(start_date, end_date) {
    var result = new Array(); 
    result = phar_getIVCCostCenter(start_date, end_date);
    
    var cc_total_pages = 0;
    var cc_total_cost = 0.00;
    
    for (var i = 0; i < result.length; i++) { 
        cc_total_pages += Number(result[i]['TotalPages']);
        cc_total_cost += Number(result[i]['TotalCost'].replace("$", "").replace(",", ""));
    }
    
    $('#cost_center_total_pages').html("Total Pages: " + cc_total_pages);
    $('#cost_center_total_cost').html("Total Cost: " + formatDollar(cc_total_cost, 2));
    
    cc_table.clear();
    cc_table.rows.add(result).draw();
}

function pharos_getIVCCostCenterUsers(start_date, end_date) {
    var result = new Array(); 
    result = phar_getIVCCostCenterUsers(start_date, end_date);
    
    var ur_total_pages = 0;
    var ur_total_cost = 0.00;
    
    for (var i = 0; i < result.length; i++) { 
        ur_total_pages += Number(result[i]['TotalPages']);
        ur_total_cost += Number(result[i]['TotalCost'].replace("$", "").replace(",", ""));
    }
    
    $('#user_total_pages').html("Total Pages: " + ur_total_pages);
    $('#user_total_cost').html("Total Cost: " + formatDollar(ur_total_cost, 2));
    
    ur_table.clear();
    ur_table.rows.add(result).draw();
}

function pharos_getIVCCostCenterRawData(start_date, end_date) {
    var result = new Array(); 
    result = phar_getIVCCostCenterRawData(start_date, end_date);
    
    var rd_total_pages = 0;
    var rd_total_cost = 0.00;
    
    for (var i = 0; i < result.length; i++) { 
        rd_total_pages += Number(result[i]['TotalPages']);
        rd_total_cost += Number(result[i]['TotalCost'].replace("$", "").replace(",", ""));
    }
    
    $('#raw_data_total_pages').html("Total Pages: " + rd_total_pages);
    $('#raw_data_total_cost').html("Total Cost: " + formatDollar(rd_total_cost, 2));
    
    rd_table.clear();
    rd_table.rows.add(result).draw();
}