define(function (require, exports, module) {
  "use strict";

  $(".topnav").delegate('.text','click',function(){
    $(".topnav .text").removeClass("current");
    $(this).addClass("current");
  });
  $(".topnav").delegate('.toggler','click',function(){
    if( $(this).next().is(':hidden') ){
      $(".topnav .subnav").hide();
      $("i",this).removeClass("fa-chevron-right").addClass("fa-chevron-down");
      $(this).next().show();
    }else{
      $("i",this).removeClass("fa-chevron-down").addClass("fa-chevron-right");
      $(this).next().hide();
    }
  });

  var app = angular.module('app', ['angular-lazyload', 'ngRoute', 'ui.bootstrap', 'highcharts-ng']);

  //配置期
  app.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {    
    $locationProvider.hashPrefix('!');
    $routeProvider
      .when('/home', {
        controller: 'home',
        controllerUrl: 'controller/home.js',
        templateUrl: 'views/home.html'
      })
      .when('/campaigns/index', {
        controller: 'campaigns',
        controllerUrl: 'controller/campaigns.js',
        templateUrl: 'views/campaigns.html'
      })
      .when('/campaigns/add', {
        controller: 'new_campaign',
        controllerUrl: 'controller/new_campaign.js',
        templateUrl: 'views/new_campaign.html'
      })
      .when('/campaigns/adgroups/index', {
        controller: 'adgroups',
        controllerUrl: 'controller/adgroups.js',
        templateUrl: 'views/adgroups.html'
      })
      .when('/campaigns/adgroups/items/detail', {
        controller: 'detail',
        controllerUrl: 'controller/detail.js',
        templateUrl: 'views/detail.html'
      })
      .when('/campaigns/adgroup-item-add', {
        controller: 'adgroup_item_add',
        controllerUrl: 'controller/adgroup_item_add.js',
        templateUrl: 'views/adgroup_item_add.html'
      })
      .when('/campaigns/adgroups/items/add', {
        controller: 'items_add',
        controllerUrl: 'controller/items_add.js',
        templateUrl: 'views/items_add.html'
      })
      .when('/campaigns/adgroups/pages/add', {
        controller: 'pages_add',
        controllerUrl: 'controller/pages_add.js',
        templateUrl: 'views/pages_add.html'
      })
      .when('/products/index', {
        controller: 'productCtrl',
        controllerUrl: 'controller/products.js',
        templateUrl: 'views/products.html'
      })
      .when('/account/recharge', {
        controller: 'recharge',
        controllerUrl: 'controller/recharge.js',
        templateUrl: 'views/recharge.html'
      })
      .when('/account/finance', {
        controller: 'financeCtrl',
        controllerUrl: 'controller/finance.js',
        templateUrl: 'views/finance.html'
      })
      .when('/report/index', {
        controller: 'report',
        controllerUrl: 'controller/report.js',
        templateUrl: 'views/report.html'
      })
      .when('/report/campaign', {
        controller: 'report_campaign',
        controllerUrl: 'controller/report_campaign.js',
        templateUrl: 'views/report_campaign.html'
      })
      .when('/report/adgroup', {
        controller: 'report_adgroup',
        controllerUrl: 'controller/report_adgroup.js',
        templateUrl: 'views/report_adgroup.html'
      })
      .when('/report/dailydetails', {
        controller: 'report_dailydetails',
        controllerUrl: 'controller/report_dailydetails.js',
        templateUrl: 'views/report_dailydetails.html'
      })
      .when('/user/passwd', {
        controller: 'passwd',
        controllerUrl: 'controller/passwd.js',
        templateUrl: 'views/passwd.html'
      })
      .otherwise({
        redirectTo: '/home'
      });
    }
  ]);

  //运行期
  app.run(['$lazyload', function($lazyload){
    //Step5: init lazyload & hold refs
    $lazyload.init(app);
    app.register = $lazyload.register;
  }]);

  app.directive('myDatatable', function() {
    return function(scope, element, attrs) {
      var options = {
        "bDeferRender": true,
        "aLengthMenu": [10, 20, 50],
        "iDisplayLength": 10,
        "oLanguage": {
            "sLengthMenu": "每页显示 _MENU_条",
            "sZeroRecords": "没有找到符合条件的数据",
            "sProcessing": "&lt;img src=’./loading.gif’ /&gt;",
            "sInfo": "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条",
            "sInfoEmpty": "没有记录",
            "sInfoFiltered": "(从 _MAX_ 条记录中过滤)",
            "sSearch": "搜索：",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "前一页",
                "sNext": "后一页",
                "sLast": "尾页"
            }
        },
        "sPaginationType": "full_numbers",
        "bSortClasses":false,
        "aaSorting" : [],   
        "bAutoWidth":false
      };
      if (attrs.dtOptions.length > 0) {
        options = $.extend(options,scope.$eval(attrs.dtOptions));
      }
      var dataTable = element.dataTable(options);
      
      scope.$watch(attrs.dtData, function(value) {
        var val = value || null;
        if (val) {
            dataTable.fnClearTable();
            dataTable.fnAddData(scope.$eval(attrs.dtData));
        }
      }, true);
    };
  });

  app.directive('myHighChart', function(){
    return {
      restrict: 'E',
      template: '<div></div>',
      scope: {
          chartData: "=value",
          chartObj: "=?"
      },
      transclude: true,
      replace: true,
      link: function($scope, $element, $attrs) {

          //Update when charts data changes
          $scope.$watch('chartData', function(value) {
              if (!value)
                  return;

              // use default values if nothing is specified in the given settings
              $scope.chartData.chart.renderTo = $scope.chartData.chart.renderTo || $element[0];
              if ($attrs.type)
                  $scope.chartData.chart.type = $scope.chartData.chart.type || $attrs.type;
              if ($attrs.height)
                  $scope.chartData.chart.height = $scope.chartData.chart.height || $attrs.height;
              if ($attrs.width)
                  $scope.chartData.chart.width = $scope.chartData.chart.type || $attrs.width;

                console.log($scope.chartData);
              $scope.chartObj = new Highcharts.Chart($scope.chartData);
          });
      }
    };
  });

  app.directive('myChart', function(){
    return {
      restrict: 'E',
      template: '<div></div>',
      scope: {
          chartData: "=value",
          chartObj: "=?"
      },
      transclude: true,
      replace: true,
      link: function($scope, $element, $attrs) {
        console.log("triggered  .......");

          //Update when charts data changes
          $scope.$watch('chartData', function(value) {
              if (!value)
                  return;

              // use default values if nothing is specified in the given settings
              $scope.chartData.chart.renderTo = $scope.chartData.chart.renderTo || $element[0];
              if ($attrs.type)
                  $scope.chartData.chart.type = $scope.chartData.chart.type || $attrs.type;
              if ($attrs.height)
                  $scope.chartData.chart.height = $scope.chartData.chart.height || $attrs.height;
              if ($attrs.width)
                  $scope.chartData.chart.width = $scope.chartData.chart.type || $attrs.width;

              $scope.chartObj = new Highcharts.Chart($scope.chartData);
          });
      }
    };
  });

  app.directive('myDaterange', function() {
    return function(scope, element, attrs) {
      var options = {
        locale: {
          applyLabel: '确定',
          cancelLabel: '取消',
          fromLabel: '从',
          toLabel: '到',
          weekLabel: '周',
          customRangeLabel: '自定义区间',
          daysOfWeek: ['日', '一', '二', '三', '四', '五','六'],
          monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          firstDay: 1
        }
      };
      var callback = function(start, end) {
          $(element).find('span').html(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
      }
      
      if (attrs.myDaterange) {
          options = $.extend(options,scope.$eval(attrs.myDaterange));
      }

      if (attrs.callback) {
          callback = scope.$eval(attrs.callback);
      }
      
      element.daterangepicker(options, callback);
        
    };
  });

  app.factory('myajax', ['$http', '$window', function($http,$window){
    return function(config, callback){
      var ori_config = {
        method: 'get'
      }
      ori_config = $.extend(ori_config,config);
      $http(ori_config).success(function(ret_data){
        if(ret_data.success){
          callback(ret_data.data);
        }else{
          if(ret_data.code == -1){
            $window.location.href = "/user/login";
          }
        }
      });
    }
  }]);

  module.exports = app;
});