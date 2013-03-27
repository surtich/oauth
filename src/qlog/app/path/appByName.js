var qlogconf = require('../qlogconf');

function handler(req, res){
 console.log("GET /qlog/app/name/:app_name");

 qlogconf.getAppByName(req.params.app_name, function(err, app){
  if(err) {
   res.send(400, {err: "error"});
  } else {
   res.send(app);
  }
	});
 
}

module.exports = handler;