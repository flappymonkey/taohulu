var http = require("http");
var mysql = require("mysql");
var moment = require("moment");
var crypto = require('crypto');
var conn = null;

TEST_DATABASE = "jdyun_adv";

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
		console.log('connect db success');
	}
});

// conn.query('drop database ' + TEST_DATABASE);
conn.query('create database IF NOT EXISTS ' + TEST_DATABASE + ' DEFAULT CHARACTER SET utf8');
conn.query("use " + TEST_DATABASE);
conn.query("create table IF NOT EXISTS campaigns(campaign_id int(11) AUTO_INCREMENT primary key, \
	nick varchar(32), \
	title varchar(48), \
	settle_reason varchar(16), \
	settle_status tinyint(1) DEFAULT 1, \
	online_status tinyint(1) DEFAULT 1, \
	budget int(11) DEFAULT 5000, \
	current_cost int(11) DEFAULT 0, \
	market_time varchar(512) DEFAULT '-1', \
	market_region varchar(10240) DEFAULT '-1', \
	create_time datetime, \
	modified_time datetime, \
	status tinyint(1) DEFAULT 0) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8", 
	function(err){
		if(err){
			console.log(err);
		}
	}
);

conn.query("create table IF NOT EXISTS adgroups(adgroup_id int(11) AUTO_INCREMENT primary key, \
	nick varchar(32), \
	campaign_id int(11), \
	type tinyint(1), \
	item_id bigint(20), \
	default_price int(11), \
	online_status tinyint(1) DEFAULT 1, \
	reason varchar(400), \
	create_time datetime, \
	modified_time datetime, \
	status tinyint(1) DEFAULT 0) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8", 
	function(err){
		if(err){
			console.log(err);
		}
	}
);

conn.query("create table IF NOT EXISTS products(product_id bigint(20) AUTO_INCREMENT primary key, \
	num_iid bigint(20), \
	nick varchar(32), \
	title varchar(512), \
	cid int(11), \
	price int(11), \
	quantity int(11), \
	sales_count int(11), \
	delist_time datetime, \
	list_time datetime, \
	publish_time datetime, \
	pic_url varchar(1024), \
	detail_url varchar(1024), \
	digest varchar(1024), \
	property varchar(1024) ) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8", 
	function(err){
		if(err){
			console.log(err);
		}
	}
);

conn.query("create table IF NOT EXISTS creative(creative_id int(11) AUTO_INCREMENT primary key, \
	nick varchar(32), \
	campaign_id int(11), \
	adgroup_id int(11), \
	audit_status tinyint(1) DEFAULT 0, \
	online_status tinyint(1) DEFAULT 1, \
	audit_desc varchar(512), \
	create_time datetime, \
	modified_time datetime, \
	category_ids varchar(64), \
	title varchar(64), \
	img_url varchar(1024), \
	detail_url varchar(1024), \
	price int(11), \
	publish_time datetime, \
	digest varchar(1024), \
	property varchar(1024), \
	details text, \
	trend_url varchar(1024), \
	flush varchar(1024), \
	lowest_price int(11), \
	highest_price int(11), \
	status tinyint(1) DEFAULT 0, \
	good_id varchar(20),
	sales int(11) ) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8", 
	function(err){
		if(err){
			console.log(err);
		}
	}
);

conn.query("create table IF NOT EXISTS b2c_item(item_id int(11) AUTO_INCREMENT primary key, \
	creative_id int(11), \
	b2c_name varchar(32), \
	b2c_price int(11), \
	b2c_url varchar(1024) ) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8", 
	function(err){
		if(err){
			console.log(err);
		}
	}
);

conn.query("create table IF NOT EXISTS comment(comment_id int(11) AUTO_INCREMENT primary key, \
	creative_id int(11), \
	nick varchar(32), \
	content varchar(1024), \
	comment_time datetime ) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8", 
	function(err){
		if(err){
			console.log(err);
		}
	}
);

conn.query("create table IF NOT EXISTS user( \
	username varchar(30) primary key, \
	password varchar(128), \
	last_login datetime, \
	is_active tinyint(1) DEFAULT 1, \
	balance int DEFAULT 0, \
	credit int DEFAULT 0) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8", 
	function(err){
		if(err){
			console.log(err);
		}
	}
);

conn.query("create table IF NOT EXISTS finance( \
	finance_id int(11) AUTO_INCREMENT primary key, \
	nick varchar(32), \
	create_time datetime, \
	expense int(11), \
	income int(11), \
	surplus int(11), \
	bak varchar(32)) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8",
	function(err){
		if(err){
			console.log(err);
		}
	}
);

conn.query("insert into finance(nick, create_time, expense, surplus, bak) values('test', '" + moment().format('YYYY-MM-DD hh:mm:ss') + "', 20,1000,'花费')");
conn.query("insert into finance(nick, create_time, income, surplus, bak) values('test', '" + moment().format('YYYY-MM-DD hh:mm:ss') + "', 20,1000,'收入')");


conn.query("insert into user(username, password, last_login, is_active) values('test', '" + crypto.createHash('md5').update('test').digest('hex') + "', '" + moment().format('YYYY-MM-DD hh:mm:ss') + "', 1)", 
	function(err){
		if(err){
			console.log(err);
		}else{
			process.exit();
		}
	});
console.log("数据库创建并初始化成功");

// process.exit(); //加了这个会导致数据库还没创建进程就退出，建表就失败

