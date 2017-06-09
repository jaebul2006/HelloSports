var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log("connect to mongod server");
});

mongoose.connect('mongodb://localhost/test');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var server = app.listen(process.env.PORT, function(){
   console.log("server is running"); 
});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret:'@#@$MYSIGN#@$#$',
    resave:false,
    saveUninitialized:true
}));

var Book = require('./models/book');
var router = require('./router/main')(app, Book);