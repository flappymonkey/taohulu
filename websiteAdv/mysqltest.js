var http = require("http");
var mysql = require("mysql");
var crypto = require('crypto');
var conn = null;

TEST_DATABASE = "nodejs_test";
TEST_TABLE = "user_msg";

var db_options = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '123456'
}

conn = mysql.createConnection(db_options);
conn.connect(function(err){
	if(err){
		console.error('connect db ' + client.host + 'error:' + err);
		process.exit();
	}else{
		console.log("connect db success");
	}
})

conn.query('drop database ' + TEST_DATABASE);
conn.query('create database ' + TEST_DATABASE);
conn.query("use " + TEST_DATABASE);
conn.query("create table " + TEST_TABLE + "(id INT(11) AUTO_INCREMENT, name varchar(255), primary key (id) )");
conn.query("insert into "+TEST_TABLE+"(name) values ('nodejs_1')");
conn.query("insert into "+TEST_TABLE+"(name) values ('nodejs_2')");
conn.query("insert into "+TEST_TABLE+"(name) values ('" + crypto.createHash('md5').update('shenbin').digest('hex') + "')");
conn.query("insert into "+TEST_TABLE+"(name) values ('" + crypto.createHash('md5').update('shenbin').digest('hex') + "')");
conn.query("select * from  " +TEST_TABLE,function select(err,results,fields){
	if(err){
		throw err;
	}
	console.log(err);
	console.log(results);
	console.log(fields);
});


