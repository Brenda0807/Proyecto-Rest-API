
var express = require('express');
var	app = express();

const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = 'mongodb://localhost:27017/Proyecto3';

const nunjucks=require('nunjucks')
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

session = require('express-session');
app.use(session({
    secret: 'string-supersecreto',
    name: 'sessionId',
    proxy: true,
    resave: true,
    saveUninitialized: true ,
    cookie: { maxAge:  60*60 * 1000 }  
}));
 
var auth = function(req, res, next) {
  if (req.session)
    return next();
  else
	return res.status(401).send("No has sido autorizado, amigo. O tu sesion expiró.");
};

app.get('/', (req, res)=>{	  
    res.sendFile(__dirname + "/login.html");
});

app.post('/login', function (req, res) {
    MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {  
        const dbo = db.db("Proyecto3");  
        dbo.collection("Login").findOne({"user":req.body.Usuario},function(err, data) {
        if(req.body.Usuario && req.body.Password){	
            if(data != null){
                if(req.body.Usuario === data.user && req.body.Password === data.password){
                        req.session.user = data.user;
                        req.session.password = data.password;    
                        res.status(200).render('login-rta.html',{usuario:data.user, status:200})    
                }
                else{
                    res.status(401).render('login-rta.html',{usuario:"No autorizado", status:401})
                }
            }
            else{res.status(404).render('login-rta.html',{usuario:"No encontrado", status:404})
            }
        }
        else{res.status(404).render('login-rta.html',{usuario:"Login Failed", status:404})
        }
        })
    })
       
})
 
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.send(`<h1 style="text-align:center;border-radius:50px; background-color:blue; margin-top:50px;margin-left:35%;width:30%;color:white">Sesión cerrada!</h1>`);
});

app.get('/agregar',auth, function (req, res) {
    res.sendFile(__dirname + "/agregar.html");
})

app.all('/verificarlibro',auth,(req, res)=> {
    MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {  
        const dbo = db.db("Proyecto3");  
        // Expresión para la búsqueda mayúsculas y minúsculas
        const b = new RegExp(req.query.librobuscado,"i");
        dbo.collection("Libros").find({"Titulo":{$regex:b}}).toArray(function(err, data) {        
        res.render('verificarlibro.html',{data:data,resultado:req.query.librobuscado}) 
        })
    })
}) 

app.post('/altalibros', auth,function(req,res){
    MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {  
        const dbo = db.db("Proyecto3");  
        dbo.collection("Libros").insertOne(
            {
                ISBN:req.body.isbn,
                Titulo: req.body.titulo,
                Autor: req.body.autor,
                Year: req.body.year,
                Pais: req.body.pais,
                Editorial: req.body.editorial
            },
            function (err, res) {
                if (err) {
                db.close();
                return console.log(err);
                }
                db.close()
            }
        )
        res.render('libro-agregado.html',{libro:req.body.titulo})
        
    })
})  


 app.listen(8000)