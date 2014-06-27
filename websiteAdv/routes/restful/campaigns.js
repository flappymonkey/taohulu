var moment = require("moment");

exports.getAll = function(req, res){
	req.mysql.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            connection.query('SELECT * FROM campaigns where status=0 and nick="' + req.session.user_id + '"', function(err, rows, fields) {
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
                    data:   rows,
                    length: rows.length
                });
                connection.release();
            });
        }
    });
}

exports.getById = function(req, res){
    var campaign_id = req.params['id'];

    req.mysql.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            connection.query('SELECT * FROM campaigns where status=0 and campaign_id="' + campaign_id + '" and nick="' + req.session.user_id + '"', function(err, rows, fields) {
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
                    data:   rows[0]
                });
                connection.release();
            });
        }
    });
}

exports.add = function(req, res) {
	var now = moment().format("YYYY-MM-DD hh:mm:ss");
    var data = {
    	nick: req.session.user_id,
        title: req.body['title'],
        create_time: now,
        modified_time: now
    }
    req.mysql.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                success: false,
                        data:    err.code
            });
        } else {
            connection.query("insert into campaigns(nick,title,create_time,modified_time) values('" + data.nick + "','" + data.title + "','" + data.create_time + "','" + data.modified_time+ "')", function(err,results) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        success: false,
                        data: err.code
                    });
                }
                else{
                    res.send({
                        success: true,
                        data: results.insertId
                    });
                }
                connection.release();
            });
        }
    });
};

exports.batchUpdate = function(req, res){
    var campaign_ids = "(" + req.body['campaign_ids'] + ")";
    var modified_time = moment().format("YYYY-MM-DD hh:mm:ss");

    req.mysql.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                success: false,
                data: err.code
            });
        } else {
            var sql = "";
            if(req.body.online_status != undefined){
                sql = "update campaigns set online_status=" + req.body.online_status + ", modified_time='" + modified_time + "' where campaign_id in " + campaign_ids;
            }
            connection.query(sql, function(err,results) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        success: false,
                        data: err.code
                    });
                }
                else{
                    res.send({
                        success: true,
                        data: results
                    });
                }
                connection.release();
            });
        }
    });
}

exports.update = function(req, res) {
    var campaign_id = req.params['id'];
    var modified_time = moment().format("YYYY-MM-DD hh:mm:ss");

    req.mysql.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                success: false,
                data: err.code
            });
        } else {
            var sql = "";
            if(req.body.online_status){
                sql = "update campaigns set online_status=" + req.body.online_status + ", modified_time='" + modified_time + "' where campaign_id=" + campaign_id;
            }else if(req.body.budget){
                sql = "update campaigns set budget=" + req.body.budget + ", modified_time='" + modified_time + "' where campaign_id=" + campaign_id;
            }else if(req.body.market_time){
                sql = "update campaigns set market_time='" + req.body.market_time + "', modified_time='" + modified_time + "' where campaign_id=" + campaign_id;
            }else if(req.body.market_region){
                sql = "update campaigns set market_region='" + req.body.market_region + "', modified_time='" + modified_time + "' where campaign_id=" + campaign_id;
            }
            connection.query(sql, function(err,results) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        success: false,
                        data: err.code
                    });
                }
                else{
                    res.send({
                        success: true
                    });
                }
                connection.release();
            });
        }
    });
}

exports.delete = function(req, res) {

}