var express = require('express');
var session = require('express-session')
var app =  express();
var axios = require('axios');
var findProducts = require('./routes/findProducts');
var user = require('./routes/user');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
	cookieName: 'session',
	secret: 'compe273_test_string',
	resave: false,
	saveUninitialized: false,
	duration: 30*60*1000,
	activeDuration:5*60*1000,
}));

app.get('/findProducts', findProducts.productSearch);
app.post('/users', user.register);
app.get('/users', user.getAll);
app.get('/users/:email', user.getUser);
app.post('/users/login', user.login);
app.delete('/users/:email', user.delete);
app.listen(3000, function(){
  console.log('Express server listening at localhost port 3000')
})
