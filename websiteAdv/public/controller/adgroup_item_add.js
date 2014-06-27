define(function (require, exports, module) {
  'use strict';

  require('datatables');
  require('momentjs');
  var navigation = require('../lib/navigation');

  module.exports = function(app){
    //Step6: use `app.register` to register controller/service/directive/filter
    app.register.controller('adgroup_item_add', ['$scope', '$routeParams', '$location', '$http',
      function($scope, $routeParams, $location, $http){
        navigation.navigate();

        $scope.campaignsData = null;
        $http.get('/restful/campaigns').success(function(ret_data) {
          if(ret_data.success && ret_data.data.length){
            var data = ret_data.data;
            for(var i = 0; i < data.length; i++){
              data[i]['acp'] = data[i]['acp'] ? data[i]['acp'] : '-';
              data[i]['pv'] = data[i]['pv'] ? data[i]['pv'] : '-';
              data[i]['clk'] = data[i]['clk'] ? data[i]['clk'] : '-';
              data[i]['ctr'] = data[i]['ctr'] ? data[i]['ctr'] : '-';
              data[i]['cost'] = data[i]['cost'] ? data[i]['cost'] : '-';
            }
            $scope.campaignsData = data;
          }
        });
        $scope.campaignOptions = {
          "sDom": '',
          "aoColumns": [{
            "sTitle" : "推广计划名称",
            "mData": "title",
            "bSearchable": false,
            "bSortable": false,
            "mRender": function(data, type, full){
              return '<a href="#!/campaigns/adgroups/index?type=item&campaignId=' + full.campaign_id + '">' + data + '</a>';
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
              return '<a>编辑</a>';
            }
          }],
          "fnCreatedRow": function( nRow, aData, iDataIndex ) {
            $(nRow).attr('id',aData.campaign_id);
          },
          "fnInitComplete": function(oSettings, json) {
            $(".campaigns-list").delegate("tr","click",function(){
              if($(this).attr("id")){
                $scope.campaignId = $(this).attr("id");
                $http.get('/restful/products/'+$scope.campaignId).success(function(ret_data) {
                  if(ret_data.success){
                    $(".fs-item:eq(0)").removeClass("fs-item-current");
                    $(".fs-item:eq(1)").addClass("fs-item-current");
                    $(".panel0").hide();
                    $(".panel1").show();
                    $scope.productsData = ret_data.data;
                  }
                });           
              }
            });
          }
        };

        $scope.productsData = null;

        $scope.adgroupOptions = {
          "sDom": 'ftlip',
          "aoColumns": [
            {
              "sTitle" : "宝贝",
              "mData": "product_id",
              "mRender": function(data, type, full){
                var html = '<a href="' + full.detail_url + '" target="_blank"><img width=80 height=80 src="' + full.pic_url + '"></a>';
                html += '<a href="' + full.detail_url + '" target="_blank">' + full.title + '</a>  ';
                html += full.price/100 + "元";
                return html;
              }
            },{
              "sTitle" : "销量",
              "mData": "sales_count"
            },{
              "sTitle" : "库存",
              "mData": "quantity"
            },{
              "sTitle" : "发布时间",
              "mData": "publish_time",
              "mRender": function(data, type, full){
                return moment(data).format("YYYY-MM-DD hh:mm:ss");
              }
            },{
              "sTitle" : "操作",
              "mData": null,
              "bSearchable": false,
              "bSortable": false,
              "mRender": function(){
                return "<a>推广</a>";
              }
            }
          ],
          "fnCreatedRow": function( nRow, aData, iDataIndex ) {
            $(nRow).attr('id',aData.product_id);
          },
          "fnInitComplete": function(oSettings, json) {
            $(".products-toadd-list").delegate("tr","click",function(){
              if($(this).attr("id")){
                $scope.itemId = $(this).attr("id");              
                $(".fs-item:eq(1)").removeClass("fs-item-current");
                $(".fs-item:eq(2)").addClass("fs-item-current");
                $(".panel1").hide();
                $(".panel2").show();
              }
            });
          }
        };

        $scope.toStep0 = function(){
          $(".fs-item:eq(1)").removeClass("fs-item-current");
          $(".fs-item:eq(0)").addClass("fs-item-current");
          $(".panel1").hide();
          $(".panel0").show();
        }

        $scope.toStep1 = function(){
          $(".fs-item:eq(2)").removeClass("fs-item-current");
          $(".fs-item:eq(1)").addClass("fs-item-current");
          $(".panel2").hide();
          $(".panel1").show();
        }

        $scope.toStep3 = function(){
          $scope.defaultPrice = $("#default_price").val()*100;
          $http({
            url: '/restful/adgroups/',
            method: 'post',
            data: {
              campaign_id: $scope.campaignId,
              type: 1,
              item_id: $scope.itemId,
              default_price: $scope.defaultPrice
            },
          }).success(function(ret_data){
              if(ret_data.success){
                $(".fs-item:eq(2)").removeClass("fs-item-current");
                $(".fs-item:eq(3)").addClass("fs-item-current");
                $(".panel2").hide();
                $(".panel3").show();
              }  
          });
        }

        $scope.createAgain = function(){
          $http.get('/restful/products/'+$scope.campaignId).success(function(ret_data) {
            if(ret_data.success){
              $scope.productsData = ret_data.data;
              $(".fs-item:eq(3)").removeClass("fs-item-current");
              $(".fs-item:eq(0)").addClass("fs-item-current");
              $(".panel3").hide();
              $(".panel0").show();
            }
          });
        }

      }]
    );
  }
});