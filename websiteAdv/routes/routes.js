var filter = require('../lib/filter')
var index = require('./index');
var user = require('./user');
var products = require('./restful/products');
var campaigns = require('./restful/campaigns');
var adgroups = require('./restful/adgroups');
var creative = require('./restful/creative');
var finance = require('./restful/finance');
var userinfo = require('./restful/userinfo');
var report = require('./restful/report');

module.exports = function (app) {
    app.get('/spa', filter.authorize, index.index);
    app.get('/spa/user/login', user.login);
    app.post('/spa/user/login', user.dologin);
    app.get('/spa/user/logout', user.dologout);

    app.get('/restful/user', filter.ajaxAuth, userinfo.getUserInfo);
    app.post('/restful/user/passwd', filter.ajaxAuth, userinfo.passwd);

    app.get('/restful/products', filter.ajaxAuth, products.getAll);
    app.get('/restful/products/:id', filter.ajaxAuth, products.getById);
    app.post('/restful/products', filter.ajaxAuth, products.add);
    app.put('/restful/products/:id', filter.ajaxAuth, products.update);
    app.delete('/restful/products/:id', filter.ajaxAuth, products.delete);

    app.get('/restful/campaigns', filter.ajaxAuth, campaigns.getAll);
    app.get('/restful/campaigns/:id', filter.ajaxAuth, campaigns.getById);
    app.post('/restful/campaigns', filter.ajaxAuth, campaigns.add);
    app.put('/restful/campaigns', filter.ajaxAuth, campaigns.batchUpdate);
    app.put('/restful/campaigns/:id', filter.ajaxAuth, campaigns.update);
    app.delete('/restful/campaigns/:id', filter.ajaxAuth, campaigns.delete);

    app.get('/restful/adgroups', filter.ajaxAuth, adgroups.getAll);
    app.get('/restful/adgroups/:id', filter.ajaxAuth, adgroups.getById);
    app.post('/restful/adgroups', filter.ajaxAuth, adgroups.add);
    app.put('/restful/adgroups', filter.ajaxAuth, adgroups.batchUpdate);
    app.put('/restful/adgroups/:id', filter.ajaxAuth, adgroups.update);
    app.delete('/restful/adgroups', filter.ajaxAuth, adgroups.batchDelete);
    app.delete('/restful/adgroups/:id', filter.ajaxAuth, adgroups.delete);

    app.get('/restful/creative', filter.ajaxAuth, creative.getAll);
    app.get('/restful/creative/:id', filter.ajaxAuth, creative.getById);
    app.post('/restful/creative', filter.ajaxAuth, creative.add);
    app.put('/restful/creative/:id', filter.ajaxAuth, creative.update);
    app.delete('/restful/creative/:id', filter.ajaxAuth, creative.delete);

    app.get('/restful/finance', filter.ajaxAuth, finance.getAll);
    app.get('/restful/finance/:id', filter.ajaxAuth, finance.getById);
    app.post('/restful/finance', filter.ajaxAuth, finance.add);
    app.put('/restful/finance/:id', filter.ajaxAuth, finance.update);
    app.delete('/restful/finance/:id', filter.ajaxAuth, finance.delete);

    app.post('/restful/report', filter.ajaxAuth, report.getReport);
};