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
    app.register.controller('report_campaign', ['$scope', '$routeParams', '$location', '$http',
      function($scope, $routeParams, $location, $http){
        navigation.navigate();

        $scope.endDate = moment().format('YYYY-MM-DD');
        var startDate = moment().subtract('days', 6);
        $scope.startDate = startDate.format('YYYY-MM-DD');
        var dateRange = [startDate.format('YYYY-MM-DD')];
        for(var i = 1; i <= 6; i++){
          dateRange.push(startDate.add('days', 1).format('YYYY-MM-DD'));
        }

        $scope.campaignId = $routeParams.campaignId;
        $http.get('/restful/campaigns/'+$scope.campaignId).success(function(ret_data) {
          if(ret_data.success){
            $scope.campaign_info = ret_data.data;
          }
        });

        $http.get('/restful/campaigns').success(function(ret_data) {
          if(ret_data.success){
            $scope.campaigns = ret_data.data;
          }
        });

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
          getCampaignReport();
          getAdgroupReport();
          getCreativeReport();
        }

        function getCampaignReport(){
          $scope.chartData.pv = [];
          $scope.chartData.clk = [];
          $scope.chartData.ctr = [];
          $scope.chartData.acp = [];
          $scope.chartData.cost = [];
          $http({
            url: '/restful/report',
            method: 'post',
            data: {
              req_type: 2,
              req_key: $scope.campaignId,
              req_day: '-1',
              req_date: dateRange.toString()
            }
          }).success(function(ret_data){
            if(ret_data.success){
              $scope.totalData = ret_data['data'][$scope.campaignId]['total'];
              for(var i = 0; i < dateRange.length; i++){
                if(ret_data.data[$scope.campaignId][dateRange[i]]){
                  $scope.chartData.pv.push(ret_data['data'][$scope.campaignId][dateRange[i]]['pv']);
                  $scope.chartData.clk.push(ret_data['data'][$scope.campaignId][dateRange[i]]['clk']);
                  $scope.chartData.ctr.push(ret_data['data'][$scope.campaignId][dateRange[i]]['ctr']);
                  $scope.chartData.acp.push(ret_data['data'][$scope.campaignId][dateRange[i]]['acp']);
                  $scope.chartData.cost.push(ret_data['data'][$scope.campaignId][dateRange[i]]['cost']);
                }else{
                  $scope.chartData.pv.push(null);
                  $scope.chartData.clk.push(null);
                  $scope.chartData.ctr.push(null);
                  $scope.chartData.acp.push(null);
                  $scope.chartData.cost.push(null);
                }
              }
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

        function getAdgroupReport(){
          $http({
            url: '/restful/report',
            method: 'post',
            data: {
              req_type: 3,
              req_key: adgroup_ids.toString(),
              req_day: '-1',
              req_date: dateRange.toString()
            }
          }).success(function(ret_data){
            if(ret_data.success){
              for(var i = 0; i < adgroup_ids.length; i++){
                adgroups[i]['acp'] = ret_data['data'][adgroup_ids[i]]['total']['acp'] ? ret_data['data'][adgroup_ids[i]]['total']['acp'] : '-';
                adgroups[i]['pv'] = ret_data['data'][adgroup_ids[i]]['total']['pv'] ? ret_data['data'][adgroup_ids[i]]['total']['pv'] : '-';
                adgroups[i]['clk'] = ret_data['data'][adgroup_ids[i]]['total']['clk'] ? ret_data['data'][adgroup_ids[i]]['total']['clk'] : '-';
                adgroups[i]['ctr'] = ret_data['data'][adgroup_ids[i]]['total']['ctr'] ? ret_data['data'][adgroup_ids[i]]['total']['ctr'] : '-';
                adgroups[i]['cost'] = ret_data['data'][adgroup_ids[i]]['total']['cost'] ? ret_data['data'][adgroup_ids[i]]['total']['cost'] : '-';
              }
              $scope.adgroupsData = adgroups;
            }
          });
        }

        function getCreativeReport(){
          $http({
            url: '/restful/report',
            method: 'post',
            data: {
              req_type: 4,
              req_key: creative_ids.toString(),
              req_day: '-1',
              req_date: dateRange.toString()
            }
          }).success(function(ret_data){
            if(ret_data.success){
              for(var i = 0; i < creative_ids.length; i++){
                creatives[i]['acp'] = ret_data['data'][creative_ids[i]]['total']['acp'] ? ret_data['data'][creative_ids[i]]['total']['acp'] : '-';
                creatives[i]['pv'] = ret_data['data'][creative_ids[i]]['total']['pv'] ? ret_data['data'][creative_ids[i]]['total']['pv'] : '-';
                creatives[i]['clk'] = ret_data['data'][creative_ids[i]]['total']['clk'] ? ret_data['data'][creative_ids[i]]['total']['clk'] : '-';
                creatives[i]['ctr'] = ret_data['data'][creative_ids[i]]['total']['ctr'] ? ret_data['data'][creative_ids[i]]['total']['ctr'] : '-';
                creatives[i]['cost'] = ret_data['data'][creative_ids[i]]['total']['cost'] ? ret_data['data'][creative_ids[i]]['total']['cost'] : '-';
              }
              $scope.creativesData = creatives;
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
        $scope.chartData = {
          pv:[],
          clk:[],
          ctr:[],
          acp:[],
          cost:[]
        }
        getCampaignReport();

        var adgroups = null;
        var adgroup_ids = []; 
        $http.get('/restful/adgroups?campaign_id=' + $scope.campaignId).success(function(ret_data){
            if(ret_data.success){
              adgroups = ret_data.data;
              for(var i = 0; i < adgroups.length; i++){
                adgroup_ids.push(adgroups[i]['adgroup_id']);
              }
              getAdgroupReport();
            }
        });

        $scope.adgroupsOptions = {
          "sDom": 'ftlip',
          "aoColumns": [{
            "sTitle" : "状态",
            "mData": "online_status",
            "bSearchable": false,
            "bSortable": false,
            "mRender": function ( data, type, full ) {
              var status = "";
              if(data == 0){
                status = '暂停';
              }else if(data == 1){
                status = '推广中';
              }
              return type === 'display' ? status : data;
            }
          },{
            "sTitle" : "推广组",
            "mData": "title",
            "bSearchable": false,
            "bSortable": false,
            "mRender": function(data, type, full){
              var html = '<a href="/#!/report/adgroup?campaignId=' + $scope.campaignId + '&adgroupId=' + full.adgroup_id + '"><img width=60 height=60 src="' + full.pic_url + '"></a>';
                html += '<a href="/#!/report/adgroup?campaignId=' + $scope.campaignId + '&adgroupId=' + full.adgroup_id + '">' + full.title + '</a>';
                return html;
            }
          },{
            "sTitle" : "类型",
            "mData": "type",
            "bSearchable": false,
            "bSortable": false,
            "mRender": function ( data, type, full ) {
              var temp = "";
              if(data == 1){
                temp = '宝贝推广';
              }else if(data == 2){
                temp = '店铺推广';
              }
              return type === 'display' ? temp : data;
            }
          },{
            "sTitle" : "默认出价(元)",
            "mData": "default_price",
            "bSearchable": false,
            "bSortable": false,
            "mRender": function ( data, type, full ) {
              return '<span class="price">' + (data/100).toFixed(2) + '</span>';
            }
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
          },{
            "sTitle" : "操作",
            "mData": null,
            "bSearchable": false,
            "bSortable": false,
            "mRender": function(data, type, full){
              return '<a href="#!/report/dailydetails?campaignId=' + $scope.campaignId + '&adgroupId=' + full.adgroup_id + '">分日详情</a>';
            }
          }],
          "fnCreatedRow": function( nRow, aData, iDataIndex ) {
            $(nRow).attr('id',aData.adgroup_id);
          },
          "fnInitComplete": function(oSettings, json) {
            $(".adgroups").delegate("#selectAll","click",function(){
              var status = this.checked;
              $.each($('.chkbox'), function(i,item){
                  $(item)[0].checked = status;
              });
            });
          }
        };

        var creatives = null;
        var creative_ids = [];
        $http.get('/restful/creative?campaign_id=' + $scope.campaignId).success(function(ret_data){
            if(ret_data.success){
              creatives = ret_data.data;
              for(var i = 0; i < creatives.length; i++){
                creative_ids.push(creatives[i]['creative_id']);
              }
              getCreativeReport();
            }
        });

        $scope.creativesOptions = {
          "sDom": 'ftlip',
          "aoColumns": [{
            "sTitle" : "状态",
            "mData": "online_status",
            "bSearchable": false,
            "bSortable": false,
            "mRender": function ( data, type, full ) {
              var status = "";
              if(data == 0){
                status = '暂停';
              }else if(data == 1){
                status = '推广中';
              }
              return type === 'display' ? status : data;
            }
          },{
            "sTitle" : "创意名称",
            "mData": "title",
            "bSearchable": false,
            "bSortable": false,
            "mRender": function(data, type, full){
              var html = '<a href="' + full.detail_url + '" target="_blank"><img width=60 height=60 src="' + full.img_url + '"></a>';
                html += '<a href="' + full.detail_url + '" target="_blank">' + full.title + '</a>';
                return html;
            }
          },{
            "sTitle" : "推广组",
            "mData": "adgroup_title",
            "bSearchable": false,
            "bSortable": false,
            "mRender": function(data, type, full){
              var html = '<a href="/#!/report/adgroup?campaignId=' + $scope.campaignId + '&adgroupId=' + full.adgroup_id + '">' + full.title + '</a>';
                return html;
            }
          },{
            "sTitle" : "类型",
            "mData": "type",
            "bSearchable": false,
            "bSortable": false,
            "mRender": function ( data, type, full ) {
              var temp = "";
              if(data == 1){
                temp = '宝贝推广';
              }else if(data == 2){
                temp = '店铺推广';
              }
              return type === 'display' ? temp : data;
            }
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
          },{
            "sTitle" : "操作",
            "mData": null,
            "bSearchable": false,
            "bSortable": false,
            "mRender": function(data, type, full){
              return '<a href="#!/report/dailydetails?campaignId=' + $scope.campaignId + '&adgroupId=' + full.adgroup_id + '&creativeId=' + full.creative_id + '">分日详情</a>';
            }
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