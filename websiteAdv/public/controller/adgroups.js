define(function (require, exports, module) {
  'use strict';

  require('datatables');

  var navigation = require('../lib/navigation');

  module.exports = function(app){
    app.register.controller('adgroups', ['$scope', '$routeParams', '$location', '$http', '$modal',
      function($scope, $routeParams, $location, $http, $modal){
        navigation.navigate();
        var today = moment().format("YYYY-MM-DD");
        var scope = $scope;

        //获取页面的入参
        var type = $routeParams.type;
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

        var history_time_range = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
        $http({
          url: '/restful/adgroups',
          method: 'get',
          params: {
            campaign_id: $scope.campaignId
          },
        }).success(function(ret_data){
            if(ret_data.success){
              var data = ret_data.data;
              var adgroup_ids = [];
              for(var i = 0; i < data.length; i++){
                adgroup_ids.push(data[i]['adgroup_id']);
              }
              
              $http({
                url: '/restful/report',
                method: 'post',
                data: {
                  req_type: 3,
                  req_key: adgroup_ids.toString(),
                  req_day: today,
                  req_date: history_time_range.toString()
                }
              }).success(function(ret_data){
                if(ret_data.success){
                  for(var i = 0; i < adgroup_ids.length; i++){
                    data[i]['acp'] = ret_data['data'][adgroup_ids[i]]['total'].hasOwnProperty('acp') ? ret_data['data'][adgroup_ids[i]]['total']['acp'] : '-';
                    data[i]['pv'] = ret_data['data'][adgroup_ids[i]]['total'].hasOwnProperty('pv') ? ret_data['data'][adgroup_ids[i]]['total']['pv'] : '-';
                    data[i]['clk'] = ret_data['data'][adgroup_ids[i]]['total'].hasOwnProperty('clk') ? ret_data['data'][adgroup_ids[i]]['total']['clk'] : '-';
                    data[i]['ctr'] = ret_data['data'][adgroup_ids[i]]['total'].hasOwnProperty('ctr') ? ret_data['data'][adgroup_ids[i]]['total']['ctr'] : '-';
                    data[i]['cost'] = ret_data['data'][adgroup_ids[i]]['total'].hasOwnProperty('cost') ? ret_data['data'][adgroup_ids[i]]['total']['cost'] : '-';

                  }
                  $scope.adgroupsData = data;
                }
              });
            }
        });


        $scope.overrideOptions = {
          "sDom": 'ftlip',
          "aoColumns": [{
            "sTitle" : "<input type='checkbox' id='selectAll'>",
            "mData": "adgroup_id",
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
                status = '<span class="running">推广中</span>';
              }
              return type === 'display' ? status : data;
            }
          },{
            "sTitle" : "推广组",
            "mData": "title",
            "bSearchable": false,
            "bSortable": false,
            "mRender": function(data, type, full){
              var html = '<a href="#!/campaigns/adgroups/items/detail?tab=creative&campaignId=' + $scope.campaignId + '&adgroupId=' + full.adgroup_id + '"><img width=60 height=60 src="' + full.pic_url + '"></a>';
                html += '<a href="#!/campaigns/adgroups/items/detail?tab=creative&campaignId=' + $scope.campaignId + '&adgroupId=' + full.adgroup_id + '">' + full.title + '</a>';
                html += full.price / 100 + "元";
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
              return '<a href="#!/campaigns/adgroups/items/detail?tab=creative&campaignId=' + $scope.campaignId + '&adgroupId=' + full.adgroup_id + '">' + '编辑' + '</a><a class="go-report" href="#!/report/dailydetails?campaignId=' + $scope.campaignId + '&adgroupId=' + full['adgroup_id'] + '">查看报表</a>';
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

        $scope.setBudget = function(size){
          var modalInstance = $modal.open({
            templateUrl: 'setBudget.html',
            resolve: {
              budget: function () {
                return $scope.campaign_info.budget;
              }
            },
            controller: function ($scope, $modalInstance, budget) {
              $scope.budget = budget;
              $scope.ok = function () {
                var budget = $("#budget").val()*100;
                $http({
                  url: '/restful/campaigns/'+scope.campaign_info.campaign_id,
                  method: 'put',
                  data: {
                    budget: budget
                  },
                }).success(function(ret_data){
                    if(ret_data.success){
                      scope.campaign_info.budget = budget;
                      $modalInstance.close();
                    }  
                })
              };
              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };
            },
            size: size
          });
        }

        $scope.setMarketTime = function(size){
          var modalInstance = $modal.open({
            templateUrl: 'setMarketTime.html',
            controller: function ($scope, $modalInstance) {
              if(scope.campaign_info.market_time == -1){
                $scope.market_time = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
              }else{
                var timeArr = scope.campaign_info.market_time.split(';');
                var timeDict = {};
                for(var i = 0; i < timeArr.length; i++){
                  timeDict[timeArr[i]] = timeArr[i];
                }
                $scope.market_time = [];
                for(var i = 0; i < 24; i++){
                  if(timeDict[i]){
                    $scope.market_time.push(true);
                  }else{
                    $scope.market_time.push(false);
                  }
                }
              }

              $scope.ok = function () {
                var setting_times = [];
                $(".hour-checkbox").each(function(i, item){
                  if(item.checked){
                    setting_times.push(i);
                  }
                });
                var market_time = setting_times.join(";");
                $http({
                  url: '/restful/campaigns/'+scope.campaign_info.campaign_id,
                  method: 'put',
                  data: {
                    market_time: market_time
                  }
                }).success(function(ret_data){
                    if(ret_data.success){
                      scope.campaign_info.market_time = market_time;
                      $modalInstance.close();
                    }  
                })
              };
              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };
            },
            size: size
          });
          
        }

        $scope.setMarketAddr = function(size){
          var modalInstance = $modal.open({
            templateUrl: 'setMarketAddr.html',
            controller: function ($scope, $modalInstance) {
              $scope.market_region = {
                '11000000':false,
                '12000000':false,
                '13000000':false,
                '14000000':false,
                '15000000':false,
                '21000000':false,
                '22000000':false,
                '23000000':false,
                '31000000':false,
                '32000000':false,
                '33000000':false,
                '34000000':false,
                '35000000':false,
                '36000000':false,
                '37000000':false,
                '41000000':false,
                '42000000':false,
                '43000000':false,
                '44000000':false,
                '45000000':false,
                '46000000':false,
                '50000000':false,
                '51000000':false,
                '52000000':false,
                '53000000':false,
                '54000000':false,
                '61000000':false,
                '62000000':false,
                '63000000':false,
                '64000000':false,
                '65000000':false,
                '71000000':false,
                '81000000':false,
                '82000000':false
              };
              if(scope.campaign_info.market_region == -1){
                for(var region in $scope.market_region){
                  $scope.market_region[region] = true;
                }
              }else{
                var temp = scope.campaign_info.market_region.split(';');
                for(var i = 0; i < temp.length; i++){
                  $scope.market_region[temp[i]] = true;
                }
              }

              $scope.ok = function () {
                var setting_region = [];
                $(".area").each(function(i, item){
                  if(item.checked){
                    setting_region.push( $(item).val() );
                  }
                });
                var market_region = setting_region.join(";");
                $http({
                  url: '/restful/campaigns/'+scope.campaign_info.campaign_id,
                  method: 'put',
                  data: {
                    market_region: market_region
                  }
                }).success(function(ret_data){
                    if(ret_data.success){
                      scope.campaign_info.market_region = market_region;
                      $modalInstance.close();
                    }  
                })
              };
              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };
              $scope.addrSelect = function(area,target){
                switch(area){
                  case 1:
                    $(".area1").attr("checked",target.checked);
                    break;
                  case 2:
                    $(".area2").attr("checked",target.checked);
                    break;
                  case 3:
                    $(".area3").attr("checked",target.checked);
                    break;
                  case 4:
                    $(".area4").attr("checked",target.checked);
                    break;
                  case 5:
                    $(".area5").attr("checked",target.checked);
                    break;
                  case 6:
                    $(".area6").attr("checked",target.checked);
                    break;
                  case 7:
                    $(".area7").attr("checked",target.checked);
                    break;
                  case 8:
                    $(".area8").attr("checked",target.checked);
                    break;
                }
              }
            },
            size: size
          });
        }

        $scope.changeDefaultPrice = function(size){
          var adgroup_ids = [];
          $('.chkbox:checked').each(function(i, item){
            adgroup_ids.push( $(item).val() );
          });
          if(adgroup_ids.length){
            var modalInstance = $modal.open({
              templateUrl: 'setDefaultPrice.html',
              controller: function ($scope, $modalInstance) {
                $scope.ok = function () {
                  $http({
                    url: '/restful/adgroups',
                    method: 'put',
                    data: {
                      adgroup_ids: adgroup_ids,
                      default_price: $("#default_price").val()*100
                    },
                  }).success(function(ret_data){
                      if(ret_data.success){
                        $('.chkbox:checked').each(function(i, item){
                          $(item).parent().parent().find(".price").addClass("changed").text($("#default_price").val());
                        });
                        $modalInstance.close();
                      }  
                  })
                };
                $scope.cancel = function () {
                  $modalInstance.dismiss('cancel');
                };
              },
              size: size
            });
          }
        }

        $scope.stop = function(){
          var adgroup_ids = [];
          $('.chkbox:checked').each(function(i, item){
            adgroup_ids.push( $(item).val() );
          });
          if(adgroup_ids.length){
            $http({
              url: '/restful/adgroups',
              method: 'put',
              data: {
                adgroup_ids: adgroup_ids.toString(),
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
          var adgroup_ids = [];
          $('.chkbox:checked').each(function(i, item){
            adgroup_ids.push( $(item).val() );
          });
          if(adgroup_ids.length){
            $http({
              url: '/restful/adgroups',
              method: 'put',
              data: {
                adgroup_ids: adgroup_ids.toString(),
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

        $scope.delete = function(){
          var adgroup_ids = [];
          $('.chkbox:checked').each(function(i, item){
            adgroup_ids.push( $(item).val() );
          });
          if(adgroup_ids.length){
            var result = confirm("确定要删除这条推广宝贝数据？一旦删除，所有数据将无法恢复！");
            if(result == true){
              $http({
                url: '/restful/adgroups',
                method: 'delete',
                params: {
                  adgroup_ids: adgroup_ids.toString()
                }
              }).success(function(ret_data){
                  if(ret_data.success){
                    $('.chkbox:checked').each(function(i, item){
                      $(item).parent().parent().remove();
                    });
                  }  
              });
            }
          }
        }

      }]
    );
  }
});