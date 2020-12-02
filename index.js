var express = require('express');
var app = express();
var db = require('./db');

var booksController = require('./controlador-libros');

app.use('/api', booksController);

var port = "8000";

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});