define(function (require, exports, module) {
  'use strict';

  var navigation = require('../lib/navigation');

  module.exports = function(app){
    //Step6: use `app.register` to register controller/service/directive/filter
    app.register.controller('pages_add', ['$scope', '$routeParams', '$location', '$http',
      function($scope, $routeParams, $location, $http){
        navigation.navigate();
        //获取页面的入参
        var id = $routeParams.id;
        $http.get('data/testA.json').then(function(res){
          $scope.dataObj = res;
        }, function(res){
          console.log('err', res)
        });
      }]
    );
  }
});