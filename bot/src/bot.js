var botkit = require('botkit');
const {API_TOKEN} = require('../config/config')
var controller = botkit.slackbot({ debug : false });
var bot = controller.spawn({token : API_TOKEN});
// connect to slack real time messaging API
bot.startRTM();
// listen and respond to user messages
controller.on('direct_message', function(bot, message){
  console.log(message);
  bot.reply(message, 'roger that, Cap !')
});
