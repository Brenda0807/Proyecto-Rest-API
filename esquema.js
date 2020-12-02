var mongoose = require('mongoose');  
var BooksSchema  = new mongoose.Schema({  
    isbn:String,
    titulo: String,
    autor:String,
    year: String,
    pais: String,
    editorial: String
});
mongoose.model('libros', BooksSchema);

module.exports = mongoose.model('libros');