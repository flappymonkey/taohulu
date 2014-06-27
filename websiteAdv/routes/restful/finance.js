exports.getAll = function(req, res) {
    var nick = req.session.user_id;
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;
    req.mysql.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            var query = 'SELECT * FROM finance where nick = "' + nick + '" and create_time >= "' + startDate + '" and create_time <= "' + endDate + '"';
            connection.query('SELECT * FROM finance where nick = "' + nick + '" and create_time >= "' + startDate + '" and create_time <= "' + endDate + '"', function(err, rows, fields) {
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
    console.log("get by id");
    console.log('set json');
    res.send({
        success: true,
        data: [{
            pic: 'sdf',
            title: '标题',
            price: 123,
            sales: 23,
            stock: 34
        }]
    });
};

exports.add = function(req, res) {
    
};

exports.update = function(req, res) {
    
};

exports.delete = function(req, res) {
    
};