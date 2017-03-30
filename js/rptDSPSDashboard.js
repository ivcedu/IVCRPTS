var ctx_month;
var booked_by_month_chart;
var month_lable;
var month_data;

var ctx_weekday;
var booked_by_weekday_chart;
var weekday_lable;
var weekday_data;

var ctx_status;
var status_pie_chart;
var status_lable;
var status_data;

var ctx_steps;
var step_pie_chart;
var step_lable;
var step_data;

var rd_table;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function() {
    if (sessionStorage.key(0) !== null) {
        getLoginInfo();
        isLoginAdmin();
        getDefaultStartEndDate();

        dsps_TabByMonthSection($('#start_date').val(), $('#end_date').val());
        drawBarChartJSByMonth();
        
        dsps_TabByWeekDaySection($('#start_date').val(), $('#end_date').val());
        drawBarChartJSByWeekDay();
        
        dsps_TabRawDataSection($('#start_date').val(), $('#end_date').val());
        
        dsps_StatusStatisticSection($('#start_date').val(), $('#end_date').val());
        drawPieChartJSStatusStatistic();
        
        dsps_StepNotCompletedSection($('#start_date').val(), $('#end_date').val());
        drawPieChartJSStepNotCompleted();
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
        dsps_TabByMonthSection($('#start_date').val(), $('#end_date').val());
        drawBarChartJSByMonth();
        
        dsps_TabByWeekDaySection($('#start_date').val(), $('#end_date').val());
        drawBarChartJSByWeekDay();
        
        dsps_TabRawDataSection($('#start_date').val(), $('#end_date').val());
        
        dsps_StatusStatisticSection($('#start_date').val(), $('#end_date').val());
        drawPieChartJSStatusStatistic();
        
        dsps_StepNotCompletedSection($('#start_date').val(), $('#end_date').val());
        drawPieChartJSStepNotCompleted();
        
        this.blur();
        return false;
    });
    
    // jquery chart.js initialize //////////////////////////////////////////////
    ctx_month = $("#chart_by_month").get(0).getContext("2d");
    ctx_weekday = $("#chart_by_weekday").get(0).getContext("2d");
    ctx_status = $("#chart_by_status").get(0).getContext("2d");
    ctx_steps = $("#chart_by_steps").get(0).getContext("2d");
    
    // jquery datatables initialize ////////////////////////////////////////////
    rd_table = $('#tbl_raw_data_list').DataTable({ responsive: true, paging: false, bInfo: false });

    // datepicker
    $('#start_date').datepicker();
    $('#end_date').datepicker();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getLoginInfo() {
    var login_name = sessionStorage.getItem('ss_rpts_loginName');
    $('#login_user').html(login_name + " <span class=\"caret\"></span>");
    
    $('#pg_title').html("DSPS Exam");
    $('#pg_sub_title').html("IVC DSPS Exam Proctoring Dashboard");
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
function dsps_TabByMonthSection(start_date, end_date) {
    var result = new Array(); 
    result = dsps_getNumBookedByMonth(start_date, end_date);
    
    month_lable = [];
    month_data = [];
    var month_total_booked = 0;
    
    for (var i = 0; i < result.length; i++) {    
        month_total_booked += Number(result[i]['NumBooked']);
        month_lable.push(result[i]['RptMonth'] + ' ' + result[i]['RptYear']);
        month_data.push(result[i]['NumBooked']);
    }
    
    $('#month_total_booked').html("Total Booked: " + month_total_booked);
}

function drawBarChartJSByMonth() {
    var barOptions = {
        scaleBeginAtZero : true,
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
                label: "Booked",
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                fillColor: "rgba(54, 162, 235, 0.5)",
                strokeColor: "rgba(54, 162, 235, 0.8)",
                highlightFill: "rgba(54, 162, 235, 0.75)",
                highlightStroke: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                data: month_data
            }
        ]
    };
    
    if (booked_by_month_chart !== undefined) {
        booked_by_month_chart.destroy();
    }

    booked_by_month_chart = new Chart(ctx_month, { type: 'bar', data: barData, options: barOptions });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function dsps_TabByWeekDaySection(start_date, end_date) {
    var result = new Array(); 
    result = dsps_getNumBookedByWeekDay(start_date, end_date);
    
    weekday_lable = [];
    weekday_data = [];
    var weekday_total_booked = 0;
    
    for (var i = 0; i < result.length; i++) {    
        weekday_total_booked += Number(result[i]['NumBooked']);
        weekday_lable.push(result[i]['RptWeekday']);
        weekday_data.push(result[i]['NumBooked']);
    }
    
    $('#weekday_total_booked').html("Total Booked: " + weekday_total_booked);
}

function drawBarChartJSByWeekDay() {
    var barOptions = {
        scaleBeginAtZero : true,
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
        labels: weekday_lable,
        datasets: [
            {
                label: "Booked",
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                fillColor: "rgba(75, 192, 192, 0.5)",
                strokeColor: "rgba(75, 192, 192, 0.8)",
                highlightFill: "rgba(75, 192, 192, 0.75)",
                highlightStroke: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                data: weekday_data
            }
        ]
    };
    
    if (booked_by_weekday_chart !== undefined) {
        booked_by_weekday_chart.destroy();
    }

    booked_by_weekday_chart = new Chart(ctx_weekday, { type: 'bar', data: barData, options: barOptions });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function dsps_TabRawDataSection(start_date, end_date) {
    var result = new Array(); 
    result = dsps_getNumBookedRawData(start_date, end_date);
    
    rd_table.clear();
    rd_table.rows.add(result).draw();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function dsps_StatusStatisticSection(start_date, end_date) {
    var result = new Array(); 
    result = dsps_getNumStatusStatistics(start_date, end_date);
    
    status_lable = [];
    status_data = [];
    
    for (var i = 0; i < result.length; i++) {    
        status_lable.push(result[i]['RptStatus']);
        status_data.push(Number(result[i]['TotalCount']));
    }
}

function drawPieChartJSStatusStatistic() {
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
        labels: status_lable,
        datasets: [
            {
                label: "Status",
                backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 159, 64, 0.5)', 'rgba(255, 99, 132, 0.5)'],
                hoverBackgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(255, 159, 64, 0.7)', 'rgba(255, 99, 132, 0.7)'],
                strokeColor: ['rgba(54, 162, 235, 0.8)', 'rgba(255, 159, 64, 0.8)', 'rgba(255, 99, 132, 0.8)'],
                highlightFill: ['rgba(54, 162, 235, 0.75)', 'rgba(255, 159, 64, 0.75)', 'rgba(255, 99, 132, 0.75)'],
                highlightStroke: ['rgba(54, 162, 235, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)'],
                data: status_data
            }
        ]
    };
    
    if (status_pie_chart !== undefined) {
        status_pie_chart.destroy();
    }

    status_pie_chart = new Chart(ctx_status, { type: 'pie', data: pieData, options: pieOptions });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function dsps_StepNotCompletedSection(start_date, end_date) {
    var result = new Array(); 
    result = dsps_getNumStepNotCompleted(start_date, end_date);
    
    step_lable = [];
    step_data = [];
    
    for (var i = 0; i < result.length; i++) {    
        step_lable.push(result[i]['RptStep']);
        step_data.push(Number(result[i]['TotalCount']));
    }
}

function drawPieChartJSStepNotCompleted() {
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
        labels: step_lable,
        datasets: [
            {
                label: "Status",
                backgroundColor: ['rgba(153, 102, 255, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)'],
                hoverBackgroundColor: ['rgba(153, 102, 255, 0.7)', 'rgba(255, 206, 86, 0.7)', 'rgba(75, 192, 192, 0.7)'],
                strokeColor: ['rgba(153, 102, 255, 0.8)', 'rgba(255, 206, 86, 0.8)', 'rgba(75, 192, 192, 0.8)'],
                highlightFill: ['rgba(153, 102, 255, 0.75)', 'rgba(255, 206, 86, 0.75)', 'rgba(75, 192, 192, 0.75)'],
                highlightStroke: ['rgba(153, 102, 255, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
                data: step_data
            }
        ]
    };
    
    if (step_pie_chart !== undefined) {
        step_pie_chart.destroy();
    }

    step_pie_chart = new Chart(ctx_steps, { type: 'pie', data: pieData, options: pieOptions });
}