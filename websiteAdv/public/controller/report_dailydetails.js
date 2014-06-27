/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
  'use strict';

  require('daterangepicker-css');
  require('daterangepicker');
  require("datatables");
  var navigation = require('../lib/navigation');

  module.exports = function(app){
    //Step6: use `app.register` to register controller/service/directive/filter
    app.register.controller('report_dailydetails', ['$scope', '$routeParams', '$location', '$http',
      function($scope, $routeParams, $location, $http){
        navigation.navigate();

        $scope.campaignId = $routeParams.campaignId;
        $scope.adgroupId = $routeParams.adgroupId;
        $scope.creativeId = $routeParams.creativeId;

        $scope.chartData = {
          pv:[],
          clk:[],
          ctr:[],
          acp:[],
          cost:[]
        }

        var req_type, req_key;

        $scope.endDate = moment().format('YYYY-MM-DD');
        var startDate = moment().subtract('days', 6);
        $scope.startDate = startDate.format('YYYY-MM-DD');
        var dateRange = [startDate.format('YYYY-MM-DD')];
        for(var i = 1; i <= 6; i++){
          dateRange.push(startDate.add('days', 1).format('YYYY-MM-DD'));
        }
        $scope.daterangeOptions = {
          ranges: {
             '今天': [moment(), moment()],
             '昨天': [moment().subtract('days', 1), moment().subtract('days', 1)],
             '过去7天': [moment().subtract('days', 6), moment()],
             '过去30天': [moment().subtract('days', 29), moment()],
             '过去3个月': [moment().subtract('days', 89), moment()]
          },
          startDate: moment().subtract('days', 6),
          endDate: moment()
        };
        $scope.dateRangeCallback = function(start, end) {
          $('#reportrange span').html(start.format('YYYY-MM-DD') + ' 至 ' + end.format('YYYY-MM-DD'));
          var diff = end.diff(start, 'days');
          dateRange = [start.format('YYYY-MM-DD')];
          for(var i = 1; i <= diff; i++){
            dateRange.push(start.add('days', 1).format('YYYY-MM-DD'));
          }
          getReport();
        };

        if($scope.creativeId && $scope.adgroupId && $scope.campaignId){
          $http.get('/restful/campaigns/'+$scope.campaignId).success(function(ret_data) {
            if(ret_data.success){
              $scope.campaign_info = ret_data.data;
            }
          });
          $http.get('/restful/adgroups/'+$scope.adgroupId).success(function(ret_data) {
            if(ret_data.success){
              $scope.adgroup_info = ret_data.data;
            }
          });
          $http.get('/restful/creative?creative_id='+$scope.creativeId).success(function(ret_data) {
            if(ret_data.success){
              $scope.creative_info = ret_data.data[0];
              $scope.list_title = $scope.creative_info.title;
            }
          });
          $(".adgroup-nav").css("display","inline-block");
          $(".creative-nav").css("display","inline-block");
          req_type = 4;
          req_key = $scope.creativeId;
          getReport();
        }else if($scope.adgroupId && $scope.campaignId){
          $http.get('/restful/campaigns/'+$scope.campaignId).success(function(ret_data) {
            if(ret_data.success){
              $scope.campaign_info = ret_data.data;
            }
          });
          $http.get('/restful/adgroups/'+$scope.adgroupId).success(function(ret_data) {
            if(ret_data.success){
              $scope.adgroup_info = ret_data.data;
              $scope.list_title = $scope.adgroup_info.title;
            }
          });
          $(".adgroup-nav").css("display","inline-block");
          req_type = 3;
          req_key = $scope.adgroupId;
          getReport();
        }else if($scope.campaignId){
          $http.get('/restful/campaigns/'+$scope.campaignId).success(function(ret_data) {
            if(ret_data.success){
              $scope.campaign_info = ret_data.data;
              $scope.list_title = $scope.campaign_info.title;
            }
          });
          req_type = 2;
          req_key = $scope.campaignId;
          getReport();
        }
        
        $scope.chartItem = "pv";
        var chartItemDict = {
          'pv': '展现量',
          'clk': '点击量',
          'ctr': '点击率',
          'acp': '平均点击花费',
          'cost': '花费'
        };
        $scope.chartItemArray = [
          {'value': 'pv', 'name': '展现量'},
          {'value': 'clk', 'name': '点击量'},
          {'value': 'ctr', 'name': '点击率'},
          {'value': 'acp', 'name': '平均点击花费'},
          {'value': 'cost', 'name': '花费'}
        ]
        $scope.changeItem = function(){
            var value = $scope.chartItem;
            var name = chartItemDict[value];
            $scope.chartConfig.series = [{
              name: name,
              data: $scope.chartData[value]
            }];
        }

        function getReport(){
          $scope.chartData.pv = [];
          $scope.chartData.clk = [];
          $scope.chartData.ctr = [];
          $scope.chartData.acp = [];
          $scope.chartData.cost = [];
          $http({
            url: '/restful/report',
            method: 'post',
            data: {
              req_type: req_type,
              req_key: req_key,
              req_day: '-1',
              req_date: dateRange.toString()
            }
          }).success(function(ret_data){
            if(ret_data.success){
              var historyData = [];
              for(var i = 0; i < dateRange.length; i++){
                var temp = {
                  date: dateRange[i]
                }
                if(ret_data.data[req_key][dateRange[i]]){
                  $scope.chartData.pv.push(ret_data['data'][req_key][dateRange[i]]['pv']);
                  $scope.chartData.clk.push(ret_data['data'][req_key][dateRange[i]]['clk']);
                  $scope.chartData.ctr.push(ret_data['data'][req_key][dateRange[i]]['ctr']);
                  $scope.chartData.acp.push(ret_data['data'][req_key][dateRange[i]]['acp']);
                  $scope.chartData.cost.push(ret_data['data'][req_key][dateRange[i]]['cost']);
                  temp['pv'] = ret_data['data'][req_key][dateRange[i]]['pv'];
                  temp['clk'] = ret_data['data'][req_key][dateRange[i]]['clk'];
                  temp['ctr'] = ret_data['data'][req_key][dateRange[i]]['ctr'];
                  temp['acp'] = ret_data['data'][req_key][dateRange[i]]['acp'];
                  temp['cost'] = ret_data['data'][req_key][dateRange[i]]['cost'];
                }else{
                  $scope.chartData.pv.push(null);
                  $scope.chartData.clk.push(null);
                  $scope.chartData.ctr.push(null);
                  $scope.chartData.acp.push(null);
                  $scope.chartData.cost.push(null);
                  temp['pv'] = "-";
                  temp['clk'] = "-";
                  temp['ctr'] = "-";
                  temp['acp'] = "-";
                  temp['cost'] = "-";
                }
                historyData.push(temp);
              }
              $scope.historyData = historyData;
              $scope.chartConfig.options = {
                plotOptions: {
                  line : {
                    marker: {
                      symbol: 'circle'
                    }
                  }
                },
                colors: ['#7cb5ec'],
                xAxis: {
                  gridLineWidth: 1,
                  labels: {
                     style: {
                        fontSize: '12px'
                     }
                  },
                  tickmarkPlacement: "on",
                  categories: dateRange
                },legend: {
                  enabled: false
                }
              };
              $scope.chartConfig.series = [{
                name: '展现量',
                data: $scope.chartData.pv
              }];
            }
          });
          
        }


        $scope.chartConfig = {
          options: {
            colors: ['#7cb5ec'],
            chart: {
              type: 'line'
            },
            plotOptions: {
              line : {
                marker: {
                  symbol: 'circle'
                }
              }
            },
            legend: {
              enabled: false
            },
            tooltip: {
              borderWidth: 0,
              backgroundColor: 'rgba(219,219,216,0.8)',
              shadow: false
            }
          },
          size: {
            height: 200
          },
          title: {
            text: null
          },
          credits: {
              enabled: false
          },
          yAxis: {
            gridLineDashStyle: "ShortDash",
            lineWidth: 0,
            title: {
               text: null,
            },
            labels: {
              formatter: function() {
                return this.value;
              },
               style: {
                  fontSize: '12px'
               }
            },
            tickPixelInterval: 40,
            min: 0
          }
        };

        $scope.historyOptions = {
          "sDom": 'tlip',
          "aLengthMenu": [10, 15, 20, 30, 50],
          "iDisplayLength": 15,
          "aoColumns": [{
            "sTitle" : "日期",
            "mData": "date",
            "bSearchable": false,
            "bSortable": false
          },{
            "sTitle" : "展现量",
            "mData": "pv",
            "bSearchable": false,
            "bSortable": false
          },{
            "sTitle" : "点击量",
            "mData": "clk",
            "bSearchable": false,
            "bSortable": false
          },{
            "sTitle" : "点击率",
            "mData": "ctr",
            "bSearchable": false,
            "bSortable": false
          },{
            "sTitle" : "花费",
            "mData": "cost",
            "bSearchable": false,
            "bSortable": false
          }],
          "fnCreatedRow": function( nRow, aData, iDataIndex ) {
          },
          "fnInitComplete": function(oSettings, json) {
          }
        };

      }]
    );
  }
});