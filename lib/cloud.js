var fh = require('fh-mbaas-api');
var getWeather = require('./weather').getWeather;
var db = require('./databrowser');
var activity = require('./activity');
var util = require('util');

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var http = require('http')

var optionspost = {
    host: '52.26.13.96',
    port: 8181,
    path: '/fuse/techstock',
    method: 'POST'
};

function cloudRoute() {
    var cloud = new express.Router();
    cloud.use(cors());
    cloud.use(bodyParser());

    cloud.post('/hello', function (req, res) {
        activity.record({
            "action": "Client called Cloud App"
        }, function (err, docs) {
            if (err) console.error('Warning: ignoring error: ' + util.inspect(err));
            // see http://expressjs.com/4x/api.html#res.json
            res.json({
                text: 'Welcome Joe'
            });


        });
    });

    cloud.get('/login', function (req, res) {
        activity.record({
            "action": "Client called Cloud App -- Login"
        }, function (err, docs) {
            if (err) console.error('Warning: ignoring error: ' + util.inspect(err));
            //console.log(req.query.username);

            var options = {
                host: '52.26.13.96',
                port: 9001,
                path: '/fuse/techstock/getcustomer?username=' + req.query.username,
                accept: 'application/json',
                method: 'GET'
            };
            //console.log(optionsget.path);
            // do the GET request
            var data = "";

            var getCustomerRequest = http.request(options, function (getCustomerResponse) {
                //console.log("statusCode: ", getCustomerResponse.statusCode);
                getCustomerResponse.on('data', function (d) {
                    data += d;
                    //console.debug('\nCall completed');

                });
                getCustomerResponse.on("end", function () {
                    //console.debug("\nData: " + data);
                    //var jsonData = JSON.parse(data);
                    res.send(data);
                });
            });

            getCustomerRequest.end();
            getCustomerRequest.on('error', function (e) {
                console.error(e);
            });
        });
    });

    cloud.get('/getTransactions',  function(req,res){
        activity.record({
            "action": "Client called Cloud App -- Get Transactions"
        }, function (err, docs) {
            if (err) console.error('Warning: ignoring error: ' + util.inspect(err));
            var options = {
                host: '52.26.13.96',
                port: 9001,
                path: '/fuse/techstock/gettransactions?id=' + req.query.id,
                accept: 'application/json',
                method: 'GET'
            };
            // do the GET request
            var data = "";

            var getTransactionsRequest = http.request(options, function (getTransactionsResponse) {
                //console.log("statusCode: ", getCustomerResponse.statusCode);
                getTransactionsResponse.on('data', function (d) {
                    data += d;
                    //console.debug('\nCall completed');

                });
                getTransactionsResponse.on("end", function () {
                    //console.debug("\nData: " + data);
                    //var jsonData = JSON.parse(data);
                    res.send(data);
                });
            });

            getTransactionsRequest.end();
            getTransactionsRequest.on('error', function (e) {
                console.error(e);
            });
        });
    });

    cloud.get('/transferMoney', function(req,res){
        activity.record({
            "action": "Client called Cloud App -- Transfer Money"
        }, function (err, docs) {
            if (err) console.error('Warning: ignoring error: ' + util.inspect(err));
            var options = {
                host: '52.26.13.96',
                port: 9001,
                path: '/fuse/techstock/transfermoney',
                accept: 'application/json',
                contentType: 'application/json',
                method: 'POST'
            };
            var requestData= "{ fromId:" + req.query.fromId +
                               ", toId:" + req.query.toId  +
                               ", payee:" + req.query.payee +
                               ", amount:" + req.query.amount  + " }";
            console.info("requestData:" + requestData);
            var data = "";

            var transferMoneyRequest = http.request(options, function(transferMoneyResponse){
                //console.log("statusCode: ", getCustomerResponse.statusCode);
                transferMoneyResponse.on('data', function (d) {
                    data += d;

                });
                transferMoneyResponse.on("end", function () {
                    //console.debug("\nData: " + data);
                    //var jsonData = JSON.parse(data);
                    res.send(data);
                });
            });

            transferMoneyRequest.write(requestData);
            transferMoneyRequest.end();
            transferMoneyRequest.on('error', function (e) {
                console.error(e);
            });
        });
    });

    var restBasePath = '/fuse/techstock/';
    var hostIP = '52.26.13.96';
    var hostPort = 9001;
    
    cloud.get('/getBackendData', function(req,res){
        activity.record({
            "action": "Client called Cloud App -- get Backend Data"
        }, function (err, docs) {
            if (err) console.error('Warning: ignoring error: ' + util.inspect(err));
            
            var method = req.query.method;
            var restSpecifiedPath = req.query.restpath;
            var id = req.query.id;
            
            var options = {
                host: hostIP,
                port: hostPort,
                path: restBasePath + restSpecifiedPath,
                accept: 'application/json',
                contentType: 'application/json',
                method: method
            };
            var requestData= "{ id:" + id + " }";
            console.info("requestData:" + requestData);
            console.info("options:" + options);
            var data = "";

            var restRequest = http.request(options, function(restResponse){
                //console.log("statusCode: ", restResponse.statusCode);
                restResponse.on('data', function (d) {
                    data += d;

                });
                restResponse.on("end", function () {
                    //console.debug("\nData: " + data);
                    //var jsonData = JSON.parse(data);
                    res.send(data);
                });
            });

            restRequest.write(requestData);
            restRequest.end();
            restRequest.on('error', function (e) {
                console.error(e);
            });
        });
    });


    return cloud;
};

module.exports = cloudRoute;