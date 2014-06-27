define(function (require, exports, module) {
  'use strict';

  require('datatables');

  var navigation = require('../lib/navigation');

  module.exports = function(app){
    app.register.controller('productCtrl', ['$scope','$http','$modal',function($scope,$http,$modal) {
      navigation.navigate();
      var scope = $scope;

      $http.get('/restful/products').success(function(ret_data) {
        if(ret_data.success){
          $scope.sampleProductCategories = ret_data.data;
        }
      });          
      
      $scope.overrideOptions = {
        "aLengthMenu": [
              [50,100,-1],
              [50,100,"All"]
          ],
        "iDisplayLength": 50,
        "aoColumns": [
          {
            "sTitle" : "图片",
            "mData": "pic_url",
            "mRender": function(data, type, full){
              return '<a href="' + full.detail_url + '" target="_blank"><img width=80 height=80 src="' + data + '"></a>';
            }
          },{
            "sTitle" : "标题",
            "mData": "title",
            "mRender": function(data, type, full){
              return '<a href="' + full.detail_url + '" target="_blank">' + data + '</a>';
            }
          },{
            "sTitle" : "原价",
            "mData": "price",
            "mRender": function(data, type, full){
              return data/100 + "元";
            }
          },{
            "sTitle" : "属性",
            "mData": "property"
          },{
            "sTitle" : "操作",
            "mData": null,
            "bSearchable": false,
            "bSortable": false,
            "mRender": function(){
              return "";
            }
          }
        ]
      };

      $scope.open = function (size) {
        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: function ($scope, $modalInstance) {
            $scope.ok = function () {
              var postData = {
                  detail_url: encodeURIComponent($("#pd_detail_url").val())
              }
              $http({
                url: '/restful/products',
                method: 'post',
                data: postData,
              }).success(function(ret_data){
                  if(ret_data.success){
                    scope.sampleProductCategories.unshift(ret_data.data);
                    $modalInstance.close();
                  }else{
                    if(ret_data.msg){
                      alert(ret_data.msg + "，请联系客服");
                    }else{
                      alert("抓取您的商品信息失败，请联系我们的客服");
                    }
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
      };
                
    }]);

    // app.register.controller('ModalDemoCtrl', ['$scope','$modal','$log',function ($scope, $modal, $log) {

    //   $scope.items = ['item1', 'item2', 'item3'];

    //   $scope.open = function (size) {

    //     var modalInstance = $modal.open({
    //       templateUrl: 'myModalContent.html',
    //       controller: ModalInstanceCtrl,
    //       size: size,
    //       resolve: {
    //         items: function () {
    //           return $scope.items;
    //         }
    //       }
    //     });

    //     modalInstance.result.then(function (selectedItem) {
    //       $scope.selected = selectedItem;
    //     }, function () {
    //       $log.info('Modal dismissed at: ' + new Date());
    //     });
    //   };

    //   var ModalInstanceCtrl = function ($scope, $modalInstance, items) {
    //     $scope.items = items;
    //     $scope.selected = {
    //       item: $scope.items[0]
    //     };

    //     $scope.ok = function () {
    //       $modalInstance.close($scope.selected.item);
    //     };

    //     $scope.cancel = function () {
    //       $modalInstance.dismiss('cancel');
    //     };
    //   };

    // }]);

  }
});