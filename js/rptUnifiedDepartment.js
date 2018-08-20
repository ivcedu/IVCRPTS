var table_all_data;
var table_beacon;
var table_pharos;
var table_dups;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function() {
    if (sessionStorage.key(0) !== null) {
        getLoginInfo();
        isLoginAdmin();
        getDefaultStartEndDate();
        
        startSpinning(".panel-heading", "100px auto");
        setTimeout(function() {
            getDepartAllDataTable();
            getDepartBeaconDataTable();
            getDepartPharosDataTable();
            getDepartDupsDataTable();
            stopSpinning();
        }, 1500);
    }
    else {
        window.open('login.html', '_self');
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {    
    // spark 1.1 initialization ///////////////////////////////////////////////
    Spark.init();
    
    // jquery datatables initialize ////////////////////////////////////////////
    table_all = $('#tbl_depart_all_data').DataTable({ paging: false, bInfo: false, responsive: true,
                                                        columnDefs:[{ className: "dt-center", targets: [0, 1, 3, 4, 5, 6] }, { orderable: false, targets: 0 }], 
                                                        order: [[ 3, "desc" ]],
                                                        dom: '<"html5buttons"B>lTfgitp',
                                                        buttons: [{ extend: 'copy'}, {extend: 'csv'}, {extend: 'excel', title: 'all_data_department'}, {extend: 'pdf', title: 'all_data_department'},
                                                                  {extend: 'print', customize: function (win){
                                                                          $(win.document.body).addClass('white-bg');
                                                                          $(win.document.body).css('font-size', '10px');
                                                                          $(win.document.body).find('table').addClass('compact').css('font-size', 'inherit');}
                                                                  }]
                                                    });
    table_beacon = $('#tbl_depart_beacon').DataTable({ paging: false, bInfo: false, responsive: true,
                                                        columnDefs:[{ className: "dt-center", targets: [0, 1, 3, 4, 5, 6] }, { orderable: false, targets: 0 }],  
                                                        order: [[ 3, "desc" ]],
                                                        dom: '<"html5buttons"B>lTfgitp',
                                                        buttons: [{ extend: 'copy'}, {extend: 'csv'}, {extend: 'excel', title: 'beacon_department'}, {extend: 'pdf', title: 'beacon_department'},
                                                                  {extend: 'print', customize: function (win){
                                                                          $(win.document.body).addClass('white-bg');
                                                                          $(win.document.body).css('font-size', '10px');
                                                                          $(win.document.body).find('table').addClass('compact').css('font-size', 'inherit');}
                                                                  }]
                                                    });
    table_pharos = $('#tbl_depart_pharos').DataTable({ paging: false, bInfo: false, responsive: true,
                                                        columnDefs:[{ className: "dt-center", targets: [0, 1, 3, 4, 5, 6] }, { orderable: false, targets: 0 }], 
                                                        order: [[ 3, "desc" ]],
                                                        dom: '<"html5buttons"B>lTfgitp',
                                                        buttons: [{ extend: 'copy'}, {extend: 'csv'}, {extend: 'excel', title: 'pharos_department'}, {extend: 'pdf', title: 'pharos_department'},
                                                                  {extend: 'print', customize: function (win){
                                                                          $(win.document.body).addClass('white-bg');
                                                                          $(win.document.body).css('font-size', '10px');
                                                                          $(win.document.body).find('table').addClass('compact').css('font-size', 'inherit');}
                                                                  }]
                                                    });
    table_dups = $('#tbl_depart_dups').DataTable({ paging: false, bInfo: false, responsive: true,
                                                        columnDefs:[{ className: "dt-center", targets: [0, 1, 3, 4, 5, 6] }, { orderable: false, targets: 0 }], 
                                                        order: [[ 3, "desc" ]],
                                                        dom: '<"html5buttons"B>lTfgitp',
                                                        buttons: [{ extend: 'copy'}, {extend: 'csv'}, {extend: 'excel', title: 'duplicating_department'}, {extend: 'pdf', title: 'duplicating_department'},
                                                                  {extend: 'print', customize: function (win){
                                                                          $(win.document.body).addClass('white-bg');
                                                                          $(win.document.body).css('font-size', '10px');
                                                                          $(win.document.body).find('table').addClass('compact').css('font-size', 'inherit');}
                                                                  }]
                                                    });

    // datepicker
    $('#start_date').datepicker({ format: "mm-yyyy", startView: 1, minViewMode: 1, startDate: getBeaconStartDate(), endDate: getBeaconEndDate(), autoclose: true });
    $('#end_date').datepicker({ format: "mm-yyyy", startView: 1, minViewMode: 1, startDate: getBeaconStartDate(), endDate: getBeaconEndDate(), autoclose: true });
    
    ///////////////////////////////////////////////////////////////////////////
    $('#nav_logout').click(function() {
        sessionStorage.clear();
        window.open('login.html', '_self');
        return false;
    });
    
    // refresh button click ///////////////////////////////////////////////////
    $('#btn_refresh').click(function() {
        startSpinning(".panel-heading", "100px auto");
        setTimeout(function() {
            getDepartAllDataTable();
            getDepartBeaconDataTable();
            getDepartPharosDataTable();
            getDepartDupsDataTable();
            stopSpinning();
        }, 1500);
        
        return false;
    });
    
    // tab click event to redraw table column for firefox and IE ///////////////
    $('#depart_tabs a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        var target = $(e.target).attr("href");

        if (target === "#tab_all_data_section") {
            table_all.columns.adjust();
        }
        else if (target === "#tab_beacon_section") {
            table_beacon.columns.adjust();
        }
        else if (target === "#tab_pharos_section") {
            table_pharos.columns.adjust();
        }
        else if (target === "#tab_dups_section") {
            table_dups.columns.adjust();
        }
        
        return false;
    });
    
    // table row click /////////////////////////////////////////////////////////
    $('#tbl_depart_all_data').on( 'draw.dt', function () {
        table_all.columns.adjust();
    });
    
    $('#tbl_depart_beacon').on( 'draw.dt', function () {
        table_beacon.columns.adjust();
    });
    
    $('#tbl_depart_pharos').on( 'draw.dt', function () {
        table_pharos.columns.adjust();
    });
    
    $('#tbl_depart_dups').on( 'draw.dt', function () {
        table_dups.columns.adjust();
    });
    
    // table row click /////////////////////////////////////////////////////////
    $('#tbl_depart_all_data tbody').on('click', 'a[id^="cost_center_"]', function(e) {
        e.preventDefault();
        var cost_center = $(this).attr('id').replace("cost_center_", "");  
        var tr = $(this).closest('tr');
        var row = table_all.row( tr );
        
        if ( row.child.isShown() ) {
            $('#cost_center_' + cost_center).children().removeClass('iconic-caret-bottom');
            $('#cost_center_' + cost_center).children().addClass('iconic-caret-right');
            
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            $('#cost_center_' + cost_center).children().removeClass('iconic-caret-right');
            $('#cost_center_' + cost_center).children().addClass('iconic-caret-bottom');
            
            var y_pos = e.pageY - 250 + "px auto";
            startSpinning(".panel-heading", y_pos);
            setTimeout(function() {
                row.child( getDepartAllDataTableHTML(cost_center) ).show();
                tr.addClass('shown');
                stopSpinning();
            }, 1500);
        }

        return false;
    });
    
    $('#tbl_depart_beacon tbody').on('click', 'a[id^="cost_center_"]', function(e) {
        e.preventDefault();
        var cost_center = $(this).attr('id').replace("cost_center_", "");  
        var tr = $(this).closest('tr');
        var row = table_beacon.row( tr );
        
        if ( row.child.isShown() ) {
            $('#cost_center_' + cost_center).children().removeClass('iconic-caret-bottom');
            $('#cost_center_' + cost_center).children().addClass('iconic-caret-right');
            
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            $('#cost_center_' + cost_center).children().removeClass('iconic-caret-right');
            $('#cost_center_' + cost_center).children().addClass('iconic-caret-bottom');
            
            var y_pos = e.pageY - 250 + "px auto";
            startSpinning(".panel-heading", y_pos);
            setTimeout(function() {
                row.child( getDepartBeaconDataTableHTML(cost_center) ).show();
                tr.addClass('shown');
                stopSpinning();
            }, 1500);
        }

        return false;
    });
    
    $('#tbl_depart_pharos tbody').on('click', 'a[id^="cost_center_"]', function(e) {
        e.preventDefault();
        var cost_center = $(this).attr('id').replace("cost_center_", "");  
        var tr = $(this).closest('tr');
        var row = table_pharos.row( tr );
        
        if ( row.child.isShown() ) {
            $('#cost_center_' + cost_center).children().removeClass('iconic-caret-bottom');
            $('#cost_center_' + cost_center).children().addClass('iconic-caret-right');
            
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            $('#cost_center_' + cost_center).children().removeClass('iconic-caret-right');
            $('#cost_center_' + cost_center).children().addClass('iconic-caret-bottom');
            
            var y_pos = e.pageY - 250 + "px auto";
            startSpinning(".panel-heading", y_pos);
            setTimeout(function() {
                row.child( getDepartPharosDataTableHTML(cost_center) ).show();
                tr.addClass('shown');
                stopSpinning();
            }, 1500);
        }

        return false;
    });
    
    $('#tbl_depart_dups tbody').on('click', 'a[id^="cost_center_"]', function(e) {
        e.preventDefault();
        var cost_center = $(this).attr('id').replace("cost_center_", "");  
        var tr = $(this).closest('tr');
        var row = table_dups.row( tr );
        
        if ( row.child.isShown() ) {
            $('#cost_center_' + cost_center).children().removeClass('iconic-caret-bottom');
            $('#cost_center_' + cost_center).children().addClass('iconic-caret-right');
            
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            $('#cost_center_' + cost_center).children().removeClass('iconic-caret-right');
            $('#cost_center_' + cost_center).children().addClass('iconic-caret-bottom');
            
            var y_pos = e.pageY - 250 + "px auto";
            startSpinning(".panel-heading", y_pos);
            setTimeout(function() {
                row.child( getDepartDupsDataTableHTML(cost_center) ).show();
                tr.addClass('shown');
                stopSpinning();
            }, 1500);
        }

        return false;
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function startSpinning(html_tag, margin_value) {
    $(html_tag).append("<div class='row' id='spinner_loader'><img src='images/spinner.svg' id='spinner_loader_img'></div>");
    
    $('.panel-body').css('opacity', '0.5');
    $('#spinner_loader_img').addClass('preloader__spinner');
    if (margin_value !== "") {
        $('.preloader__spinner').css('margin', margin_value);
    }
    $('#spinner_loader').show();
}

function stopSpinning() {
    $("#spinner_loader").remove();
    
    $('.panel-body').css('opacity', '1');
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getLoginInfo() {
    var login_name = sessionStorage.getItem('ss_rpts_loginName');
    $('#login_user').html(login_name + " <span class=\"caret\"></span>");
    
    $('#pg_title').html("Unified Report");
    $('#pg_sub_title').html("IVC Unified Report by Department");
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
    $('#start_date').datepicker( "setDate", getCalculateMonthYear(-3) );
    $('#end_date').datepicker( "setDate", getCalculateMonthYear(-1) );
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getDepartAllDataTable() {
    var start_date = getFirstDateOfMonthYear($('#start_date').find('input').val());
    var end_date = getLastDateOfMonthYear($('#end_date').find('input').val());
    
    var result = new Array();
    result = unified_getAllDataTable(start_date, end_date, "Department_Section", "");
    
    table_all.clear();
    table_all.rows.add(result).draw();
}

function getDepartBeaconDataTable() {
    var start_date = getFirstDateOfMonthYear($('#start_date').find('input').val());
    var end_date = getLastDateOfMonthYear($('#end_date').find('input').val());
    
    var result = new Array();
    result = unified_getBeaconDataTable(start_date, end_date, "Department_Section", "");
    
    table_beacon.clear();
    table_beacon.rows.add(result).draw();
}

function getDepartPharosDataTable() {
    var start_date = getFirstDateOfMonthYear($('#start_date').find('input').val());
    var end_date = getLastDateOfMonthYear($('#end_date').find('input').val());
    
    var result = new Array();
    result = unified_getPharosDataTable(start_date, end_date, "Department_Section", "");
    
    table_pharos.clear();
    table_pharos.rows.add(result).draw();
}

function getDepartDupsDataTable() {
    var start_date = getFirstDateOfMonthYear($('#start_date').find('input').val());
    var end_date = getLastDateOfMonthYear($('#end_date').find('input').val());
    
    var result = new Array();
    result = unified_getDupsDataTable(start_date, end_date, "Department_Section", "");
    
    table_dups.clear();
    table_dups.rows.add(result).draw();
}

////////////////////////////////////////////////////////////////////////////////
function getDepartAllDataTableHTML(cost_center) {
    var start_date = getFirstDateOfMonthYear($('#start_date').find('input').val());
    var end_date = getLastDateOfMonthYear($('#end_date').find('input').val());
    
    var result = new Array();
    result = unified_getAllDataTable(start_date, end_date, "CostCenter", cost_center);
    
    return insertSubRowListHTML(result);
}

function getDepartDupsDataTableHTML(cost_center) {
    var start_date = getFirstDateOfMonthYear($('#start_date').find('input').val());
    var end_date = getLastDateOfMonthYear($('#end_date').find('input').val());
    
    var result = new Array();
    result = unified_getDupsDataTable(start_date, end_date, "CostCenter", cost_center);
    
    return insertSubRowListHTML(result);
}

function getDepartPharosDataTableHTML(cost_center) {
    var start_date = getFirstDateOfMonthYear($('#start_date').find('input').val());
    var end_date = getLastDateOfMonthYear($('#end_date').find('input').val());
    
    var result = new Array();
    result = unified_getPharosDataTable(start_date, end_date, "CostCenter", cost_center);
    
    return insertSubRowListHTML(result);
}

function getDepartBeaconDataTableHTML(cost_center) {
    var start_date = getFirstDateOfMonthYear($('#start_date').find('input').val());
    var end_date = getLastDateOfMonthYear($('#end_date').find('input').val());
    
    var result = new Array();
    result = unified_getBeaconDataTable(start_date, end_date, "CostCenter", cost_center);
    
    return insertSubRowListHTML(result);
}

function insertSubRowListHTML(result) {
    var html = "<div class='row'><p>";
    html += "<div class='col-md-1'></div>";
    html += "<div class='col-md-7'><b>UserID</b></div>";
    html += "<div class='col-md-1' style='text-align: center;'><b>Total</b></div>";
    html += "<div class='col-md-1' style='text-align: center;'><b>B/W</b></div>";
    html += "<div class='col-md-1' style='text-align: center;'><b>Color</b></div>";
    html += "<div class='col-md-1' style='text-align: center;'><b>Cost</b></div>";
    html += "</p></div>";
    
    for (var i = 0; i < result.length; i++) {
        var html_tab = "<div class='col-md-1'></div>";
        var login_id = "<div class='col-md-7'>" + result[i]['LoginID'] + "</div>";
        var total_pages = "<div class='col-md-1' style='text-align: center;'>" + result[i]['TotalPages'] + "</div>";
        var mono_pages = "<div class='col-md-1' style='text-align: center;'>" + result[i]['MonoPages'] + "</div>";
        var color_pages = "<div class='col-md-1' style='text-align: center;'>" + result[i]['ColorPages'] + "</div>";
        var total_cost = "<div class='col-md-1' style='text-align: center;'>" + result[i]['TotalCost'] + "</div>";
        html += "<div class='row'><p>" + html_tab + login_id + total_pages + mono_pages + color_pages + total_cost + "</p></div>";
    }
    
    return html;
}