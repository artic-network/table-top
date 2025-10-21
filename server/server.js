// server.js
// Express + Socket.IO server storing a small JS object { text: string, day: integer }.
// Permissive CORS (origin echoed) so clients hosted anywhere can connect.
// Edit SETTINGS below if you want to restrict origins or serve ./public pages.

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// ======= In-code settings (edit these values directly) =======
const SETTINGS = {
  PORT: 3000,           // port the server will listen on
  SERVE_STATIC: false   // set true if you want this server to host ./public pages
};
// =============================================================

app.use(express.json());

// Permissive CORS for development: echo incoming Origin and allow credentials.
app.use(cors({ origin: true, credentials: true }));

// if (SETTINGS.SERVE_STATIC) {
//   app.use(express.static('public'));
// }

// In-memory storage for the object with a string and an integer
let storedObject = { text: '', day: 0 };

// HTTP read endpoint (polling fallback)
app.get('/value', (req, res) => {
  res.json({ value: storedObject });
});

// HTTP write endpoint (accepts full object or partial fields)
app.post('/value', (req, res) => {
  const { text, day } = req.body;
  // Validate and apply partial updates
  if (text !== undefined) {
    if (typeof text !== 'string') {
      return res.status(400).json({ error: 'text must be a string' });
    }
    storedObject.text = text;
  }
  if (day !== undefined) {
    // allow numbers provided as strings too
    const parsed = Number(day);
    if (!Number.isInteger(parsed)) {
      return res.status(400).json({ error: 'day must be an integer' });
    }
    storedObject.day = parsed;
  }

  // Broadcast via socket.io
  io.emit('valueUpdated', storedObject);
  res.json({ ok: true, value: storedObject });
});

// Configure socket.io with permissive CORS so polling/XHR and websocket handshakes succeed
const io = new Server(server, {
  cors: {
    origin: true, // echo incoming Origin (allow any origin)
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  // Send current object immediately on connect
  socket.emit('valueUpdated', storedObject);

  // Listen for setValue events from setter page (object)
  socket.on('setValue', (newObj) => {
    if (typeof newObj !== 'object' || newObj === null) return;

    // Apply partial updates with validation
    if (newObj.text !== undefined) {
      if (typeof newObj.text === 'string') storedObject.text = newObj.text;
    }
    if (newObj.day !== undefined) {
      const parsed = Number(newObj.day);
      if (Number.isInteger(parsed)) storedObject.day = parsed;
    }

    console.log('Updated storedObject:', storedObject);
    
    // Broadcast to all connected clients
    io.emit('valueUpdated', storedObject);
  });
});

const PORT = SETTINGS.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
  console.log('CORS: permissive (origin echoed), credentials allowed');
});