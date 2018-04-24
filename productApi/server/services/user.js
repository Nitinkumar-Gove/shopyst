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
      password:msg.password
    };
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
			callback(null,res);
		});
	});
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
