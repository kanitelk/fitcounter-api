const app = require('./app');
const config = require('./config');

const mongoose = require('mongoose');
const db = mongoose.connect(config.db, { useNewUrlParser: true }, (err) => {
  if (err) throw err;
  console.log('Connected to DB!');
});


const server = app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});