var moment = require('moment');

exports.getAll = function(req, res){
	var campaign_id = req.query['campaign_id'];

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
            if(campaign_id != undefined){
                sql = 'SELECT a.adgroup_id, a.type, a.default_price, a.online_status, a.create_time, a.modified_time, p.title, p.price, p.pic_url, p.detail_url FROM adgroups a, products p where a.item_id = p.product_id and a.status=0 and a.campaign_id=' + campaign_id + ' and a.nick="' + req.session.user_id + '"';
            }else{
                sql = 'SELECT a.adgroup_id, a.type, a.default_price, a.online_status, a.create_time, a.modified_time, p.title, p.price, p.pic_url, p.detail_url, c.campaign_id, c.title as campaign_title FROM adgroups a, products p , campaigns c where a.item_id = p.product_id and a.campaign_id = c.campaign_id and a.status=0 and a.nick="' + req.session.user_id + '"';
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
            var sql = 'SELECT a.adgroup_id, a.type, a.default_price, a.online_status, a.create_time, a.modified_time, p.title, p.price, p.pic_url, p.detail_url FROM adgroups a, products p where a.item_id = p.product_id and a.status=0 and a.adgroup_id=' + adgroup_id + ' and a.nick="' + req.session.user_id + '"';
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
        campaign_id: req.body['campaign_id'],
        type: req.body['type'],
        item_id: req.body['item_id'],
        default_price: req.body['default_price'],
        create_time: now,
        modified_time: now
    }
    req.mysql.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                success: false,
                data: err.code
            });
        } else {
            connection.query("insert into adgroups(nick,campaign_id,type,item_id,default_price,create_time,modified_time) values('" + data.nick + "'," + data.campaign_id + "," + data.type + "," + data.item_id + "," + data.default_price + ",'" + data.create_time + "','" + data.modified_time+ "')", function(err,results) {
                if (err) {
                    console.error(err);
                    connection.release();
                    res.statusCode = 500;
                    res.send({
                        success: false,
                        data: err.code
                    });
                }
                else{
                    var adgroup_id = results.insertId
                    connection.query('select * from products where product_id=' + data.item_id, function(err, rows) {
                        if (err) {
                            console.error(err);
                            connection.release();
                            res.statusCode = 500;
                            res.send({
                                result: 'error',
                                err:    err.code
                            });
                        }else{
                            var product_info = rows[0];
                            //新建推广组的时候，默认新建了一个创意
                            connection.query("insert into creative(nick,campaign_id,adgroup_id,create_time,modified_time,title,price,img_url,detail_url,property) values('" + data.nick + "'," + data.campaign_id + "," + adgroup_id + ",'" + data.create_time + "','" + data.modified_time + "','" + product_info.title + "'," + product_info.price + ",'" + product_info.pic_url + "','" + product_info.detail_url + "','" + product_info.property + "')", function(err,data) {
                                if (err) {
                                    console.error(err);
                                    connection.release();
                                    res.statusCode = 500;
                                    res.send({
                                        result: 'error',
                                        err:    err.code
                                    });
                                }else{
                                    res.send({
                                        success: true,
                                        data: data.insertId
                                    });
                                    connection.release();
                                }
                            });
                        }
                    });
                    
                }
            });
        }
    });
}

exports.batchUpdate = function(req, res){
    var adgroup_ids = "(" + req.body['adgroup_ids'] + ")";
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
                sql = "update adgroups set online_status=" + req.body.online_status + ", modified_time='" + modified_time + "' where adgroup_id in " + adgroup_ids;
            }else if(req.body.default_price != undefined){
                sql = "update adgroups set default_price=" + req.body.default_price + ", modified_time='" + modified_time + "' where adgroup_id in " + adgroup_ids;
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
	var adgroup_id = req.params['adgroup_id'];
    if(req.body.budget){
        req.mysql.getConnection(function(err, connection) {
            if (err) {
                console.error('CONNECTION error: ',err);
                res.statusCode = 503;
                res.send({
                    success: false,
                            data:    err.code
                });
            } else {
                connection.query("update adgroups set budget=" + req.body.budget + ", modified_time='" + moment().format("YYYY-MM-DD hh:mm:ss") + "' where campaign_id=" + campaign_id, function(err,results) {
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
    }else if(req.body.market_time){
        req.mysql.getConnection(function(err, connection) {
            if (err) {
                console.error('CONNECTION error: ',err);
                res.statusCode = 503;
                res.send({
                    success: false,
                            data:    err.code
                });
            } else {
                connection.query("update campaigns set market_time='" + req.body.market_time + "', modified_time='" + moment().format("YYYY-MM-DD hh:mm:ss") + "' where campaign_id=" + campaign_id, function(err,results) {
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
    }else if(req.body.market_region){
        req.mysql.getConnection(function(err, connection) {
            if (err) {
                console.error('CONNECTION error: ',err);
                res.statusCode = 503;
                res.send({
                    success: false,
                    data: err.code
                });
            } else {
                connection.query("update campaigns set market_region='" + req.body.market_region + "', modified_time='" + moment().format("YYYY-MM-DD hh:mm:ss") + "' where campaign_id=" + campaign_id, function(err,results) {
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
    }
}

exports.batchDelete = function(req, res) {
    var adgroup_ids = "(" + req.query['adgroup_ids'] + ")";
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
            var sql = "update adgroups set status=1, modified_time='" + modified_time + "' where adgroup_id in " + adgroup_ids;
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

exports.delete = function(req, res) {
    var adgroup_id = req.params['adgroup_id'];
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
            var sql = "update adgroups set status=1, modified_time='" + modified_time + "' where adgroup_id=" + adgroup_id;
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