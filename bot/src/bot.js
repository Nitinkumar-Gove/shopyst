var botkit = require('botkit');
const {API_TOKEN} = require('../config/config');
var controller = botkit.slackbot({ debug : false });
var bot = controller.spawn({token : API_TOKEN});
var response = require('../config/responses');
var message = require('../config/messages')

// connect to slack real time messaging API
bot.startRTM();

// listen to specific phrases
controller.hears([message.HI,message.HELLO,message.HEY],'direct_message', function(bot, message){
  bot.reply(message, response.HOW_ARE_YOU);
});

controller.hears([message.HOW_ARE_yOU],'direct_message', function(bot,message){
  bot.reply(message, response.DOING_AMAZING);
});

controller.hears([message.DOING,message.GOOD,message.GREAT],'direct_message', function(bot, message){
  bot.reply(message, response.GLAD_TO_HEAR)
});

controller.hears([message.HELP],'direct_message', function(bot, message){
  bot.reply(message, response.HOW_CAN_I_HELP)
});

controller.hears([message.BUY],'direct_message', function(bot, message){
  bot.reply(message, response.LOOK_UP)
});

controller.hears([message.BYE],'direct_message', function(bot, message){
  bot.reply(message, response.BYE)
});

controller.hears(['options','skills','functions','what can you do'],'direct_message', function(bot, message){
  bot.reply(message, response.MENU)
});
