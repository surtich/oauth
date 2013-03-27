var qlogconf = require('../qlogconf'),
commons = require('../../../lib/commons'),
request = commons.request,
inspect = commons.util.inspect;



function handler(req, res){
 console.log("GET /oauth2callback");
 var app = res.application;
 var state = req.query.state;
 var start = state.indexOf("redirect:") >= 0 ? state.indexOf("redirect:") + "redirect:".length: -1;
 var end = start >= 0 ? state.indexOf(";", start): -1;
 var redirect = end > start ? state.substring(start, end): "";
 
 var uri = "https://accounts.google.com/o/oauth2/token";
 var body = "code=" + req.query.code;
 body += "&";
 body += "client_id=" + app.clientId;
 body += "&";
 body += "client_secret=" + app.clientSecret;
 body += "&";
 body += "redirect_uri=" + app.redirectURI;
 body += "&";
 body += "grant_type=authorization_code";
 
 var options = {
  uri: uri,
  headers: {
   'content-type' : 'application/x-www-form-urlencoded'
  },
  method: 'POST',
  body: body
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
    var queryString = "access_token=" + JSON.parse(body).access_token;
    queryString += "&";
    queryString += "refresh_token=" + JSON.parse(body).refresh_token;
    queryString += "&";
    queryString += "app_id=" + app._id;
    queryString += "&";
    queryString += "redirect=" + redirect;
    res.redirect(redirect + "?" + queryString);
   } else {
    res.send(200, body);
   }
   
  }
 });
 
}

module.exports = handler;

