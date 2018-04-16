var axios = require('axios');
var mq_client = require('../rpc/client');

exports.productSearch= function(req,res){
  console.log('Reporting from product search route');
  var payload = {
    keywords: req.query.keywords,
    entriesPerPage: req.query.entriesPerPage
  }

  mq_client.make_request('product_search',payload, function(err,results){
    if(err){
      res.send(err);
    }
    else{
      res.send(results.data)
    }
  });
}
