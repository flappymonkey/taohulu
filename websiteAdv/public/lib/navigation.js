define(function (require, exports, module) {
  'use strict';

  module.exports = {
    navigate: function(){
		$(".topnav .text").removeClass("current");
		var hash = window.location.hash;
		if(hash.indexOf("?") != -1){
			hash = hash.substring(0, hash.indexOf('?'));
		}
		switch(hash){
			case '#!/home':
				$("#menu_home").addClass("current");
				break;
			case '#!/campaigns/index':
				$("#menu_campaigns").addClass("current");
				break;
			case '#!/campaigns/add':
				$("#menu_campaigns").addClass("current");
				break;
			case '#!/campaigns/adgroups/index':
				$("#menu_campaigns").addClass("current");
				break;
			case '#!/campaigns/adgroups/items/detail':
				$("#menu_campaigns").addClass("current");
				break;
			case '#!/campaigns/adgroup-item-add':
				$("#menu_campaigns").addClass("current");
				break;
			case '#!/campaigns/adgroups/items/add':
				$("#menu_campaigns").addClass("current");
				break;
			case '#!/campaigns/adgroups/pages/add':
				$("#menu_campaigns").addClass("current");
				break;
			case '#!/products/index':
				$("#menu_products").addClass("current");
				break;
			case '#!/account/recharge':
				$(".topnav .subnav").hide();
				$("#menu_account i").removeClass("fa-chevron-right").addClass("fa-chevron-down");
		  		$("#menu_account").next().show();
				$("#menu_recharge").addClass("current");
				break;
			case '#!/account/finance':
				$(".topnav .subnav").hide();
				$("#menu_account i").removeClass("fa-chevron-right").addClass("fa-chevron-down");
		  		$("#menu_account").next().show();
				$("#menu_finance").addClass("current");
				break;
			case '#!/report/index':
				$("#menu_report").addClass("current");
				break;
			case '#!/report/campaign':
				$("#menu_report").addClass("current");
				break;
			case '#!/report/adgroup':
				$("#menu_report").addClass("current");
				break;
			case '#!/report/dailydetails':
				$("#menu_report").addClass("current");
				break;
			case '#!/user/passwd':
				$(".topnav .subnav").hide();
				$("#menu_user i").removeClass("fa-chevron-right").addClass("fa-chevron-down");
				$("#menu_user").next().show();
				$("#menu_passwd").addClass("current");
				break;
			default:
				break;
		}
    }
  }
});