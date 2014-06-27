define(function (require, exports, module) {
  'use strict';

  require('datatables');
  var navigation = require('../lib/navigation');

  module.exports = function(app){
    //Step6: use `app.register` to register controller/service/directive/filter
    app.register.controller('detail', ['$scope', '$routeParams', '$location', '$http',
      function($scope, $routeParams, $location, $http){
        navigation.navigate();
        var today = moment().format("YYYY-MM-DD");

        //获取页面的入参
        var tab = $routeParams.tab;
        var campaignId = $routeParams.campaignId;
        var adgroupId = $routeParams.adgroupId;

        $http.get('/restful/campaigns/'+campaignId).success(function(ret_data) {
          if(ret_data.success){
            $scope.campaign_info = ret_data.data;
          }
        });
        
        $http.get('/restful/campaigns').success(function(ret_data) {
          if(ret_data.success){
            $scope.campaigns = ret_data.data;
          }
        });

        $http.get('/restful/adgroups/'+adgroupId).success(function(ret_data) {
          if(ret_data.success){
            $scope.adgroup_info = ret_data.data;
          }
        });

        var history_time_range = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
        $http.get('/restful/creative/'+adgroupId).success(function(ret_data) {
          if(ret_data.success){
            var data = ret_data.data;
            var creative_ids = [];
            for(var i = 0; i < data.length; i++){
              creative_ids.push(data[i]['creative_id']);
            }
            
            $http({
              url: '/restful/report',
              method: 'post',
              data: {
                req_type: 4,
                req_key: creative_ids.toString(),
                req_day: today,
                req_date: history_time_range.toString()
              }
            }).success(function(ret_data){
              if(ret_data.success){
                for(var i = 0; i < creative_ids.length; i++){
                  data[i]['acp'] = ret_data['data'][creative_ids[i]]['total'].hasOwnProperty('acp') ? ret_data['data'][creative_ids[i]]['total']['acp'] : '-';
                  data[i]['pv'] = ret_data['data'][creative_ids[i]]['total'].hasOwnProperty('pv') ? ret_data['data'][creative_ids[i]]['total']['pv'] : '-';
                  data[i]['clk'] = ret_data['data'][creative_ids[i]]['total'].hasOwnProperty('clk') ? ret_data['data'][creative_ids[i]]['total']['clk'] : '-';
                  data[i]['ctr'] = ret_data['data'][creative_ids[i]]['total'].hasOwnProperty('ctr') ? ret_data['data'][creative_ids[i]]['total']['ctr'] : '-';
                  data[i]['cost'] = ret_data['data'][creative_ids[i]]['total'].hasOwnProperty('cost') ? ret_data['data'][creative_ids[i]]['total']['cost'] : '-';

                }
                $scope.creativeData = data;
              }
            });
          }
        });

        $scope.creativeOptions = {
          "aLengthMenu": [
                [50,100,-1],
                [50,100,"All"]
            ],
          "iDisplayLength": 50,
          "aoColumns": [
            {
              "sTitle" : "审核状态",
              "mData": "audit_status",
              "mRender": function(data, type, full){
                var status = "";
                if(data == 0){
                  status = '<span class="">待审核</span>';
                }else if(data == 1){
                  if(full['online_status'] == 0){
                    status = '<span class="">暂停</span>';
                  }else{
                    status = '<span class="">推广中</span>';
                  }
                }else if(data == 2){
                  status = '<span class="">审核拒绝</span>';
                }
                return type === 'display' ? status : data;
              }
            },{
              "sTitle" : "创意",
              "mData": "title",
              "mRender": function(data, type, full){
                return '<a href="' + full.detail_url + '" target="_blank"><img width=80 height=80 src="' + full['img_url'] + '"></a>' + 
                '<a href="' + full.detail_url + '" target="_blank">' + data + '</a><br>' + 
                full['price'] / 100 + "元";
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
                return '<a class="go-report" href="#!/report/dailydetails?campaignId=' + campaignId + '&adgroupId=' + adgroupId + '&creativeId=' + full['creative_id'] + '">查看报表</a>';
              }
            }
          ]
        };

      }]
    );
  }
});