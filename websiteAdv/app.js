var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var juicer = require('juicer');
var fs = require('fs');
var expressHbs = require('handlebars');

var routes = require('./routes/routes');

var filter = require('./lib/filter');

var app = express();
var orm = require('orm');
var mysql   = require('mysql'),
    // connectionpool = mysql.createPool({
    //     host     : 'localhost',
    //     user: 'root',
    //     password: '123456',
    //     database : 'jdyun_adv'
    // });
connectionpool = mysql.createPool({
    host     : 'jdyundb01.mysql.rds.aliyuncs.com',
    user: 'jdyun_ops',
    password: 'Jdyun123456',
    database : 'jdyun_adv'
});

var log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' }
  ]
});
var logger = log4js.getLogger('normal');
logger.setLevel('INFO');
app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
// app.set('view engine', 'ejs');
// app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'main.hbs'}));
// app.set('view engine', 'hbs');
app.set('view engine', 'html');
app.engine('html', function(path, options, fn){
    fs.readFile(path, 'utf8', function(err, str){
        if (err) return fn(err);
        str = juicer(str, options);
        fn(null, str);
    });
});

app.locals.title = "h"

app.use(favicon());
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'jdyun advertisement' }));
// app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(orm.express("mysql://root:123456@localhost/jdyun_adv", {
//     define: function (db, models, next) {
//         models.campaigns = db.define("campaigns", {
//             campaign_id:  { type: "integer", unique: true },
//             nick: { type: "text", size: 32 },
//             title: { type: "text", size: 48 },
//             settle_reason: { type: "text", size: 16 },
//             settle_status: { type: "integer" },
//             online_status: { type: "integer" },
//             budget: { type: "integer" },
//             market_time: { type: "text", size: 512 },
//             market_region: { type: "text", size: 10240 },
//             create_time: { type: "text" },
//             modified_time: { type: "text" }
//         });
//         models.adgroups = db.define("adgroups",{
//             adgroup_id:  { type: "integer", unique: true },
//             nick: { type: "text", size: 32 },
//             campaign_id:  { type: "integer" },
//             type: { type: "integer" },
//             item_iid: { type: "integer" },
//             default_price: { type: "integer" },
//             online_status: { type: "integer" },
//             reason: { type: "text" },
//             create_time: { type: "text" },
//             modified_time: { type: "text" }
//         });
//         models.items = db.define("items",{
//             num_iid: { type: "integer", unique: true },
//             nick: { type: "text" },
//             title: { type: "text" },
//             cid: { type: "integer" },
//             price: { type: "integer" },
//             quantity: { type: "integer" },
//             sales_count: { type: "integer" },
//             delist_time: { type: "text" },
//             list_time: { type: "text" },
//             publish_time: { type: "text" },
//             pic_url: { type: "text" },
//             detail_url: { type: "text" },
//             digest: { type: "text" },
//             property: { type: "text" }
//         });
//         models.creative = db.define("creative",{
//             creative_id: { type: "integer", unique: true },
//             nick: { type: "text" },
//             campaign_id: { type: "integer" },
//             adgroup_id: { type: "integer" },
//             audit_status: { type: "integer" },
//             audit_desc: { type: "text" },
//             create_time: { type: "text" },
//             modified_time: { type: "text" },
//             category_ids: { type: "text" }, 
//             title: { type: "text" },
//             img_url: { type: "text" },
//             detail_url: { type: "text" },
//             price: { type: "integer" },
//             publish_time: { type: "text" },
//             digest: { type: "text" },
//             property: { type: "text" },
//             desc: { type: "text" },
//             trend_url: { type: "text" }
//         });
//         models.b2c_item = db.define("b2c_item",{
//             item_id: { type: "integer", unique: true },
//             creative_id: { type: "integer" },
//             b2c_name: { type: "text" },
//             b2c_price: { type: "integer" },
//             b2c_url: { type: "text" }
//         });
//         models.comment = db.define("comment",{
//             comment_id: { type: "integer", unique: true },
//             creative_id: { type: "integer" },
//             nick: { type: "text" },
//             content: { type: "text" },
//             comment_time: { type: "text" }
//         });
//         next();
//     }
// }));

app.use(function(req, res, next){
    req.mysql = connectionpool;
    next();
});

routes(app);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
