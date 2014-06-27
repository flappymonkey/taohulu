exports.authorize = function(req, res, next) {
	if (!req.session.user_id) {
		res.redirect('/user/login');
		// next();
	} else {
		next();
	}
}

exports.ajaxAuth = function(req, res, next){
	if (!req.session.user_id) {
		res.send({
            success: false,
            code: -1,
            msg: 'session expired' 
        });
	}else{
		next();
	}
}