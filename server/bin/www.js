#!/usr/bin/env node
/* eslint-disable */

/**
 * Module dependencies.
 */

import app from '../app';
import debugLib from 'debug';
import http from 'http';
import socket from 'socket.io';
const debug = debugLib('pwitter:server');
import splitBill from '../helpers/splitBill';

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3005');

app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
const io = socket(server);

io.on('connection', (socket) => {
  socket.emit('news', { hello: 'hello' });
  socket.on('my other event', (data) => {
    io.emit('order', { order: data });
  });
  socket.on('friends', (data) => {
    io.emit('users', { name: data });
  });
  socket.on('allusers', (data) => {
    io.emit('all', { users: data });
  });

  socket.on('joinRoom', ({ username, room }) => {
    const user = splitBill.userJoin(socket.id, username, room);
    socket.join(user.room);
    console.log(user);

    socket.on('message', ({ data }) => {
      console.log({ data });
    });
    socket.broadcast
      .to(user.room)
      .emit('message', `${user.username} has joined`);
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: splitBill.getRoomUsers(user.room),
    });
  });
  socket.on('chatMessage', (msg) => {
    // const user = getCurrentUser(socket.id);
    console.log(msg);
    io.emit('payment', msg);
  });

  socket.on('disconnect', () => {
    const user = splitBill.userLeave(socket.id);

    if (user) {
      io.to(user.room).emit('message', `${user.username} has left`);

      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: splitBill.getRoomUsers(user.room),
      });
    }
  });
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;

  debug('Listening on ' + bind);
}
