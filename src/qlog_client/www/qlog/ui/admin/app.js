iris.ui(function(self) {	
 var app = {};
 
 function changeState () {
  self.get("state").text(iris.translate("ADMIN." + app.state.toUpperCase()));
  showOrHide();
 }
 
 function showOrHide() {
  switch (app.state) {
   case "pending":
    self.get("check").hide();
    break;
   case "configured":
    self.get("check").show();
    break;
  }
 }
 
 function afterConfig(newApp) {
  app = newApp;
  changeState();
 }
    
 self.create = function() {
  app = self.setting("app");
  self.tmpl(iris.path.ui.app.html, app);
  self.inflate({
   state: iris.translate("ADMIN." + app.state.toUpperCase())
  });
  
  self.get("remove").click(function() {
   iris.resource(iris.path.service.admin).removeApp(app._id, function() {
    self.setting("destroyUI")(self);
   }, function(err) {
    throw err;
   });
  });
  
  self.get("config").click(function() {
   self.setting("configApp")(app, afterConfig);
  });
  
  self.get("check").click(function() {
   iris.resource(iris.path.service.admin).checkApp(app, function() {
    
    }, function(err) {
     throw err;
    });
  });
  
  
  changeState();
  
 };
 
    
    
}, iris.path.ui.app.js);  