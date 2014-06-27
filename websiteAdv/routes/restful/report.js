var request = require('request');

exports.getReport = function(req, res){
	var data = req.body;

	request({url:'http://www.jdyun.mobi/ad_stat', qs:data}, function(err, response, body) {
		if(err) { 
			res.send(500, "error");  
		}
		res.send(200, body);
	});

}