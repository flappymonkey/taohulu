define(function (require, exports, module) {
  'use strict';

  require('datatables');

  var navigation = require('../lib/navigation');

  module.exports = function(app){
    app.register.controller('home', ['$scope', '$http', 'myajax',
      function($scope, $http, myajax){
        navigation.navigate();

        var nick = $("#nick").val();
             
        $scope.labelName = "展现量";
        var now_time = moment().format("HH");
        $scope.now_time = now_time;
        var today_time_range = [];
        for(var i = 0; i <= now_time; i++){
          today_time_range.push(i);
        }
        var today = moment().format("YYYY-MM-DD");
        $scope.now_data = "-";
        $scope.date_list = [];
        $scope.selectedDay = moment().subtract('days', 1).format("YYYY-MM-DD");
        $scope.daterange = [];
        for(var i = 1; i <= 7; i++){
          var temp = {};
          if(i == 1){
            temp.name = "昨天";
          }else if(i == 2){
            temp.name = "前天";
          }else{
            temp.name = moment().subtract('days', i).format("YYYY-MM-DD");
          }
          temp.value = moment().subtract('days', i).format("YYYY-MM-DD");
          $scope.daterange.push(temp);
        }
        myajax({url:'/restful/user'}, function(data){
          $scope.userInfo = data[0];
        });

        $scope.changeDate = function(){
          getHistoryDate();
        }

        function getHistoryDate(){
          $scope.historyDivisionData.pv = [];
          $scope.historyDivisionData.clk = [];
          $scope.historyDivisionData.ctr = [];
          $scope.historyDivisionData.acp = [];
          $scope.historyDivisionData.cost = [];
          $http({
            url: '/restful/report',
            method: 'post',
            data: {
              req_type: 1,
              req_key: nick,
              req_day: $scope.selectedDay,
              req_date: history_time_range.toString()
            }
          }).success(function(ret_data){
            if(ret_data.success){
              for(var i = 0; i < history_time_range.length; i++){
                if(ret_data.data[nick][history_time_range[i]]){
                  $scope.historyDivisionData.pv.push(ret_data['data'][nick][history_time_range[i]]['pv']);
                  $scope.historyDivisionData.clk.push(ret_data['data'][nick][history_time_range[i]]['clk']);
                  $scope.historyDivisionData.ctr.push(ret_data['data'][nick][history_time_range[i]]['ctr']);
                  $scope.historyDivisionData.acp.push(ret_data['data'][nick][history_time_range[i]]['acp']);
                  $scope.historyDivisionData.cost.push(ret_data['data'][nick][history_time_range[i]]['cost']);
                }else{
                  $scope.historyDivisionData.pv.push(null);
                  $scope.historyDivisionData.clk.push(null);
                  $scope.historyDivisionData.ctr.push(null);
                  $scope.historyDivisionData.acp.push(null);
                  $scope.historyDivisionData.cost.push(null);
                }
              }
              // console.log($scope.historyDivisionData.pv);
              $scope.chartConfig.series = [{
                name: '展现量',
                data: $scope.todayDivisionData.pv
              },{
                name: '展现量',
                data: $scope.historyDivisionData.pv
              }];
            }
          });
        }

        $scope.chartConfig = {
          options: {
            colors: ['#7cb5ec','#CBA05B'],
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
          xAxis: {
              gridLineWidth: 1,
              labels: {
                 style: {
                    fontSize: '12px'
                 }
              },
              tickmarkPlacement: "on",
              categories: ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
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
          },
          series: []
        };

        $scope.todayTotalData = {
          pv: '-',
          clk: '-',
          ctr: '-',
          acp: '-',
          cost: '-'
        } 

        $scope.todayDivisionData = {
          pv:[],
          clk:[],
          ctr:[],
          acp:[],
          cost:[]
        }

        
        $http({
          url: '/restful/report',
          method: 'post',
          data: {
            req_type: 1,
            req_key: nick,
            req_day: today,
            req_date: today_time_range.toString()
          }
        }).success(function(ret_data){
          if(ret_data.success){
            $scope.todayTotalData = ret_data['data'][nick]['total'];
            $scope.now_data = ret_data['data'][nick]['total']['pv'];
            for(var i = 0; i < today_time_range.length; i++){
              if(ret_data.data[nick][today_time_range[i]]){
                $scope.todayDivisionData.pv.push(ret_data['data'][nick][today_time_range[i]]['pv']);
                $scope.todayDivisionData.clk.push(ret_data['data'][nick][today_time_range[i]]['clk']);
                $scope.todayDivisionData.ctr.push(ret_data['data'][nick][today_time_range[i]]['ctr']);
                $scope.todayDivisionData.acp.push(ret_data['data'][nick][today_time_range[i]]['acp']);
                $scope.todayDivisionData.cost.push(ret_data['data'][nick][today_time_range[i]]['cost']);
              }else{
                $scope.todayDivisionData.pv.push(null);
                $scope.todayDivisionData.clk.push(null);
                $scope.todayDivisionData.ctr.push(null);
                $scope.todayDivisionData.acp.push(null);
                $scope.todayDivisionData.cost.push(null);
              }
            }
            // console.log($scope.todayDivisionData.pv);
            $scope.chartConfig.series = [{
              name: '展现量',
              data: $scope.todayDivisionData.pv
            },{
              name: '展现量',
              data: $scope.historyDivisionData.pv
            }];
          }
        });

        $scope.historyDivisionData = {
          pv:[],
          clk:[],
          ctr:[],
          acp:[],
          cost:[]
        }
        var history_time_range = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
        getHistoryDate();

        $scope.campaignsData = null;
        myajax({url: '/restful/campaigns'}, function(data){
          var current_cost = 0;
          var campaign_ids = [];
          for(var i = 0; i < data.length; i++){
            current_cost += data[i]['current_cost'];
            campaign_ids.push(data[i]['campaign_id']);
          }

          var campaignsData = data;
          
          $scope.current_cost = current_cost;

          $http({
            url: '/restful/report',
            method: 'post',
            data: {
              req_type: 2,
              req_key: campaign_ids.toString(),
              req_day: today,
              req_date: today_time_range.toString()
            }
          }).success(function(ret_data){
            if(ret_data.success){
              for(var i = 0; i < campaign_ids.length; i++){
                campaignsData[i]['acp'] = ret_data['data'][campaign_ids[i]]['total'].hasOwnProperty('acp') ? ret_data['data'][campaign_ids[i]]['total']['acp'] : '-';
                campaignsData[i]['pv'] = ret_data['data'][campaign_ids[i]]['total'].hasOwnProperty('pv') ? ret_data['data'][campaign_ids[i]]['total']['pv'] : '-';
                campaignsData[i]['clk'] = ret_data['data'][campaign_ids[i]]['total'].hasOwnProperty('clk') ? ret_data['data'][campaign_ids[i]]['total']['clk'] : '-';
                campaignsData[i]['ctr'] = ret_data['data'][campaign_ids[i]]['total'].hasOwnProperty('ctr') ? ret_data['data'][campaign_ids[i]]['total']['ctr'] : '-';
                campaignsData[i]['cost'] = ret_data['data'][campaign_ids[i]]['total'].hasOwnProperty('cost') ? ret_data['data'][campaign_ids[i]]['total']['cost'] : '-';
              }
              $scope.campaignsData = campaignsData;
            }
          });
        }); 

        $scope.overrideOptions = {
          "sDom": '',
          "aoColumns" : [{
            "sTitle" : "<input type='checkbox' id='selectAll'>",
            "mData": "campaign_id",
            "sWidth": "1%",
            "bSearchable": false,
            "bSortable": false,
            "mRender": function ( data, type, full ) {
                return '<input type="checkbox"  class="chkbox"  value="' + data + '" id="' + data + '">' ;
            }
          },{
            "sTitle" : "状态",
            "mData": "online_status",
            "bSearchable": false,
            "bSortable": false,
            "mRender": function ( data, type, full ) {
              var status = "";
              if(data == 0){
                status = '<span class="stoped">暂停</span>';
              }else if(data == 1){
                if(full['settle_status'] == 0){
                  status = '<span class="stoped">下线  ' +  '</span>';
                }else{
                  status = '<span class="running">推广中</span>';
                }
              }
              return type === 'display' ? status : data;
            }
          },{
            "sTitle" : "推广计划名称",
            "mData": "title",
            "bSearchable": false,
            "bSortable": false,
            "mRender": function(data, type, full){
              return '<a href="#!/campaigns/adgroups/index?type=item&campaignId=' + full.campaign_id + '">' + data + '</a>';
            }
          },{
          //   "sTitle" : "分时折扣",
          //   "mData": "discount",
          //   "bSearchable": false,
          //   "bSortable": false
          // },{
            "sTitle" : "日限额",
            "mData": "budget",
            "bSearchable": false,
            "bSortable": false,
            "mRender": function(data, type, full){
              return (data/100) + "元";
            }
          },{
            "sTitle" : "点击单价",
            "mData": "acp",
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
            "bSortable": false,
            "mRender": function(data, type, full){
              return data + "%";
            }
          },{
            "sTitle" : "花费",
            "mData": "cost",
            "bSearchable": false,
            "bSortable": false,
            "mRender": function(data, type, full){
              return "￥" + data;
            }
          },{
            "sTitle" : "操作",
            "mData": null,
            "bSearchable": false,
            "bSortable": false,
            "mRender": function(data, type, full){
              return '<a href="#!/campaigns/adgroups/index">编辑</a><a class="go-report" href="#!/report/dailydetails?campaignId=' + full['campaign_id'] + '">查看报表</a>';
            }
          }],
          "fnCreatedRow": function( nRow, aData, iDataIndex ) {
            $(nRow).attr('id',aData.campaign_id);
          },
          "fnInitComplete": function(oSettings, json) {
            $(".campaigns").delegate("#selectAll","click",function(){
              var status = this.checked;
              $.each($('.chkbox'), function(i,item){
                  $(item)[0].checked = status;
              });
            });
          }
        };

        $scope.stop = function(){
          var campaign_ids = [];
          $('.chkbox:checked').each(function(i, item){
            campaign_ids.push( $(item).val() );
          });
          if(campaign_ids.length){
            $http({
              url: '/restful/campaigns',
              method: 'put',
              data: {
                campaign_ids: campaign_ids.toString(),
                online_status: 0
              }
            }).success(function(ret_data){
                if(ret_data.success){
                  $('.chkbox:checked').each(function(i, item){
                    $(item).parent().next().html('<span class="stoped">暂停</span>');
                  });
                }  
            });
          }
        }

        $scope.run = function(){
          var campaign_ids = [];
          $('.chkbox:checked').each(function(i, item){
            campaign_ids.push( $(item).val() );
          });
          if(campaign_ids.length){
            $http({
              url: '/restful/campaigns',
              method: 'put',
              data: {
                campaign_ids: campaign_ids.toString(),
                online_status: 1
              }
            }).success(function(ret_data){
                if(ret_data.success){
                  $('.chkbox:checked').each(function(i, item){
                    $(item).parent().next().html('<span class="running">推广中</span>');
                  });
                }  
            });
          }
        }

        $scope.chartRedraw = function(item){
          if(item == "account"){
            $(".account-info .lists li").removeClass("active");
            $(".account-info .lists li:eq(0)").addClass("active");
            $(".account").show();
            $(".chart").hide();
          }else if(item == "pv"){
            $(".account-info .lists li").removeClass("active");
            $(".account-info .lists li:eq(1)").addClass("active");
            $(".account").hide();
            $(".chart").show();
            $scope.chartConfig.series = [{
              name: '展现量',
              data: $scope.todayDivisionData.pv
            },{
              name: '展现量',
              data: $scope.historyDivisionData.pv
            }];
            $scope.labelName = "展现量";
          }else if(item == "clk"){
            $(".account-info .lists li").removeClass("active");
            $(".account-info .lists li:eq(2)").addClass("active");
            $(".account").hide();
            $(".chart").show();
            $scope.chartConfig.series = [{
              name: '点击量',
              data: $scope.todayDivisionData.clk
            },{
              name: '点击量',
              data: $scope.historyDivisionData.clk
            }];
            $scope.labelName = "点击量";
          }else if(item == "ctr"){
            $(".account-info .lists li").removeClass("active");
            $(".account-info .lists li:eq(3)").addClass("active");
            $(".account").hide();
            $(".chart").show();
            $scope.chartConfig.series = [{
              name: '点击率',
              data: $scope.todayDivisionData.ctr
            },{
              name: '点击率',
              data: $scope.historyDivisionData.ctr
            }];
            $scope.labelName = "点击率";
          }else if(item == "cost"){
            $(".account-info .lists li").removeClass("active");
            $(".account-info .lists li:eq(4)").addClass("active");
            $(".account").hide();
            $(".chart").show();
            $scope.chartConfig.series = [{
              name: '花费',
              data: $scope.todayDivisionData.cost
            },{
              name: '花费',
              data: $scope.historyDivisionData.cost
            }];
            $scope.labelName = "花费";
          }
        }

        $scope.getDate = function(date){
          console.log(date);
          
        }
      }
    ]);
  }
});