const express = require('express');
const app = express();

const AuthController = require('./controllers/AuthController');
const NotesController = require('./controllers/NotesController');
app.use('/api/auth', AuthController);
app.use('/api/notes', NotesController);

module.exports = app;