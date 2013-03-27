var qlogconf = require('../qlogconf');

function handler(req, res){
 
 var appName = req.params.appName;
 
 console.log("POST /qlog/app/add" + req.params.appName);

 qlogconf.addApp(appName, function(err, ret){
  if(err){
   res.send(400, {
    err : err
   });
  } else {
   res.send(200, {ret: ret});
  }
 });
}

module.exports = handler;

