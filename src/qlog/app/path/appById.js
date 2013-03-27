var qlogconf = require('../qlogconf');

function handler(req, res){
 console.log("GET /qlog/app/id/:app_id");

 qlogconf.getAppById(req.params.app_id, function(err, app){
  if(err) {
   res.send(400, {err: "error"});
  } else {
   res.send(app);
  }
	});
 
}

module.exports = handler;