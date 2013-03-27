var qlogconf = require('../qlogconf');

function handler(req, res){
 console.log("GET /qlog/app");

 qlogconf.getApps(function(err, ret){
  if(err){
   res.send(400, {
    err : err
   });
  } else {
   res.send(200, {apps: ret});
  }
 });
}

module.exports = handler;

