'use strict';

var apiError = require('../../helpers/error').session;
var jwt = require('jsonwebtoken');
var redis = require('redis');

module.exports = function(req, res, next) {
    var response = {};
    var token = req.headers.authorization; 
    var client = redis.createClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    });
    if (!token) {  
        response = {
            data: {message: apiError.S0001.message, code: apiError.S0001.code},
            status: "ERROR",
            statusCode: 403
        };
        res.status(response.statusCode);
        res.json(response);
        return false;
    }
    
    client.get(token, function(err, reply) {
        if (err){
            response = {
                data: {message: apiError.S0001.message, code: apiError.S0001.code},
                status: "ERROR",
                statusCode: 403
        };
        res.status(response.statusCode);
        res.json(response);
        return false;
    }
    
    if (reply !== 'Ok'){
        response = {
            data: {message: apiError.S0001.message, code: apiError.S0001.code},
            status: "ERROR",
            statusCode: 403
        };
        res.status(response.statusCode);
        res.json(response);
        return false;
    }

    if (token) { 
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
                response = {
                    data: {message: apiError.S0001.message, code: apiError.S0001.code},
                    status: "ERROR",
                    statusCode: 403
                };
                res.status(response.statusCode);
                res.json(response);
                return false;
            }
            if (req.session.token !== token) {
                response = {
                    data: {message: apiError.S0001.message, code: apiError.S0001.code},
                    status: "ERROR",
                    statusCode: 403
                };
                res.status(response.statusCode);
                res.json(response);
                return false; 
            }
            /*
            req.session.usuario = decoded.user;
            req.session.user = decoded.user;
            req.session.email = decoded.email;
            */
           next();
        });
    }});
};