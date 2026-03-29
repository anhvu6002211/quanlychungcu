const express = require('express');
const cors = require('cors');
require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io connection logic
io.on('connection', (socket) => {
    console.log('🔌 Một khách hàng đã kết nối:', socket.id);
    socket.on('disconnect', () => console.log('🔌 Khách hàng đã ngắt kết nối'));
});

// Gắn io vào req để các controller có thể sử dụng (ví dụ req.io.emit)
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
const routes = require('./routes');
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Có lỗi xảy ra trên server!';

    console.error(`[Error] ${req.method} ${req.url}:`, err.stack);

    res.status(statusCode).json({
        success: false,
        message: message,
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server real-time đang chạy tại http://localhost:${PORT}`);
});

