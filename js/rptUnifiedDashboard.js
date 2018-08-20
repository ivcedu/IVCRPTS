var result_data = new Array();

var ctx_bar_chart_volume;
var dashboard_bar_chart_volume;

var ctx_bar_chart_cost;
var dashboard_bar_chart_cost;

var ctx_pie_chart_source_volume;
var dashboard_pie_chart_source_volume;

var ctx_pie_chart_source_cost;
var dashboard_pie_chart_source_cost;

var ctx_pie_chart_bwc_volume;
var dashboard_pie_chart_bwc_volume;

//var ctx_pie_chart_bwc_cost;
//var dashboard_pie_chart_bwc_cost;

var bar_chart_total_pages = 0;
var bar_chart_total_cost = 0.00;

var month_lable = [];
    
var dups_data_volumn = [];
var pharos_data_volumn = [];
var beacon_data_volumn = [];

var dups_data_cost = [];
var pharos_data_cost = [];
var beacon_data_cost = [];

var pie_source_lable = ['Duplicating', 'Pharos (Copier)', 'Beacon (Printer)'];
var pie_source_data_volume = [];
var pie_source_data_cost = [];

var pie_bwc_lable = ['B/W', 'Color'];
var pie_bwc_data = [];
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function() {
    if (sessionStorage.key(0) !== null) {
        getLoginInfo();
        isLoginAdmin();
        getDefaultStartEndDate();

        unifiedGetDashboardData();
        
        setDataSourceBarChart();
        drawDashboardBarChartVolume(bar_chart_total_pages, month_lable, dups_data_volumn, pharos_data_volumn, beacon_data_volumn);
        
        setDataSourcePieChartSource();
        drawDashboardPieChartSourceVolume(pie_source_lable, pie_source_data_volume);
        
        setDataSourcePieChartBWC();
        drawDashboardPieChartBWCVolume(pie_bwc_lable, pie_bwc_data);
    }
    else {
        window.open('login.html', '_self');
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {    
    // spark 1.1 initialization ///////////////////////////////////////////////
    Spark.init();
    
    // jquery chart.js initialize //////////////////////////////////////////////
    ctx_bar_chart_volume = $("#chart_bar_volume").get(0).getContext("2d");
    ctx_bar_chart_cost = $("#chart_bar_cost").get(0).getContext("2d");
    
    ctx_pie_chart_source_volume = $("#chart_pie_source_volume").get(0).getContext("2d");
    ctx_pie_chart_source_cost = $("#chart_pie_source_cost").get(0).getContext("2d");
    
    ctx_pie_chart_bwc_volume = $("#chart_pie_bwc_volume").get(0).getContext("2d");
//    ctx_pie_chart_bwc_cost = $("#chart_pie_bwc_cost").get(0).getContext("2d");
    
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
        startSpinning();
        setTimeout(function() {
            var tmp = $("ul#bar_chart_tabs li.active").attr('id');
            
            unifiedGetDashboardData();
            
            setDataSourceBarChart();
            if ($("ul#bar_chart_tabs li.active").attr('id') === "bar_chart_tab_volume") {
                drawDashboardBarChartVolume(bar_chart_total_pages, month_lable, dups_data_volumn, pharos_data_volumn, beacon_data_volumn);
            }
            else if ($("ul#bar_chart_tabs li.active").attr('id') === "bar_chart_tab_cost") {
                drawDashboardBarChartCost(bar_chart_total_cost, month_lable, dups_data_cost, pharos_data_cost, beacon_data_cost);
            }
            
            setDataSourcePieChartSource();
            if ($("ul#pie_chart_source_tabs li.active").attr('id') === "pie_chart_source_tab_volume") {
                drawDashboardPieChartSourceVolume(pie_source_lable, pie_source_data_volume);
            }
            else if ($("ul#pie_chart_source_tabs li.active").attr('id') === "pie_chart_source_tab_cost") {
                drawDashboardPieChartSourceCost(pie_source_lable, pie_source_data_cost);
            }
            
            setDataSourcePieChartBWC();
            if ($("ul#pie_chart_bwc_tabs li.active").attr('id') === "pie_chart_bwc_tab_volume") {
                drawDashboardPieChartBWCVolume(pie_bwc_lable, pie_bwc_data);
            }
//            else if ($("ul#pie_chart_bwc_tabs li.active").attr('id') === "pie_chart_bwc_cost") {
//                drawDashboardPieChartBWCCost(pie_bwc_lable, pie_bwc_data);
//            }
            
            stopSpinning();
        }, 1500);
        
        return false;
    });
    
    // bar chart tab click event //////////////////////////////////////////////
    $('#bar_chart_tabs a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        var target = $(e.target).attr("href");

        if (target === "#bar_chart_volume") {
            drawDashboardBarChartVolume(bar_chart_total_pages, month_lable, dups_data_volumn, pharos_data_volumn, beacon_data_volumn);
        }
        else if (target === "#bar_chart_cost") {
            drawDashboardBarChartCost(bar_chart_total_cost, month_lable, dups_data_cost, pharos_data_cost, beacon_data_cost);
        }
        
        return false;
    });
    
    // source pie chart tab click event ///////////////////////////////////////
    $('#pie_chart_source_tabs a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        var target = $(e.target).attr("href");

        if (target === "#pie_chart_source_volumn") {
            drawDashboardPieChartSourceVolume(pie_source_lable, pie_source_data_volume);
        }
        else if (target === "#pie_chart_source_cost") {
            drawDashboardPieChartSourceCost(pie_source_lable, pie_source_data_cost);
        }
        
        return false;
    });
    
    // B/W pie chart tab click event //////////////////////////////////////////
//    $('#pie_chart_bwc_tabs a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
//        var target = $(e.target).attr("href");
//
//        if (target === "#pie_chart_bwc_volumn") {
//            drawDashboardPieChartBWCVolume(pie_bwc_lable, pie_bwc_data);
//        }
//        else if (target === "#pie_chart_bwc_cost") {
//            drawDashboardPieChartBWCCost(pie_bwc_lable, pie_bwc_data);
//        }
//        
//        return false;
//    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function startSpinning() {
    $('.panel').css('opacity', '0.5');
    $('#spinner_loader_img').addClass('preloader__spinner');
    $('#spinner_loader').show();
}

function stopSpinning() {
    $('.panel').css('opacity', '1');
    $('#spinner_loader_img').removeClass('preloader__spinner');
    $('#spinner_loader').hide();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getLoginInfo() {
    var login_name = sessionStorage.getItem('ss_rpts_loginName');
    $('#login_user').html(login_name + " <span class=\"caret\"></span>");
    
    $('#pg_title').html("Unified Report");
    $('#pg_sub_title').html("IVC Unified Report Dashboard");
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
function unifiedGetDashboardData() {
    var start_date = getFirstDateOfMonthYear($('#start_date').find('input').val());
    var end_date = getLastDateOfMonthYear($('#end_date').find('input').val());
    
    var result_dups = new Array(); 
    result_dups = unified_getDashboardDups(start_date, end_date);
    
    var result_pharos = new Array(); 
    result_pharos = unified_getDashboardPharos(start_date, end_date);
    
    var result_beacon = new Array(); 
    result_beacon = unified_getDashboardBeacon(start_date, end_date);
    
    result_data.length = 0;
    result_data = result_data.concat(result_dups, result_pharos, result_beacon);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function setDataSourceBarChart() {
    var dups_total_pages = 0;
    var pharos_total_pages = 0;
    var beacon_total_pages = 0;
    
    var dups_total_cost = 0.00;
    var pharos_total_cost = 0.00;
    var beacon_total_cost = 0.00;
    
    month_lable.length = 0;
    
    dups_data_volumn.length = 0;
    pharos_data_volumn.length = 0;
    beacon_data_volumn.length = 0;
    
    dups_data_cost.length = 0;
    pharos_data_cost.length = 0;
    beacon_data_cost.length = 0;
    
    for (var i = 0; i < result_data.length; i++) {        
        if (result_data[i]['DataSource'] === "Duplicating") {
            // bar chart x-lable
            month_lable.push(result_data[i]['RptMonth'] + ' ' + result_data[i]['RptYear']);
            
            dups_total_pages += Number(result_data[i]['TotalPages']);
            dups_data_volumn.push(result_data[i]['TotalPages']);
            
            dups_total_cost += Number(result_data[i]['TotalCost']);
            dups_data_cost.push(result_data[i]['TotalCost']);
        }
        else if (result_data[i]['DataSource'] === "Pharos") {
            pharos_total_pages += Number(result_data[i]['TotalPages']);
            pharos_data_volumn.push(result_data[i]['TotalPages']);
            
            pharos_total_cost += Number(result_data[i]['TotalCost']);
            pharos_data_cost.push(result_data[i]['TotalCost']);
        }
        else if (result_data[i]['DataSource'] === "Beacon") {
            beacon_total_pages += Number(result_data[i]['TotalPages']);
            beacon_data_volumn.push(result_data[i]['TotalPages']);
            
            beacon_total_cost += Number(result_data[i]['TotalCost']);
            beacon_data_cost.push(result_data[i]['TotalCost']);
        }
    }
    
    bar_chart_total_pages = dups_total_pages + pharos_total_pages + beacon_total_pages;
    bar_chart_total_cost = dups_total_cost + pharos_total_cost + beacon_total_cost;
}

function setDataSourcePieChartSource() {
    var dups_total_pages = 0;
    var pharos_total_pages = 0;
    var beacon_total_pages = 0;
    
    var dups_total_cost = 0.00;
    var pharos_total_cost = 0.00;
    var beacon_total_cost = 0.00;
    
    for (var i = 0; i < result_data.length; i++) {
        if (result_data[i]['DataSource'] === "Duplicating") {
            dups_total_pages += Number(result_data[i]['TotalPages']);
            dups_total_cost += Number(result_data[i]['TotalCost']);
        }
        else if (result_data[i]['DataSource'] === "Pharos") {
            pharos_total_pages += Number(result_data[i]['TotalPages']);
            pharos_total_cost += Number(result_data[i]['TotalCost']);
        }
        else if (result_data[i]['DataSource'] === "Beacon") {
            beacon_total_pages += Number(result_data[i]['TotalPages']);
            beacon_total_cost += Number(result_data[i]['TotalCost']);
        }
    }

    pie_source_data_volume.length = 0;
    pie_source_data_cost.length = 0;
    
    pie_source_data_volume = [dups_total_pages, pharos_total_pages, beacon_total_pages];
    pie_source_data_cost = [dups_total_cost, pharos_total_cost, beacon_total_cost];
}

function setDataSourcePieChartBWC() {
    var bw_pages = 0;
    var color_pages = 0;
    
    for (var i = 0; i < result_data.length; i++) {
        bw_pages += Number(result_data[i]['MonoPages']);
        color_pages += Number(result_data[i]['ColorPages']);
    }
    
    pie_bwc_data.length = 0;
    pie_bwc_data = [bw_pages, color_pages];
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function drawDashboardBarChartVolume(total_pages, month_lable, dups_data, pharos_data, beacon_data) { 
    var barOptions = {
        scales: {
            yAxes: [{
                display: true,
                ticks: { beginAtZero: true }
            }]
        },
        scaleShowGridLines : true,
        scaleGridLineColor : "rgba(0,0,0,0.05)",
        scaleGridLineWidth : 1,
        barShowStroke : true,
        barStrokeWidth : 2,
        barValueSpacing : 25,
        barDatasetSpacing : 1,
        responsive: true
    };
    
    var barData = {
        labels: month_lable,
        datasets: [
            {
                label: "Duplicating",
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                fillColor: "rgba(54, 162, 235, 0.5)",
                strokeColor: "rgba(54, 162, 235, 0.8)",
                highlightFill: "rgba(54, 162, 235, 0.75)",
                highlightStroke: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                data: dups_data
            },
            {
                label: "Pharos (Copier)",
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                fillColor: "rgba(75, 192, 192, 0.5)",
                strokeColor: "rgba(75, 192, 192, 0.8)",
                highlightFill: "rgba(75, 192, 192, 0.75)",
                highlightStroke: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                data: pharos_data
            },
            {
                label: "Beacon (Printer)",
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                fillColor: "rgba(255, 159, 64, 0.5)",
                strokeColor: "rgba(255, 159, 64, 0.8)",
                highlightFill: "rgba(255, 159, 64, 0.75)",
                highlightStroke: "rgba(255, 159, 64, 1)",
                borderWidth: 1,
                data: beacon_data
            }
        ]
    };
    
    if (dashboard_bar_chart_volume !== undefined) {
        dashboard_bar_chart_volume.destroy();
    }

    $('#total_pages').html("Total Pages: " + total_pages);
    dashboard_bar_chart_volume = new Chart(ctx_bar_chart_volume, { type: 'bar', data: barData, options: barOptions });
}

function drawDashboardBarChartCost(total_cost, month_lable, dups_data, pharos_data, beacon_data) {
    var barOptions = {
        scales: {
            yAxes: [{
                display: true,
                ticks: { beginAtZero: true }
            }]
        },
        scaleShowGridLines : true,
        scaleGridLineColor : "rgba(0,0,0,0.05)",
        scaleGridLineWidth : 1,
        barShowStroke : true,
        barStrokeWidth : 2,
        barValueSpacing : 25,
        barDatasetSpacing : 1,
        responsive: true,
        tooltips: {
            callbacks: {
                label:function(tooltipItem, data){
                    var label = data.datasets[tooltipItem.datasetIndex].label || '';
                    return label + ': $' + tooltipItem.yLabel.toFixed(2).toString();
                }
            }
        }
    };
    
    var barData = {
        labels: month_lable,
        datasets: [
            {
                label: "Duplicating",
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                fillColor: "rgba(54, 162, 235, 0.5)",
                strokeColor: "rgba(54, 162, 235, 0.8)",
                highlightFill: "rgba(54, 162, 235, 0.75)",
                highlightStroke: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                data: dups_data
            },
            {
                label: "Pharos (Copier)",
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                fillColor: "rgba(75, 192, 192, 0.5)",
                strokeColor: "rgba(75, 192, 192, 0.8)",
                highlightFill: "rgba(75, 192, 192, 0.75)",
                highlightStroke: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                data: pharos_data
            },
            {
                label: "Beacon (Printer)",
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                fillColor: "rgba(255, 159, 64, 0.5)",
                strokeColor: "rgba(255, 159, 64, 0.8)",
                highlightFill: "rgba(255, 159, 64, 0.75)",
                highlightStroke: "rgba(255, 159, 64, 1)",
                borderWidth: 1,
                data: beacon_data
            }
        ]
    };
    
    if (dashboard_bar_chart_cost !== undefined) {
        dashboard_bar_chart_cost.destroy();
    }

    $('#total_cost').html("Total Cost: $" + total_cost.toFixed(2));
    dashboard_bar_chart_cost = new Chart(ctx_bar_chart_cost, { type: 'bar', data: barData, options: barOptions });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function drawDashboardPieChartSourceVolume(source_lable, source_data) {
    var pieOptions = {
        responsive: true,
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    var allData = data.datasets[tooltipItem.datasetIndex].data;
                    var tooltipLabel = data.labels[tooltipItem.index];
                    var tooltipData = allData[tooltipItem.index];
                    var total = 0;
                    for (var i in allData) {
                        total += allData[i];
                    }
                    var tooltipPercentage = Math.round((tooltipData / total) * 100);
                    return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage + '%)';
                }
            }
        }
    };
    
    var pieData = {
        labels: source_lable,
        datasets: [
            {
                backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(75, 192, 192, 0.5)', 'rgba(255, 159, 64, 0.5)'],
                hoverBackgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(255, 159, 64, 0.7)'],
                strokeColor: ['rgba(54, 162, 235, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(255, 159, 64, 0.8)'],
                highlightFill: ['rgba(54, 162, 235, 0.75)', 'rgba(75, 192, 192, 0.75)', 'rgba(255, 159, 64, 0.75)'],
                highlightStroke: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)'],
                data: source_data
            }
        ]
    };
    
    if (dashboard_pie_chart_source_volume !== undefined) {
        dashboard_pie_chart_source_volume.destroy();
    }

    dashboard_pie_chart_source_volume = new Chart(ctx_pie_chart_source_volume, { type: 'pie', data: pieData, options: pieOptions });
}

function drawDashboardPieChartSourceCost(source_lable, source_data) {
    var pieOptions = {
        responsive: true,
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    var allData = data.datasets[tooltipItem.datasetIndex].data;
                    var tooltipLabel = data.labels[tooltipItem.index];
                    var tooltipData = allData[tooltipItem.index];
                    var total = 0;
                    for (var i in allData) {
                        total += allData[i];
                    }
                    var tooltipPercentage = Math.round((tooltipData / total) * 100);
                    return tooltipLabel + ': $' + tooltipData.toFixed(2) + ' (' + tooltipPercentage + '%)';
                }
            }
        }
    };
    
    var pieData = {
        labels: source_lable,
        datasets: [
            {
                backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(75, 192, 192, 0.5)', 'rgba(255, 159, 64, 0.5)'],
                hoverBackgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(255, 159, 64, 0.7)'],
                strokeColor: ['rgba(54, 162, 235, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(255, 159, 64, 0.8)'],
                highlightFill: ['rgba(54, 162, 235, 0.75)', 'rgba(75, 192, 192, 0.75)', 'rgba(255, 159, 64, 0.75)'],
                highlightStroke: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)'],
                data: source_data
            }
        ]
    };
    
    if (dashboard_pie_chart_source_cost !== undefined) {
        dashboard_pie_chart_source_cost.destroy();
    }

    dashboard_pie_chart_source_cost = new Chart(ctx_pie_chart_source_cost, { type: 'pie', data: pieData, options: pieOptions });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function drawDashboardPieChartBWCVolume(source_lable, source_data) {
    var pieOptions = {
        responsive: true,
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    var allData = data.datasets[tooltipItem.datasetIndex].data;
                    var tooltipLabel = data.labels[tooltipItem.index];
                    var tooltipData = allData[tooltipItem.index];
                    var total = 0;
                    for (var i in allData) {
                        total += allData[i];
                    }
                    var tooltipPercentage = Math.round((tooltipData / total) * 100);
                    return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage + '%)';
                }
            }
        }
    };
    
    var pieData = {
        labels: source_lable,
        datasets: [
            {
                backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)'],
                hoverBackgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(255, 99, 132, 0.7)'],
                strokeColor: ['rgba(54, 162, 235, 0.8)', 'rgba(255, 99, 132, 0.8)'],
                highlightFill: ['rgba(54, 162, 235, 0.75)', 'rgba(255, 99, 132, 0.75)'],
                highlightStroke: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                data: source_data
            }
        ]
    };
    
    if (dashboard_pie_chart_bwc_volume !== undefined) {
        dashboard_pie_chart_bwc_volume.destroy();
    }

    dashboard_pie_chart_bwc_volume = new Chart(ctx_pie_chart_bwc_volume, { type: 'pie', data: pieData, options: pieOptions });
}

//function drawDashboardPieChartBWCCost(source_lable, source_data) {
//    var pieOptions = {
//        responsive: true,
//        tooltips: {
//            callbacks: {
//                label: function(tooltipItem, data) {
//                    var allData = data.datasets[tooltipItem.datasetIndex].data;
//                    var tooltipLabel = data.labels[tooltipItem.index];
//                    var tooltipData = allData[tooltipItem.index];
//                    var total = 0;
//                    for (var i in allData) {
//                        total += allData[i];
//                    }
//                    var tooltipPercentage = Math.round((tooltipData / total) * 100);
//                    return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage + '%)';
//                }
//            }
//        }
//    };
//    
//    var pieData = {
//        labels: source_lable,
//        datasets: [
//            {
//                backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)'],
//                hoverBackgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(255, 99, 132, 0.7)'],
//                strokeColor: ['rgba(54, 162, 235, 0.8)', 'rgba(255, 99, 132, 0.8)'],
//                highlightFill: ['rgba(54, 162, 235, 0.75)', 'rgba(255, 99, 132, 0.75)'],
//                highlightStroke: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
//                data: source_data
//            }
//        ]
//    };
//    
//    if (dashboard_pie_chart_bwc_cost !== undefined) {
//        dashboard_pie_chart_bwc_cost.destroy();
//    }
//
//    dashboard_pie_chart_bwc_cost = new Chart(ctx_pie_chart_bwc_cost, { type: 'pie', data: pieData, options: pieOptions });
//}