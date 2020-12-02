var mongoose = require('mongoose');
const conexion = "mongodb://localhost:27017/proyectorestapi"
mongoose.connect(conexion ,{useNewUrlParser: true, useUnifiedTopology: true});