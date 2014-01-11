var _ = require('underscore');
var async = require('async');
var io = require('io');

exports.createServer = function(config, cb) {
  var messages = [];

  io.on('all', function(socket, payload, next) {
    payload.res.messages = messages;
    socket.join('*');
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
    , message: req.message.substr(0, 500)
    , time: Date.now()
    , hash: req.hash
    , pid: req.pid
    };

    messages.push(message);

    if (messages.length > 200) {
      messages.shift();
    }

    res.message = message;
    next();

    socket.broadcast('*', 'message', res);
  });

  io.listen(config.port, cb);
};