exports.index = function(req, res) {
    var data = {
    	nick: req.session.user_id
    };
    res.render('index', data);
};
