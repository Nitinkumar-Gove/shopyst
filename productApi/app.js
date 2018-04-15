var express = require('express');
var app =  express();
var axios = require('axios');
var config = require('./config');

app.get('/findProducts', function(req,res){
  console.log("Reporting from find products api");
  var url = 'http://svcs.ebay.com/services/search/FindingService/v1?'+
  'RESPONSE-DATA-FORMAT=JSON&SERVICE-VERSION=1.0.0&GLOBAL-ID=EBAY-US'+
  '&keywords='+req.query.keywords+'&paginationInput.entriesPerPage='+req.query.entriesPerPage;
  axios.get(url, {
    headers: {
      'X-EBAY-SOA-SECURITY-APPNAME': config.vendorsecret,
      'X-EBAY-SOA-OPERATION-NAME': 'findItemsByKeywords'
    }
  })
  .then(function (response) {
    res.send(response.data);
  })
  .catch(function (error) {
    res.send(error);
  });
})

app.listen(3000, function(){
  console.log('Express server listening at localhost port 3000')
})
