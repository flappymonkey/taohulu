define(function (require, exports, module) {
  'use strict';

  require('daterangepicker-css');
  require('datatables');
  require('momentjs');
  require('daterangepicker');

  var navigation = require('../lib/navigation');

  module.exports = function(app){

    app.register.controller('financeCtrl', ['$scope','$http',
      function($scope, $http){
        navigation.navigate();
        var scope = $scope;

        $scope.startDate = moment().subtract('days', 29).format('YYYY-MM-DD');
        $scope.endDate = moment().format('YYYY-MM-DD');

        getFinance();
        function getFinance(){
          $http({
            url: '/restful/finance',
            method: 'get',
            params: {
              startDate: $scope.startDate + " 00:00:00",
              endDate: $scope.endDate + " 23:59:59"
            },
          }).success(function(ret_data){
              if(ret_data.success){
                $scope.financeData = ret_data.data;
              }
          });
        }

        $scope.financeData = null;

        $scope.daterangeOptions = {
          ranges: {
             '今天': [moment(), moment()],
             '昨天': [moment().subtract('days', 1), moment().subtract('days', 1)],
             '过去7天': [moment().subtract('days', 6), moment()],
             '过去30天': [moment().subtract('days', 29), moment()],
             '过去3个月': [moment().subtract('days', 89), moment()]
          },
          startDate: moment().subtract('days', 29),
          endDate: moment()
        };

        $scope.dateRangeCallback = function(start, end) {
            $scope.startDate = start.format('YYYY-MM-DD');
            $scope.endDate = end.format('YYYY-MM-DD');
            getFinance();
            // $('#reportrange span').html(start.format('YYYY-MM-DD') + ' 至 ' + end.format('YYYY-MM-DD'));
            $scope.$apply();
        };

        // $http.get('/restful/finance').success(function(ret_data) {
        //   if(ret_data.success){
        //     $scope.financeData = ret_data.data;
        //   }
        // });          
        
        $scope.overrideOptions = {
          "sDom": '',
          "aoColumns": [{
            "sTitle" : "日期",
            "mData": "create_time",
            "bSearchable": false,
            "bSortable": false,
            "mRender": function(data, type, full){
              return moment(data).format("YYYY-MM-DD hh:mm:ss");
            }
          },{
            "sTitle" : "支出(元)",
            "mData": "expense",
            "bSearchable": false,
            "bSortable": false
          },{
            "sTitle" : "存入(元)",
            "mData": "income",
            "bSearchable": false,
            "bSortable": false
          },{
            "sTitle" : "日终结余(元)",
            "mData": "surplus",
            "bSearchable": false,
            "bSortable": false
          },{
            "sTitle" : "备注",
            "mData": "bak",
            "bSearchable": false,
            "bSortable": false
          }]
        };
      }]
    );
  }
});