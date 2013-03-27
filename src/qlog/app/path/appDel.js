var qlogconf = require('../qlogconf');

function handler(req, res, next){
 console.log("DELETE /app/del/:app_id");

 qlogconf.removeApp(req.params.app_id, function(err, ret){
  if(err) {
   res.send(400, {
    err: "error"
   });
  } else if (!ret) {
   res.send(400, {
    err: "Not found"
   });
  } else {
   res.send(200, {});
  }
 });
 
}

module.exports = handler;

