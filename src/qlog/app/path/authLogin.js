var qlogconf = require('../qlogconf'),
commons = require('../../../lib/commons'),
request = commons.request,
inspect = commons.util.inspect;



function handler(req, res){
 console.log("GET /oauth2login");
 
 var access_token = req.query.access_token;
 var app_id = req.query.app_id;
 var redirect = "";
 
 var uri = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + access_token;
 
 var options = {
  uri: uri,
  method: 'GET'
 };

 request(options, function(err, response, body) {
  if (err) {
   res.send(400, {
    err : err
   });
  } else {
   console.log(inspect({
    response: {
     statusCode: response.statusCode
    },
    body: body
   }));
   if (redirect) {
    redirect += "?";
    redirect += "access_token=" + JSON.parse(body).access_token;
    redirect += "&";
    redirect += "refresh_token=" + JSON.parse(body).refresh_token;
    res.redirect(redirect);
   } else {
    var error = JSON.parse(body).error;
    
    if (error) {
     res.send(400, error);
    } else {
     qlogconf.getAppById(app_id, function(err, app) {
      if(err || !app) {
       res.send(400, {err:'App not found!'});
      } else {
       if (app.clientId !== JSON.parse(body).audience) {
        res.send(400, {err:'App not match!'});
       } else {
        res.send(200, body);
       }
      }
     });
     
    }
    
   }
   
  }
 });
 
}

module.exports = handler;

