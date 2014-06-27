var crypto = require('crypto');

exports.login = function(req, res){
	res.render('login');
}

exports.dologin = function(req, res){
	if(req.body.username && req.body.password){
      req.mysql.getConnection(function(err, connection) {
          if (err) {
              console.error('CONNECTION error: ',err);
              res.statusCode = 503;
              res.render('login', {});
          } else {
              connection.query('SELECT * FROM user WHERE username="' + req.body.username + '" and password="' + crypto.createHash('md5').update(req.body.password).digest('hex') + '" and is_active=1', function(err, rows, fields) {
                  if (err) {
                      console.error(err);
                      res.statusCode = 500;
                      res.render('login', {});
                  }
                  if(rows.length){
                    req.session.user_id = req.body.username;
                    req.session.cookie.expires = false;
                    res.redirect("/spa");
                  }else{
                    var data = {
                      error: true
                    }
                    res.render('login', data);
                  }
                  
                  connection.release();
              });
          }
      });
  	}else{
  		res.render('login', {});
  	}
}

exports.dologout = function(req, res){
  req.session.destroy(function(err){

  });
  res.redirect("/spa/user/login");
}
