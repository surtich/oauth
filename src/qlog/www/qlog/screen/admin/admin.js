iris.screen(
 function (self) {
  
  var config = null;
 
  function newUI(app) {
   self.ui("table_container", iris.path.ui.app.js, {
    "app": app,
    "destroyUI": function(ui) {
     self.destroyUI(ui); 
    },
    "configApp": function(app, afterConfig) {
     config.prepare(app, afterConfig);
     config.get('div_config').modal('show');
     return config.app;
    }
   },  self.APPEND);
  }
  
  function _inflate(apps) {
   $.each(apps,                
    function(index, app) {                    
     newUI(app);
    });
  }
        
        
  self.create = function () {
   self.tmpl(iris.path.screen.admin.html);
   config = self.ui("div_modal", iris.path.ui.config.js);
   self.get("add").off("click").click(function() {
    if (self.get("nameAdd").get(0).validity.valid) {
     iris.resource(iris.path.service.admin).addApp(self.get("nameAdd").val(), function(ret) {
      newUI(ret.ret);
      self.get("nameAdd").val("");
     });
    } else {
     self.get("nameAdd").focus().select();
    }
   });
  };
        
  self.awake = function (params) {
   self.destroyUIs("table_container");
   self.get("nameAdd").val("");
   iris.resource(iris.path.service.admin).getApps(_inflate, function(err) {
    throw err;
   });
  };
 }, iris.path.screen.admin.js);