var qlogconf = require('../qlogClientconf');

function handler(req, res){
 console.log("GET /qlog/app/:app_name");

 qlogconf.getApp(req.params.app_name, function(err, ret){
  if(err) {
   res.send(400, {
    err: "error"
   });
  } else {
   res.send(ret);
  }
 });
 
}

module.exports = handler;