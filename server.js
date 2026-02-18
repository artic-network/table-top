// Run: npm install express socket.io
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// serve static files from public folder
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('client connected', socket.id);
  socket.on('controller-message', (data) => {
    // Broadcast to all viewers (including other tabs)
    io.emit('new-message', {
      text: data.text,
      ts: Date.now()
    });
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`listening ${port}`));