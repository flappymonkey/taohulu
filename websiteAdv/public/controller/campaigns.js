define(function (require, exports, module) {
  'use strict';

  require('datatables');
  var navigation = require('../lib/navigation');

  module.exports = function(app){
    app.register.controller('campaigns', ['$scope', '$http',
      function($scope, $http){
        navigation.navigate();
        var today = moment().format("YYYY-MM-DD");

        $scope.campaignsData = null;
        var history_time_range = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
        $http.get('/restful/campaigns').success(function(ret_data) {
          if(ret_data.success && ret_data.data.length){
            var data = ret_data.data;
            var campaign_ids = [];
            for(var i = 0; i < data.length; i++){
              campaign_ids.push(data[i]['campaign_id']);
            }
            var campaignsData = data;
            $http({
              url: '/restful/report',
              method: 'post',
              data: {
                req_type: 2,
                req_key: campaign_ids.toString(),
                req_day: today,
                req_date: history_time_range.toString()
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
          }
        });
        
        $scope.overrideOptions = {
          "sDom": '',
          "aoColumns": [{
            "sTitle" : "<input type='checkbox' id='selectAll'>",
            "mData": "campaign_id",
            "sWidth": "1%",
            "bSearchable": false,
            "bSortable": false,
            "mRender": function ( data, type, full ) {
              return '<input type="checkbox"  class="chkbox"  value="' + data + '">' ;
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
                status = '<span class="running">推广中</span>';
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
              return '<a href="#!/campaigns/adgroups/index?type=item&campaignId=' + full.campaign_id + '">编辑</a><a class="go-report" href="#!/report/dailydetails?campaignId=' + full['campaign_id'] + '">查看报表</a>';
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

      }]
    );
  }
});