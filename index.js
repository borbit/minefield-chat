var _ = require('underscore');
var async = require('async');
var io = require('io');

exports.createServer = function(config, cb) {
  var messages = {};

  io.on('room', function(socket, payload, next) {
    var room = payload.req || 'eng';
    var res = payload.res;
    
    if (!messages[room]) {
      messages[room] = [];
    }

    res.messages = messages[room];
    socket.leaveAll();
    socket.join(room);
    next();
  });

  io.on('send', function(socket, payload, next) {
    var req = payload.req;
    var res = payload.res;

    if (!req.message || !req.room) {
      return next(new Error('Invalid message'));
    }

    var message = {
      user: req.user.substr(0, 30)
    , message: req.message.substr(0, 500)
    , time: Date.now()
    , hash: req.hash
    , pid: req.pid
    };

    messages[req.room].push(message);

    if (messages.length > 200) {
      messages.shift();
    }

    res.message = message;
    next();

    socket.broadcast(req.room, 'message', res);
  });

  io.listen(config.port, cb);
};