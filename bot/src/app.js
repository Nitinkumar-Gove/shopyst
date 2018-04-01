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
  // extract productName
  (session, results, next) => {
    /* design note :
    *  once we recieve the input from the user , we should store it in a
    *  'requirement-kind-of' json object which can be used during product search
    */
    console.log("[ LOGS ] ", "getProductName : ", results);
    if(results.productName){
      let productName = session.privateConversationData.productName = results.productName;
      console.log(`searching for ${productName} ...`);
      session.beginDialog('getMinimumRating', {productName});
    }
    else{
      // no valid response received - End the conversation
      session.endConversation(`Sorry, I didn't understand the response. Let's start over.`);
    }
  },
  // extract minRating for product
  (session, results, next) => {
    console.log("[ LOGS ] ", "getMinRating : ", results);
    if(results.minRating){
      let minRating = session.privateConversationData.minRating = results.minRating;
      session.endConversation(`take next input`);
    }
    else{
      /* design note:
      *  since all inputs except the product name are optional, even if the user
      *  does not provide a valid input for the question, we should not end the
      *  conversation
      */
      session.endConversation(`processing minRating input... ending conversation ...`);
    }
  }]);

  // get product name, category, type
  bot.dialog('getProduct',[
    (session, args, next) => {
      // retreive args , if any
      if(args){
        session.dialogData.isReprompt = args.isReprompt;
      }
      builder.Prompts.text(session, 'What are you looking for today ?');
    },
    (session, results , next) => {
      // exract product name for validation
      let productName = session.dialogData.productName = results.response;
        console.log("[ LOGS ] ", "productName - " , productName )
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
        session.endDialogWithResult({productName});
      }
    }
  ]);

  // get min rating for product search
  bot.dialog('getMinimumRating',[
    (session, args, next) => {
        if(args){
          session.dialogData.isReprompt = args.isReprompt;
        }
        builder.Prompts.number(session, 'what is the minimum user rating you want for the product?');
    },
    (session, results, next) =>{
      // extract user rating for validation
      let minRating = results.response;
      console.log("[ LOGS ] ", "minRating - " , minRating )
      if(!minRating || minRating < 0 || minRating > 5){
        if(session.dialogData.isReprompt){
           // already prompted once , close now
           session.endDialogWithResult({ minRating: ''});
        }
        else{
          session.send("minRating should be between 1-5")
          // starting over again
          session.replaceDialog('getMinimumRating', {isReprompt : true});
        }
      }
      else{
        session.endDialogWithResult({minRating});
      }
    }
  ]);
