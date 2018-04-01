  var builder = require('botbuilder');
  var restify = require('restify');

  var logTag = "[ SHOPYST ] ";
  var productQuery = {};
  // setup restify server
  var server = restify.createServer()
  server.listen(1000, function(){
    console.log(logTag,'listening to ',server.url);
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
        session.send("Hello, I am shopyst. ");
        session.send("I can help you find the best products.")
        session.beginDialog('getProduct');
  },
  // extract productName
  (session, results, next) => {
    /* design note :
    *  once we recieve the input from the user , we should store it in a
    *  'requirement-kind-of' json object which can be used during product search
    */
    console.log(logTag, "product name : ", results);
    if(results.productName){
      let productName = session.privateConversationData.productName = results.productName;
      console.log(logTag, `searching for ${productName} ...`);
      session.beginDialog('getMinimumRating', {productName});
    }
    else{
      // no valid response received - End the conversation
      session.endConversation(`I didnt get you, lets start over`);
    }
  },
  // extract minRating for product
  (session, results, next) => {
    console.log(logTag, "minimum rating : ", results);
    if(results.minRating){
      let minRating = session.privateConversationData.minRating = results.minRating;
      session.beginDialog('getCondition');
    }
    else{
      /* design note:
      *  since all inputs except the product name are optional, even if the user
      *  does not provide a valid input for the question, we should not end the
      *  conversation
      */
      session.endConversation(`ending conversation ... in minimum rating dialog`);
    }
  },
  (session, results, next) => {
    console.log(logTag, "condition : ", results);
    if(results.condition){
      let condition = session.privateConversationData.condition = results.condition;
      console.log(logTag, session.privateConversationData);
      // this query will be used to fetch product list
      productQuery = session.privateConversationData;
      session.send("fetching products, hang on there !");
      // session.beginDialog('getCondition');
    }
    else{
      /* design note:
      *  since all inputs except the product name are optional, even if the user
      *  does not provide a valid input for the question, we should not end the
      *  conversation
      */
      session.endConversation(`ending conversation ... in condition dialog`);
    }
  }]);

  // get product name, category, type
  bot.dialog('getProduct',[
    (session, args, next) => {
      // retreive args , if any
      if(args){
        session.dialogData.isReprompt = args.isReprompt;
      }
      builder.Prompts.text(session, 'What are you looking for today?');
    },
    (session, results , next) => {
      let productName = session.dialogData.productName = results.response;
        console.log(logTag, "productName - " , productName )
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
          session.send("product name should be atleat 3 characters long")
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
        builder.Prompts.number(session, 'please enter min user rating ( between 1-5 )');
    },
    (session, results, next) =>{
      // extract user rating for validation
      let minRating = results.response;
      console.log(logTag, "minRating - " , minRating )
      if(!minRating || minRating < 0 || minRating > 5){
        if(session.dialogData.isReprompt){
           session.endDialogWithResult({ minRating: ''});
        }
        else{
          session.send("rating should be between 1-5")
          session.replaceDialog('getMinimumRating', {isReprompt : true});
        }
      }
      else{
        session.endDialogWithResult({minRating});
      }
    }
  ]);

  // get condition for the product
  bot.dialog('getCondition', [
    (session, args, next) => {
      builder.Prompts.choice(session, "please select product condition", "New|Refurbished|Used", { listStyle: builder.ListStyle.button });
    },
    (session, results, next) => {
      let condition = results.response.entity;
      session.endDialogWithResult({condition});
    }
  ]);


  // yes/no dialog
  bot.dialog('getYesOrNo',[
    (session, args, next) => {
      if(args){
        let question = args.question;
      }
      builder.Prompts.choice(session, question, "Yes|No", { listStyle: builder.ListStyle.button });
    },
    (session, results, next) => {
      let answer = results.response.entity;
      session.endDialogWithResult({answer});

    }
  ]);
