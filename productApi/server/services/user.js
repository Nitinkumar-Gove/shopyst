var mongo=require('./mongoDB');
var url = 'mongodb://cmpe295:shopyst@ds253879.mlab.com:53879/shopyst' ;

exports.register = function (msg, callback) {
  console.log('Reporting from register function', msg.name)
  mongo.connect(url,function(){
		var collection=mongo.collection('users');
		var user = {
      name:msg.name,
      address: msg.address,
      email: msg.email,
      phone:msg.phone,
      password:msg.password,
      search_history:[]
    };
    console.log(validateFields(user.email));

    collection.findOne({email:user.email}, function (err, result) {
          var res={};
          if (err) {
            console.log(err);
          } else if (result) {
            // email already taken
              console.log('email already taken')
              res.status = 409;
              res.data = {'msg':'User with this email id already exists'};
              callback(null,res);
            }
            else{
              collection.insert(user,function(err,result){
                var res={};
          			if(err){
          				console.log(err);
                  res.status=500;
                  res.data = err;
          			}
          			else{
          				console.log("data inserted into the db");
          				res.status=200;
          				res.data = {'msg':'User created successfully'};
          			}
                callback(null, res);
          		});
            }
        //  console.log('checking res',res)
        });
	});
}

function validateFields (email) {
  console.log('validate fileds');
  var email_pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email_pattern.test(String(email).toLowerCase());
}

exports.getAll= function (msg, callback){
  console.log('get all users');
  var users;
  mongo.connect(url,function(){
		var collection=mongo.collection('users');
			collection.find().toArray(function (err, result) {
            var res={};
			      if (err) {
			        console.log(err);
              res.code=500;
              res.data=err;
			      } else if (result.length>0) {
			        res.code=200;
			        users=result;
			        res.data=users;
			      }
			      else {
			        console.log('Nothing found');
              res.code=404;
              res.data={'msg':'Nothing found'};
			      }
            callback(null, res);
			    });
		});
}
exports.getUser = function (msg, callback) {
  console.log('get user with email', msg.email);
  var user;
  mongo.connect(url,function(){
		var collection=mongo.collection('users');
			collection.findOne({email:msg.email}, function (err, result) {
            var res={};
			      if (err) {
			        console.log(err);
              res.code=500;
              res.data=err;
			      } else if (result) {
			        res.code=200;
			        user=result;
			        res.data=user;
			      }
			      else {
			        console.log('Nothing found');
              res.code=404;
              res.data={'msg':'Nothing found'};
			      }
            callback(null, res);
			    });
		});
}

exports.login= function (msg, callback){
  console.log('login user');

  mongo.connect(url,function(){
		var collection=mongo.collection('users');
			collection.findOne({email:msg.email}, function (err, result) {
            var res={};
			      if (err) {
			        console.log(err);
              res.code=500;
              res.data=err;
			      } else if (result) {
              console.log(result.password)
              if(msg.password!=result.password){
                res.code=401;
                res.data={'msg':'invalid password'}
              }
              else {
                res.code=200;
                res.data={'msg':'login successfull'}
              }
			      }
			      else {
			        console.log('Nothing found');
              res.code=404;
              res.data={'msg':'Nothing found'};
			      }
            callback(null, res);
			    });
		});
}

exports.delete = function (msg, callback){
  console.log('Reporting from delete user', msg.email);
  mongo.connect(url,function(){
		var collection=mongo.collection('users');
			collection.deleteOne({email:msg.email}, function(err, result){
        var res={};
        if(err){
          console.log(err);
          res.code=500;
          res.data=err;
        }
        else{
          console.log('deleted');
          res.code=200;
          res.data={'msg':'user deleted successfully'};
        }
        callback(null,res);
      })
		});
}
