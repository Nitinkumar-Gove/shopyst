var botkit = require('botkit');
const {API_TOKEN} = require('../config/config');
var controller = botkit.slackbot({ debug : false });
var bot = controller.spawn({token : API_TOKEN});
var responses = require('../config/responses');

// connect to slack real time messaging API
bot.startRTM();

// listen to specific phrases
controller.hears(['hi','hello','hey'],'direct_message', function(bot, message){
  bot.reply(message, responses.HOW_ARE_YOU);
});

controller.hears(['how are you'],'direct_message', function(bot,message){
  bot.reply(message, responses.DOING_AMAZING);
});

controller.hears(['doing','good','great'],'direct_message', function(bot, message){
  bot.reply(message, responses.GLAD_TO_HEAR)
});
