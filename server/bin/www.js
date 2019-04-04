import '@babel/polyfill';
import http from 'http';
import socketIo from 'socket.io';
import app from '../index';
import { env } from '../helpers/utils';
import logger from '../helpers/logger';

const port = env('PORT', 3000);
const server = http.createServer(app);
server.listen(port, () => logger.log(`Running on port ${port}`));

// add socket connection
const io = socketIo(server);
io.on('connection', (socket) => {
  // make socket global, so that new emitters can be created
  global.socket = socket;
});
