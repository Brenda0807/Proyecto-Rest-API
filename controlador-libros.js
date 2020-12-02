var express = require('express');
var app = express.Router();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var Esquema = require('./esquema');

app.get('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    Esquema.find({}, (err, libros) =>{
        
        if (err) return res.status(500).send({"error":"Problemas buscando todos los libros"});
        res.status(200).send(libros);
    });
});


app.get('/autor/:autor', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
	Esquema.find({ autor: req.params.autor}, (err, libros) =>{
        if (err) return res.status(500).send({"error":"Problemas buscando todos los libros"});
        if (!libros) return res.status(404).send({"error":"404"});
        res.status(200).send(libros);
    });
});

app.get('/editorial/:editorial', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
	Esquema.find({ editorial: req.params.editorial}, (err, libros) =>{
        if (err) return res.status(500).send({"error":"Problemas buscando todos los libros"});
        if (!libros) return res.status(404).send("Editorial no encontrada: " + req.params.editorial);
        res.status(200).send(libros);
    });
});

module.exports = app;