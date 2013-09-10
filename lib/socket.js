var _ = require('underscore');
var socket = require('socket.io-mw');
var async = require('async');
var http = require('http');

export.createServer = function(config, cb) {
  var server = http.createServer();
  var io = socket.listen(server);

  io.on('all', function(socket, payload, next) {

  });

  io.on('send', function(socket, payload, next) {

  });

  server.createServer(config.port, cb);
};