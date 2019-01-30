const express = require('express');
const app = express();

const AuthController = require('./controllers/AuthController');
const NotesController = require('./controllers/NotesController');
const ProductsController = require('./controllers/ProductsController');

app.use('/api/auth', AuthController);
app.use('/api/notes', NotesController);
app.use('/api/products', ProductsController);

module.exports = app;