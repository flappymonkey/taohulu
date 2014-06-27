var moment = require('moment');
var request = require('request');

exports.getAll = function(req, res) {
    var nick = req.session.user_id;
    req.mysql.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            connection.query('SELECT * FROM products where nick="' + nick + '"', function(err, rows, fields) {
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
};

exports.getById = function(req, res) {
    var campaign_id = req.params['id'];
    var nick = req.session.user_id;

    req.mysql.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            connection.query('select * from products where nick="' + nick + '" and product_id not in (select item_id from adgroups where status=0 and campaign_id=' + campaign_id + ')', function(err, rows, fields) {
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
};

exports.add = function(req, res) {
    url = req.body['detail_url'];
    request('http://admin.jdyun.mobi/get_product_info?url='+url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);
            if(!json['title']){
                res.send({
                    success: false,
                    code: 10,
                    msg: '抓取商品信息失败'
                });
                return;
            }
            var property = "";
            if(json['desc_score']){
                property += "描述  " + json['desc_score']/10 + "\n";
            }
            if(json['service_score']){
                property += "服务  " + json['service_score']/10 + "\n";
            }
            if(json['deliver_score']){
                property += "物流  " + json['deliver_score']/10 + "\n";
            }
            var data = {
                nick: req.session.user_id,
                detail_url: json['go_link'],
                pic_url: json['crawl_desc_img'],
                title: json['title'],
                price: json['ori_price'],
                property: property,
                publish_time: moment(json['pub_time']*1000).format("YYYY-MM-DD hh:mm:ss")
            }
            var insert_query = "";
            if(json['good_id']){
                data['num_iid'] = json['good_id'];
                insert_query = "insert into products(num_iid,nick,detail_url,pic_url,title,price,property,publish_time) values(" + data['num_iid'] + ",'" + data.nick + "','" + data.detail_url + "','" + data.pic_url + "','" + data.title+ "'," + data.price + ",'" + data.property + "','" + data.publish_time + "')";
            }else{
                insert_query = "insert into products(nick,detail_url,pic_url,title,price,property,publish_time) values('" + data.nick + "','" + data.detail_url + "','" + data.pic_url + "','" + data.title+ "'," + data.price + ",'" + data.property + "','" + data.publish_time + "')";
            }

            req.mysql.getConnection(function(err, connection) {
                if (err) {
                    console.error('CONNECTION error: ',err);
                    res.statusCode = 503;
                    res.send({
                        result: 'error',
                        err:    err.code
                    });
                } else {
                    connection.query(insert_query, function(err,results, fields) {
                        if (err) {
                            console.error(err);
                            res.statusCode = 500;
                            res.send({
                                success: false,
                                data:    err.code
                            });
                        }
                        else{
                            data.product_id = results.insertId;
                            res.send({
                                success: true,
                                data: data
                            });
                        }
                        connection.release();
                    });
                }
            });
        }else{
            res.send({
                success: false,
                code: 10,
                msg: '抓取商品信息失败'
            });
        }
    })
};

exports.update = function(req, res) {
    res.setHeader({ 'Content-Type': 'application/json' });
};

exports.delete = function(req, res) {
    res.setHeader({ 'Content-Type': 'application/json' });
};