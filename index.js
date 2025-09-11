import 'dotenv/config'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import http from "node:http";
import express from 'express';
import { Server } from "socket.io";
import "./BodyParser.js";
import { basicAuth } from "./BasicAuth.js";
import { addRequestViewer } from "./BodyParser.js";

// addRequestViewer
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(basicAuth)

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const sendToPage = (msg) => {
  io.emit('chat message', msg);
}
addRequestViewer(sendToPage)

server.listen(3000, () => {
  console.log('listening on *:3000');
});
