iris.resource(
 function(self){
  
  // GET /qlog/app
  self.getApp = function (app_name, success, error) {
   self.get("/qlog/app/" + app_name, function(ret){
    success(ret);
   }, function (err) {
    error(err);
   });
  };
  
  
  // GET app.uri
  self.checkApp = function (app, success, error) {
   var uri = app.endpoint;
   if (app.endpoint.lastIndexOf("/") === app.endpoint.length -1) {
    uri += "/";
   }
   uri += "?";
   uri += "response_type=code";
   uri += "&";
   uri += "client_id=" + app.clientId;
   uri += "&";
   uri += "scope=" + app.scope;
   uri += "&";
   uri += "redirect_uri=" + app.redirectURI;
   uri += "&";
   uri += "access_type=offline";
   uri += "&";
   uri += "approval_prompt=force";
   uri += "&";
   uri += "state=" + "app_name:" + app.name + ";redirect:" + window.location.origin + "/auth.html;";
   
   
   iris.resource(iris.path.service.auth).newWindow(uri, "loginApp", success);
  };
   
 },
 iris.path.service.logger);
