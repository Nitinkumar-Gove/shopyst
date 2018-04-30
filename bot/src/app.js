  const builder = require('botbuilder');
  const restify = require('restify');
  const config = require('../config/config.js')

  const logTag = "[ SHOPYST ] ";
  let productQuery = {};
  
  // setup restify server
  const server = restify.createServer()
  server.listen(1000, function(){
    console.log(logTag,' chat server listening at :  ',server.url);
  });

  // Create chat connector for communicating with the Bot Framework Service
  const connector = new builder.ChatConnector({
    appId : '',
    appPassword : ''
  });
  // Listen for messages from users
  server.post('/api/messages', connector.listen());

  let bot = new builder.UniversalBot(connector);

  // attach LUIS recognizer here 
  let luisAppUrl = config.LUIS_MODEL_URL;
  let shopystRecognizer = bot.recognizer(new builder.LuisRecognizer(luisAppUrl));
  let shopystIntentsDialog = new builder.IntentDialog({
    recognizers: [shopystRecognizer]
  });

  // attach none or default intent
  bot.dialog('/', shopystIntentsDialog);
  bot.dialog('/SearchProduct', shopystIntentsDialog);

  // Handle Greeting intent.
  shopystIntentsDialog.matches('Greeting', [
    function (session, args) {
      let menu = new builder.Message(session)
      .addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            type: "AdaptiveCard",
            body: [
                {
                    "type": "TextBlock",
                    "text": "Search product"
                },
                {
                    "type": "TextBlock",
                    "text": "Add to cart",
                },
                {
                    "type": "TextBlock",
                    "text": "* Order product"
                },
                {
                    "type": "TextBlock",
                    "text": "Add to wishlist"
                },
                {
                    "type": "TextBlock",
                    "text": "Clear wishlist"
                },
                {
                    "type": "TextBlock",
                    "text": "Show my wishlist"
                }
            ]
        }
      });
      session.send("Hello, Here's what I can do for you today")
      session.send(menu);
      session.send('where do you want to start ? ')
  }]);

  // Handle Search Product intent.
  shopystIntentsDialog.matches('SearchProduct', [
    function (session, args) {
      session.send("sure, I can help you with that");
      // extract the product category using Entity recognizer
      let productTypeEntity = builder.EntityRecognizer.findEntity(args.entities, 'ProductType');
      if (productTypeEntity) {
          // productType entity detected, continue to next step
          session.send("looking for ... " + productTypeEntity.entity);

          // input product brands
          builder.Prompts.text(session, 'Are there any specific brands which I should give preference?');
      } 
    },
    function(session, results){
      session.send(results.response);
    }
]);

