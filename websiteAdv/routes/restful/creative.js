exports.getAll = function(req, res){
	var campaign_id = req.query['campaign_id'];
	var adgroup_id = req.query['adgroup_id'];
	var creative_id = req.query['creative_id'];

    req.mysql.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            var sql = "";
            if(creative_id != undefined){
                sql = 'SELECT * FROM creative where creative_id=' + creative_id + ' and nick="' + req.session.user_id + '"';
            }else if(adgroup_id != undefined){
                sql = 'SELECT * FROM creative where adgroup_id=' + adgroup_id + ' and status=0 and nick="' + req.session.user_id + '"';
            }else if(campaign_id != undefined){
            	sql = 'SELECT a.*, p.title as adgroup_title, b.type FROM creative a, adgroups b, products p where a.adgroup_id=b.adgroup_id and b.item_id=p.product_id and a.status=0 and a.nick="' + req.session.user_id + '"';
            }else{
            	sql = 'SELECT a.*, p.title as adgroup_title, b.type, c.title as campaign_title FROM creative a, adgroups b, campaigns c, products p where a.adgroup_id=b.adgroup_id and b.item_id=p.product_id and a.campaign_id=c.campaign_id and a.status=0 and a.nick="' + req.session.user_id + '"';
            }
            connection.query(sql, function(err, rows, fields) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err:    err.code
                    });
                }
                res.send({
                    success: true,
                    data:   rows
                });
                connection.release();
            });
        }
    });
}

exports.getById = function(req, res){
    var adgroup_id = req.params['id'];

    req.mysql.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            var sql = "";
            if(adgroup_id != undefined){
                sql = 'SELECT * FROM creative where adgroup_id=' + adgroup_id + ' and status=0 and nick="' + req.session.user_id + '"';
            }
            connection.query(sql, function(err, rows, fields) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err:    err.code
                    });
                }
                res.send({
                    success: true,
                    data:   rows
                });
                connection.release();
            });
        }
    });
}

exports.add = function(req, res) {

}

exports.update = function(req, res) {

}

exports.delete = function(req, res) {

}