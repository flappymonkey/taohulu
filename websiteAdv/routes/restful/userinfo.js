var crypto = require('crypto');

exports.getUserInfo = function(req, res) {
    req.mysql.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            connection.query('select * from user where username="' + req.session.user_id + '"', function(err, rows, fields) {
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

exports.passwd = function(req, res){
    var oldpassword = crypto.createHash('md5').update(req.body['oldpassword']).digest('hex');
    var newpassword = crypto.createHash('md5').update(req.body['newpassword']).digest('hex');
    req.mysql.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            connection.query('select * from user where username="' + req.session.user_id + '" and password="' + oldpassword + '"', function(err, rows, fields) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err:    err.code
                    });
                }else{
                    if(rows.length){
                        connection.query('update user set password="' + newpassword + '" where username="' + req.session.user_id + '"', function(err, rows, fields){
                            if (err) {
                                console.error(err);
                                res.statusCode = 500;
                                res.send({
                                    result: 'error',
                                    err:    err.code
                                });
                            }else{
                                res.send({
                                    success: true,
                                });
                            }
                        });
                        
                    }else{
                        res.send({
                            success: false,
                            msg:   "当前密码错误"
                        });
                    }
                }
                
                connection.release();
            });
        }
    });
}