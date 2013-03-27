iris.ui(
 function (self) {	
  self.app = {};
  self.afterConfig = null;
  
  self.create = function () {
   self.tmpl(iris.path.ui.config.html);
   self.get("save_config").click(function() {
    self.app.endpoint = self.get("endpoint").val();
    self.app.clientId = self.get("client_id").val();
    self.app.clientSecret = self.get("client_secret").val();
    self.app.scope = self.get("scope").val();
    self.app.redirectURI = self.get("redirect_uri").val();
    iris.resource(iris.path.service.admin).configApp(self.app, function(app) {
     self.app = app;
     self.get('div_config').modal('hide');
     if (self.afterConfig) {
      self.afterConfig(self.app);
     }
    }, function(err) {
     throw err;
    });
   });
  };
  
  self.prepare = function(app, afterConfig) {
   self.app = app;
   self.afterConfig = afterConfig;
   self.get("app_name").text(app.name);
   self.get("endpoint").val(app.endpoint);
   self.get("client_id").val(app.clientId);
   self.get("client_secret").val(app.clientSecret);
   self.get("scope").val(app.scope);
   self.get("redirect_uri").val(app.redirectURI);
  }
 }, iris.path.ui.config.js);
