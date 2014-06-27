define(function (require, exports, module) {
  'use strict';

  var navigation = require('../lib/navigation');

  module.exports = function(app){
    //Step6: use `app.register` to register controller/service/directive/filter
    app.register.controller('new_campaign', ['$scope', '$http',
      function($scope, $http){
        navigation.navigate();
        
        $scope.submit = function(){
          var postData = {
            title: $("#campaign_name").val(),
            reuse_campaign_id: $("#reuse_campaign").val()
          };
          $http({
            url: '/restful/campaigns',
            method: 'post',
            data: postData,
          }).success(function(ret_data){
              if(ret_data.success){
                $(".new-campaign").hide();
            $(".campaign-add-result").show();
                $scope.campaignId = ret_data.data;
              }  
          });
        };

        $scope.createAgain = function(){
          $("#campaign_name").val("");
          $("#reuse_campaign").val("-1");
          $(".new-campaign").show();
          $(".campaign-add-result").hide();
        };

      }]
    );
  }
});