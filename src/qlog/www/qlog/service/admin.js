iris.resource(
 function(self){
  
  // GET /qlog/app
  self.getApps = function (success, error) {
   self.get("/qlog/app", function(ret){
    success(ret.apps);
   }, error);
  };
   
  // POST /qlog/app/add/:appName
  self.addApp = function (appName, success, error) {
   self.post("/qlog/app/add/" + appName , {}, function(ret){
    success(ret);
   }, error);
  };
  
  // DELETE /qlog/app/del/:app_id
  self.removeApp = function (appId, success, error) {
   self.del("/qlog/app/remove/" + appId, function(ret){
    success(ret);
   }, error);
  };
  
  // PUT /qlog/app/config
  self.configApp = function (app, success, error) {
   self.put("/qlog/app/config/", {application: app}, function(ret){
    success(ret);
   }, function(err) {error(err)});
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
   uri += "state=" + "app_name:" + app.name + ";";
   
   iris.resource(iris.path.service.auth).newWindow(uri, "loginApp", success);
  };
  
 },
 iris.path.service.admin);
