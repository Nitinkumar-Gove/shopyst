var mq_client = require('../rpc/client');

exports.register= function(req,res){
  console.log('Reporting from register user', req.body);
  var payload = {
    name: req.body.name,
    address: req.body.address,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password
  }
  mq_client.make_request('user_register',payload, function(err,results){
    if(err){
      res.send(err);
    }
    else{
      res.send(results)
    }
  });
}

exports.getAll = function (req,res){
  console.log('Reporting from get all users');
  var payload= {};
  mq_client.make_request('all_users',payload, function(err,results){
    if(err){
      res.send(err);
    }
    else{
      res.send(results.data)
    }
  });
}
exports.getUser = function (req,res){
  console.log('Reporting from get user', req.params.email);
  var payload= {
    email: req.params.email
  };
  mq_client.make_request('get_user',payload, function(err,results){
    if(err){
      res.send(err);
    }
    else{
      res.send(results.data)
    }
  });
}

exports.login = function (req,res){
  console.log('Reporting from login', req.body.email);
  var payload= {
    email: req.body.email,
    password: req.body.password
  };
  mq_client.make_request('login',payload, function(err,results){
    if(err){
      res.send(err);
    }
    else{
      req.session.username=payload.email;
      console.log("checking session",req.session.username)
      res.send(results)
    }
  });
}

exports.delete = function (req,res){
  console.log('Reporting from delete user');
  var payload= {
    email: req.params.email
  };
  mq_client.make_request('delete',payload, function(err,results){
    if(err){
      res.send(err);
    }
    else{
      res.send(results.data)
    }
  });
}
