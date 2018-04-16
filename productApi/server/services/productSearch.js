var axios = require('axios');
var config = require('../config/config');

exports.productSearch= function(msg,callback){
  var res={};
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
