var axios = require('axios');
var config = require('../config/config');
var mongo=require('./mongoDB');
var url = 'mongodb://cmpe295:shopyst@ds253879.mlab.com:53879/shopyst' ;

exports.productSearch= function(msg,callback){
  var res={};
  userSearchHistory(msg.user, msg.keywords)
  var url = 'http://svcs.ebay.com/services/search/FindingService/v1?'+
  'RESPONSE-DATA-FORMAT=JSON&SERVICE-VERSION=1.0.0&GLOBAL-ID=EBAY-US'+
  '&keywords='+msg.keywords+'&paginationInput.entriesPerPage='+msg.entriesPerPage;
  axios.get(url, {
    headers: {
      'X-EBAY-SOA-SECURITY-APPNAME': config.vendorsecret,
      'X-EBAY-SOA-OPERATION-NAME': 'findItemsByKeywords'
    }
  })
  .then(function (response) {
    res.data=response.data;
    res.status=response.status;
    callback(null, res);
  })
  .catch(function (error) {
    callback(null, error);
  });
}

function userSearchHistory (user, keywords) {
  mongo.connect(url,function(){
    var collection=mongo.collection('users');
      collection.findOne({email:user}, function (err, result) {
            var res={};
            if (err) {
              console.log(err);
            } else if (result) {
              var search_history=result.search_history;
              search_history.push(keywords);
              collection.update({email:user}, {$set: {search_history:search_history}});
            }
            return;
          });
    });
}
