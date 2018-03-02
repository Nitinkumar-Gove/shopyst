var botkit = require('botkit');
const {API_TOKEN} = require('../config/config')
var controller = botkit.slackbot({ debug : false });
var bot = controller.spawn({token : API_TOKEN});

// connect to slack real time messaging API
bot.startRTM();

// simple listen and respond to user messages
controller.on('direct_message', function(bot, message){
  console.log(message);
  bot.reply(message, 'Roger that, Cap !')
});

// listen to specific phrases
controller.hears(['hi','hello'],'direct_message', function(bot, message){
  bot.reply(message, 'Hi, How are you ?');
});

controller.hears(['how are you'],'direct_message', function(bot,message){
  bot.reply(message, 'I am doing amazing. How about you?');
});

controller.hears(['doing','good','great'],'direct_message', function(bot, message){
  bot.reply(message, 'Well, I am glad to hear that. ')
});
