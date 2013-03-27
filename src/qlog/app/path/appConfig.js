var qlogconf = require('../qlogconf');

function handler(req, res){
 var application = req.body.application;
 console.log("PUT /qlog/app/config/");
 
 qlogconf.configApp(application, function(err, ret){
  if(err || ret === 0){
   res.send(400, {
    err : 'not found'
   });
  } else {
   res.send(200, ret);
  }
 });
}

module.exports = handler;