var qlogconf = require('../qlogconf');

function handler(req, res, next){
 console.log("GET /oauth2callback");
 
 try {
  var state = req.query.state;
  
  var start = state.indexOf("app_name:") + "app_name:".length;
  var end = state.indexOf(";", start);
  var app_name = state.substring(start, end);
  if(!app_name){
   res.send(400, {
    err: "Not app parameter found!"
   });
  } else {
   qlogconf.getAppByName(app_name, function(err, app) {
    if (err || !app) {
     res.send(400, {
      err : 'Not Found!'
     });
    } else {
     res.application = app;
     next();  
    }
   });
  }
 } catch (err) {
  res.send(400, {
   err : err
  });
 }
 
}

module.exports = handler;

