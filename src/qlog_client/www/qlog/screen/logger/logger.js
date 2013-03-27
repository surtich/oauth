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
   self.tmpl(iris.path.screen.logger.html);
   self.get("login").click(function() {
    iris.resource(iris.path.service.logger).getApp(self.get("app_name").val(), function(app) {
     if (app) {
      iris.resource(iris.path.service.logger).checkApp(app, function() {
       
      });
     } else {
      throw "Not found!";
     }
    }, function() {
    });
   });
  };
        
  self.awake = function (params) {
   
  };
 }, iris.path.screen.logger.js);