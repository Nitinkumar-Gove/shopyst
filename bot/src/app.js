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
  bot.set('persistConversationData', true);

  // attach LUIS recognizer here 
  let luisAppUrl = config.LUIS_MODEL_URL;
  let shopystRecognizer = bot.recognizer(new builder.LuisRecognizer(luisAppUrl));
  let shopystIntentsDialog = new builder.IntentDialog({
    recognizers: [shopystRecognizer]
  });

  // attach none or default intent
  bot.dialog('/', shopystIntentsDialog);
  bot.dialog('/SearchProduct', shopystIntentsDialog);
  bot.dialog('/AddToCart', shopystIntentsDialog);
  bot.dialog('/PlaceOrder', shopystIntentsDialog);
  bot.dialog('/AddToWishlist', shopystIntentsDialog);
  bot.dialog('/ShowWishlist', shopystIntentsDialog);
  bot.dialog('/ClearWishlist', shopystIntentsDialog);
  bot.dialog('/ExpressEmotion', shopystIntentsDialog);

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

      // initialize Feature Flags - to control features use during covnersation
      if(!session.conversationData["featureFlagEnabled"]){
         session.send("enabling feature flags")
         enableFeatureFlag(session);
      }
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

  // Handle Add to cart intent
  shopystIntentsDialog.matches('AddToCart',[
    function(session,args){
        // check if user has selected a product
        if(!session.conversationData["isProductSelected"]){
            session.send("please select a product first");
            return;  
        }
        session.send("adding to your cart ...");
    }
  ]);

  // Handle Place the order intent.
  shopystIntentsDialog.matches('PlaceOrder',[
    function(session,args){
        // check if user has added a product to cart
        if(!session.conversationData["addToCart"]){
            session.send("please add atleast one product to cart first");
            return;  
        }
        session.send("placing your order ...");
    }
  ]);

  // Handle Add to Wishlist intent
  shopystIntentsDialog.matches('AddToWishlist',[
    function(session,args){
         // check if user has selected a product
         if(!session.conversationData["isProductSelected"]){
            session.send("please select a product first");
            return;  
        }
        session.send("adding product to wishlist ...");
    }
  ]);

  // Handle Show Wishlist intent
  shopystIntentsDialog.matches('ShowWishlist',[
    function(session,args){
        // check if wishlist has item
        if(!session.conversationData["addToWishlist"]){
            session.send("your wishlist looks empty");
            return;  
        }
        session.send("showing wishlist ...");
    }
  ]);

  // Handle Clear Wishlist intent
  shopystIntentsDialog.matches('ClearWishlist',[
    function(session,args){
        // check if wishlist has item
        if(!session.conversationData["addToWishlist"]){
            session.send("your wishlist looks empty");
            return;  
        }
        session.send("clearning wishlist ...");
    }
  ]);

  // Handle ExpressEmotion intent
  shopystIntentsDialog.matches('ExpressEmotion',[
    function(session,args){
        session.send("Ignoring remark ...");
    }
  ]);

// function to create the card view for the carousel 
function createHeroCard(session, product) {
    return new builder.HeroCard(session)
    .title(product.productName)
    .subtitle(product.productDescription)
    .text(product.productDescription2)
    .images([builder.CardImage.create(session,product.productImage )])
    .buttons([
        builder.CardAction.imBack(session,"@AddToCart " + product.productName, "Add To Cart")
    ]);
}

// function to enable feature flags for the conversation
function enableFeatureFlag(session){
    // initialize all the flags to false
    session.conversationData["isProductSelected"] = false;
    session.conversationData["addToCart"] = false;
    session.conversationData["placeOrder"] = false;
    session.conversationData["addToWishlist"] = false;
    session.conversationData["showWishlist"] = false;
    session.conversationData["clearWishlist"] = false;
    // feature flags initialized 
    session.conversationData["featureFlagEnabled"] = true;
}