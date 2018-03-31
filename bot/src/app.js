var builder = require('botbuilder');
var restify = require('restify');

// setup restify server
var server = restify.createServer();
server.listen(1000, function(){
  console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
  appId : '',
  appPassword : ''
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, [
    // root controller dialog
    (session, args, next) => {
        session.send("Hello, I am shopyst");
        session.send("I can help you find the best products.")
        session.beginDialog('getProduct');
  }]);

  // simple dialog to get product user is looking for
  bot.dialog('getProduct',[
    (session, args, next) => {
      builder.Prompts.text(session, 'what are you looking for today ?');
    },
    (session, results , next) => {
      productName = session.dialogData.productName = results.response;
      if(!productName || productName.trim().length == 0 ){
        session.send("Sorry, I didnt get you")
      }
      else{
        session.send("great, let me look it up for you")
      }
    }
  ]);
