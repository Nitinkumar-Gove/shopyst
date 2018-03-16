var botkit = require('botkit');
var response = require('../config/responses');
var messages = require('../config/messages');

const {API_TOKEN} = require('../config/config');
var controller = botkit.slackbot({ debug : false });
var bot = controller.spawn({token : API_TOKEN});

bot.startRTM();

controller.hears([messages.HI, messages.HELLO, messages.HEY, messages.THERE], 'direct_message', function(bot, message){
  bot.createConversation(message, function(error, convo){
    convo.say(messages.HELLO);
    convo.activate();
  });
});

controller.hears(['how are you'],'direct_message' ,function(bot, message){
  bot.startConversation(message, function(error, convo){
    convo.say('I am doing amazing. thank you.');
    convo.next();
  });
});

controller.hears(['\\b(?:help)\\b'], 'direct_message', function(bot, message){
   bot.startConversation(message, function(error, convo){
           convo.say('how can I help you today? ');
           convo.next();
   });
});

controller.hears(['\\b(?:buy|search|look|look|find)\\b'], 'direct_message', function(bot, message){
   bot.startConversation(message, function(error, convo){

           convo.say('sure, I can help you with that');

           convo.addQuestion('is there any specific brand you are looking for?', function(res, convo) {
                convo.gotoThread('q2')
            }, {}, 'default')

            convo.addQuestion('what is your price limit?', function(res, convo) {
                 convo.gotoThread('q3')
             }, {}, 'q2')

             convo.addQuestion('any specific color you want it in?', function(res, convo) {
                  convo.gotoThread('end')
              }, {}, 'q3')

              convo.addMessage('gotch, thank you for details.', 'end')

           convo.next();
   });
});
