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

  var bot = new builder.UniversalBot(connector, [
    // root controller dialog
    (session, args, next) => {
        session.send("Hello, I am shopyst");
        session.send("I can help you find the best products.")
        session.beginDialog('getProduct');
  },
  (session, results, next) => {
    /* design note :
    *  once we recieve the input from the user , we should store it in a
    *  'requirement-kind-of' json object which can be used during product search
    */
    if(results.productName){
      let pname = session.privateConversationData.productName = results.productName;
      session.endConversation(`searching for ${pname} ...`);
    }
    else{
      // no valid response received - End the conversation
      session.endConversation(`Sorry, I didn't understand the response. Let's start over.`);
    }
  }]);

  // simple dialog to get product user is looking for
  bot.dialog('getProduct',[
    (session, args, next) => {
      // retreive args , if any
      if(args){
        session.dialogData.isReprompt = args.isReprompt;
      }
      builder.Prompts.text(session, 'what are you looking for today ?');
    },
    (session, results , next) => {
      productName = session.dialogData.productName = results.response;
      /* design note :
      *  we should have a list of products that we support searching for
      *  this list should be used for validating user input in this dialog
      *  eventually we should have a question set for each product category to
      *  collect relevant information.
      */
      if(!productName || productName.trim().length < 3 ){
          if(session.dialogData.isReprompt){
            // already prompted once , close now
             session.endDialogWithResult({ productName: '' });
          }
          else{
          session.send("Sorry, product name should be atleast of 3 characters.")
          // starting over again
          session.replaceDialog('getProduct', {isReprompt : true});
          }
      }
      else{
        session.send("great, let me look it up for you")
        session.endDialogWithResult({productName});
      }
    }
  ]);
