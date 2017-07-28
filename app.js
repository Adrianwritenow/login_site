const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');

const app = express();

//configure mustache
app.engine('mustache', mustacheExpress());
app.set ('views', './views');
app.set('view engine', 'mustache');

//configurebody parser
app.use(bodyParser.urlencoded({extended:false}));

//configure public to be staticlly served
app.use(express.static('public'));

//various Usernames and passwords//
let usersKey = {
  "Alex": 'qazwsx90',
  "Rocky": 'Adrian1978',
  "Donkey": "kong90"
}


app.use(session({
  secret: "2C44-4D44-WppQ38S",
  resave: false,
  saveUninitialized:true

}));

app.get('/', function(req,res){
  if (req.session && req.session.admin){
    res.send(req.session.userName+` is logged in.<form action="/" method="post"><button>log out</button>`);
  }else{
    res.redirect('/login');
  }
});
app.get('/login',function(req,res){
    res.render('login');

});

app.post('/login', function(req,res){
    if (req.body.userPass === usersKey[req.body.userName]) {
     req.session.userName  = req.body.userName
      req.session.admin = true;
      res.redirect('/');
  }else{
    res.send(` Please try again <form action="/" method="post"><button>Try Again</button>`);
  }
});

let auth = function(req,res,next){
  if (req.session && req.session.admin){
    console.log("4");
    return next();
  }else{
    return res.sendStatus(401);
  }
}
app.get('/', auth, function(req,res){
  res.redirect('/login');
  console.log("5");
});
app.post('/', function(req,res){
  req.session.destroy();
  res.render('login');
})
app.listen(3000, function(){
  console.log('server farted');

});
