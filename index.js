var socket = require('socket.io-mw');
var _ = require('underscore');
var async = require('async');
var http = require('http');

exports.createServer = function(config, cb) {
  var server = http.createServer();
  var io = socket.listen(server);
  var messages = [];

  io.configure(function() {
    io.set('transports', ['websocket']);
    io.set('log level', 2);
  });

  io.configure('production', function () {
    io.set('log level', 1);
  });

  io.on('all', function(socket, payload, next) {
    payload.res.messages = messages;
    next();
  });

  io.on('send', function(socket, payload, next) {
    var req = payload.req;
    var res = payload.res;

    if (!req.message) {
      return next(new Error('Invalid message'));
    }

    var message = {
      user: req.user.substr(0, 30)
    , message: req.message.substr(0, 200)
    , time: Date.now()
    };

    messages.push(message);
    res.message = message;
    next();

    socket.broadcast.emit('message', res);
  });

  server.listen(config.port, '0.0.0.0', cb);
};