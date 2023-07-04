'use strict';

var redis = require('redis');

module.exports = function(req, res) {
    var user; 

    var client = redis.createClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    });

    var response = {
        status: "OK",
        statusCode: 200,
    };

    if (req.session) {
        if (req.session.user){
        user = req.session.user;  
        client.get(user, function(err, token) {
            client.del(token);
            client.del(user);
        });}
        req.session.destroy();
    }
    res.status(response.statusCode);
    res.json(response);
};