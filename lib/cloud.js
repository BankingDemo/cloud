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

            var optionsget = {
                host: '52.26.13.96',
                port: 9001,
                path: '/fuse/techstock/getcustomer?username=' + req.query.username,
                method: 'GET'
            };
            //console.log(optionsget.path);
            // do the GET request
            var data = "";

            var getCustomerRequest = http.request(optionsget, function (getCustomerResponse) {
                //console.log("statusCode: ", getCustomerResponse.statusCode);
                getCustomerResponse.on('data', function (d) {
                    data += d;
                    //console.debug('\nCall completed');

                });
                getCustomerResponse.on("end", function () {
                    //console.debug("\nData: " + data);
                    var jsonData = JSON.parse(data);
                    res.send(jsonData);
                });
            });

            getCustomerRequest.end();
            getCustomerRequest.on('error', function (e) {
                console.error(e);
            });
        });
    });

    return cloud;
};

module.exports = cloudRoute;