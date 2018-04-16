var express = require('express');
var app =  express();
var axios = require('axios');
var findProducts = require('./routes/findProducts');

app.get('/findProducts', findProducts.productSearch);

app.listen(3000, function(){
  console.log('Express server listening at localhost port 3000')
})
