var express = require("express");
var bodyParser = require("body-parser");
var config = require("./config");
var url = require("url");
var mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

mongoose.connect(config.database, err => {
    if (err)
        console.log(err);
    else console.log("connected to the database");
});

app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    var oneof = false;
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
});
app.use(function (req, res, next) {
    console.log(req.method + " " + req.originalUrl + " " + res.statusCode);
    next();
});
// var user_api = require("./app/routes/users-api")(app, express);
// app.use("/users", user_api);

app.listen(config.port, err => {
    if (err) console.log(err);
    console.log("listening of port " + config.port);
});