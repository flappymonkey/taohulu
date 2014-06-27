define(function (require, exports, module) {
  'use strict';

  var navigation = require('../lib/navigation');

  module.exports = function(app){
    //Step6: use `app.register` to register controller/service/directive/filter
    app.register.controller('passwd', ['$scope', '$routeParams', '$location', '$http',
      function($scope, $routeParams, $location, $http){
        navigation.navigate();

        
        $scope.submit = function(){
          var oldpassword = $("#oldpassword").val();
          var newpassword = $("#newpassword").val();
          var repassword = $("#repassword").val();
          if(oldpassword == "" || newpassword == "" || repassword == ""){
            alert("密码不能为空");
            return;
          }
          if(newpassword != repassword){
            alert("两次密码不一致，请重新输入");
            return;
          }

          $http({
            url: '/restful/user/passwd',
            method: 'post',
            data: {
              oldpassword: oldpassword,
              newpassword: newpassword
            },
          }).success(function(ret_data){
              if(ret_data.success){
                alert("密码修改成功");
                $("#oldpassword").val("");
                $("#newpassword").val("");
                $("#repassword").val("");
              }else{
                alert(ret_data.msg);
              }
          });
        }
        
      }]
    );
  }
});