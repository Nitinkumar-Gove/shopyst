  const builder = require('botbuilder');
  const restify = require('restify');
  const config = require('../config/config.js')
  const findProducts = require('./controllers/productSearch.js')

  const logTag = "[ SHOPYST ] ";
  let productQuery = {};
  
  // setup restify server
  const server = restify.createServer()
  server.listen(1000, function(){
    console.log(logTag,'Chat Server Live : ',server.url);
  });

  // Create chat connector for communicating with the Bot Framework Service
  const connector = new builder.ChatConnector({
    appId : '',
    appPassword : ''
  });
  // Listen for messages from users
  server.post('/api/messages', connector.listen());

  let inMemoryStorage = new builder.MemoryBotStorage();
  let bot = new builder.UniversalBot(connector).set('storage', inMemoryStorage);

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
          //save product type to store
          session.userData.productType = productTypeEntity.entity;
          // input product brands
          builder.Prompts.text(session, 'are there any specific brands which I should give preference?');
      } 
      else{
          // handle failure to detect product type here
      }
    },
    function(session, results){
      // save brand list to store
      session.userData.productBrands = results.response;
      // input product condition
      builder.Prompts.choice(session, 'please choose product condition', 'New | Used | Refurbished', {listStyle : 3});
    },
    function(session, results){
      // save prouct condition
      session.userData.productCondition = results.response.entity;
      // input product rating
      builder.Prompts.number(session, 'enter minimum acceptable product rating');
    },
    function(session, results){
      // save minimum product rating
      session.userData.minProductRating = results.response;
      // input max product price
      builder.Prompts.number(session, 'enter maximum price acceptable');
    },
    function(session, results){
      // save minimum product rating
      session.userData.maxProductPrice = results.response;
      
      // build search query 
      console.log(JSON.stringify(session.userData));

       // attach the card to the reply message
       let products = findProducts({});
       let productCards = products.map(product => {
            return createHeroCard(session, product);
       });

       let msg = new builder.Message(session);
       msg.attachmentLayout(builder.AttachmentLayout.carousel)
       msg.attachments(productCards);
       session.send(msg);
       
      // end 
      session.endDialog();
    }
]);

/*
* function to create the card view for the carousel 
*/
function createHeroCard(session, product) {
    return new builder.HeroCard(session)
    .title(product.productName)
    .subtitle(product.productDescription)
    .text(product.productDescription2)
    .images([builder.CardImage.create(session,product.productImage )])
    .buttons([
        builder.CardAction.imBack(session, "buy " + product.productName, "Buy")
    ]);
}