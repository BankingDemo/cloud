var fh = require('fh-mbaas-api');
var activity = require('./activity');
var util = require('util');

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var http = require('http')

var default_options = {
    host: '52.18.16.10',
    port: 9000
};

function cloudRoute() {
    var cloud = new express.Router();
    cloud.use(cors());
    cloud.use(bodyParser());

    cloud.get('/login', function(req, res) {
        activity.record({
            "action": "Client called Cloud App -- Login"
        }, function (err, docs) {
            var options = {
                host: default_options.host,
                port: default_options.port,
                path: '/getCustomer?username=' + req.query.username
            };

            var data = "";
            var getCustomerRequest = http.request(options, function (getCustomerResponse) {
                getCustomerResponse.on('data', function (d) {
                    data += d;
                });
                getCustomerResponse.on("end", function () {
                    res.send(data);
                });
            });

            getCustomerRequest.end();
            getCustomerRequest.on('error', function (e) {
                console.error(e);
            });
        });
    });

    cloud.get('/getTransactions', function(req, res){
        activity.record({
            "action": "Client called Cloud App -- Get Transactions"
        }, function (err, docs) {
            if (err) console.error('Warning: ignoring error: ' + util.inspect(err));
            var options = {
                host: default_options.host,
                port: default_options.port,
                path: '/getTransactions?id=' + req.query.id
            };

            var data = "";
            var getTransactionsRequest = http.request(options, function (getTransactionsResponse) {
                getTransactionsResponse.on('data', function (d) {
                    data += d;
                });
                getTransactionsResponse.on("end", function () {
                    res.send(data);
                });
            });

            getTransactionsRequest.end();
            getTransactionsRequest.on('error', function (e) {
                console.error(e);
            });
        });
    });

    cloud.get('/transferMoney', function(req, res){
        activity.record({
            "action": "Client called Cloud App -- Transfer Money"
        }, function (err, docs) {
            if (err) console.error('Warning: ignoring error: ' + util.inspect(err));
            var requestData = '{ "fromid": ' + req.query.fromId +
                              ', "payee": ' + req.query.payee +
                              ', "amount": ' + req.query.amount + ' }';

            var options = {
                host: default_options.host,
                port: default_options.port,
                path: '/transferMoney',
                headers: { 'Content-Type': 'application/json',
			   'Content-Length': requestData.length
			 },
                method: 'POST'
            };

            var data = "";
            var transferMoneyRequest = http.request(options, function(transferMoneyResponse){
                transferMoneyResponse.on('data', function (d) {
                    data += d;

                });
                transferMoneyResponse.on("end", function () {
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

    cloud.get('/getCurrentBalance', function(req, res){
        activity.record({
            "action": "Client called Cloud App -- Get Current Balance"
        }, function (err, docs) {
            if (err) console.error('Warning: ignoring error: ' + util.inspect(err));
            var options = {
                host: default_options.host,
                port: default_options.port,
                path: '/getCurrentBalance?id= ' + req.query.id,
                accept: 'application/json',
                contentType: 'application/json',
                method: 'GET'
            };
            
            var data = "";
            var getCurrentBalanceRequest = http.request(options, function(getCurrentBalanceResponse){
                getCurrentBalanceResponse.on('data', function (d) {
                    data += d;

                });
                getCurrentBalanceResponse.on("end", function () {
                    res.send(data);
                });
            });

            getCurrentBalanceRequest.end();
            getCurrentBalanceRequest.on('error', function (e) {
                console.error(e);
            });
        });
    });

    cloud.get('/updateCustomer', function(req, res){
        activity.record({
            "action": "Client called Cloud App -- Update Customer"
        }, function (err, docs) {
            if (err) console.error('Warning: ignoring error: ' + util.inspect(err));
            var requestData = '{ "id": ' + req.query.id +
                              ', "firstname": ' + req.query.firstname +
                              ', "surname": ' + req.query.surname +
                              ', "address": ' + req.query.address +
                              ', "email": ' + req.query.email + ' }';

            var options = {
                host: default_options.host,
                port: default_options.port,
                path: '/updateCustomer',
                headers: { 'Content-Type': 'application/json',
			   'Content-Length': requestData.length
			 },
                method: 'POST'
            };

            var data = "";
            var updateCustomerRequest = http.request(options, function(updateCustomerResponse){
                updateCustomerResponse.on('data', function (d) {
                    data += d;

                });
                updateCustomerResponse.on("end", function () {
                    res.send(data);
                });
            });

            updateCustomerRequest.write(requestData);

            updateCustomerRequest.end();
            updateCustomerRequest.on('error', function (e) {
                console.error(e);
            });
        });
    });

    return cloud;
};

module.exports = cloudRoute;
