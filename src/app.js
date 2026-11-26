const express = require('express');
const os = require('os');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

mongoose.set('sanitizeFilter', true); // lớp phòng thủ thứ hai chống NoSQL injection

const notesRouter = require('./routes/notes');
const authRouter = require('./routes/auth');

const app = express();
app.set('trust proxy', 1);            // Codespaces và Vercel đứng sau proxy
app.use(helmet());                    // các header bảo mật HTTP
app.use(express.json({ limit: '100kb' }));

app.use('/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 }), authRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'Xin chào từ đám mây!',
    host: os.hostname(),
    platform: `${os.type()} ${os.release()}`,
    cpus: os.cpus().length,
    memoryGB: Number((os.totalmem() / 1024 ** 3).toFixed(1)),
    uptimeSec: Math.round(os.uptime()),
    time: new Date().toISOString()
  });
});

app.use('/notes', notesRouter);

app.use((err, req, res, next) => {
  console.error(err);
  const clientError = ['ValidationError', 'CastError'].includes(err.name)
    || err.code === 'LIMIT_FILE_SIZE';
  res.status(clientError ? 400 : 500).json({ error: err.message });
});

module.exports = app;