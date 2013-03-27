iris.screen(

 function (self) {	
  var user = null;
  var modal = null;
  
  function _onError() {
   window.onerror = function(msg, url, line){
    modal.get('header').text(iris.translate("ERROR"));
    self.get("text").html(msg);
    modal.get('div_modal').modal('show');
   };
  }
 
  function _ajaxPrepare() {
   $.ajaxPrefilter(function( options, originalOptions, jqXHR ) {            
    //self.get("screens").hide();
    self.get("loading").show(); 
    jqXHR.always(function(data, rdo) {
     self.get("loading").hide();
     if (rdo === "error") {
      modal.get('header').text(iris.translate("ERROR"));
      var text = "Error " + data.status;
      if (data.responseText) {
       try {
        text += " " + JSON.parse(data.responseText.err);
       } catch(e) {
        text = " " + data.responseText;
       }
       self.get("text").html(text);
      } else {
       self.get("text").html("");
      }
      modal.get('div_modal').modal('show');
     } else if(data) {
      if(data.redirect) {
       window.location.href = data.redirect;
       return;
      } else if (data.popup_login) {
       iris.resource(iris.path.service.auth).newWindow(data.popup_login, "auth", iris.resource(iris.path.service.auth).userChanged);
      }
     }
    //self.get("screens").show();
    });            
   });                
  }
            
  function _createScreens() {
   self.screens("screens", [
    ["admin", iris.path.screen.admin.js]
    ]);
  }
        
  function _changeLang(link) {
   var regExp = /[?&]lang=[a-z][a-z][\-_][A-Z][A-Z]/;
   var origin = window.location.origin;
   var url = window.location.href;
   var hash = window.location.hash;
   var params = url.substr(0, url.indexOf(hash))
   params = params.substr(origin.length + 1);
   var lang = params.match(regExp);
   if ( lang === null) {
    lang = "lang=" + link.data("lang");
    if (params.match(/[?]/)) {
     lang = "&" + lang;                            
    } else {
     lang = "?" + lang;
    }
    url = origin + "/" + params + lang + hash;
   } else {
    var first = lang[0].substr(0,6);
    url = window.location.href.replace(regExp, first + link.data("lang"));                       
   }
   window.location.href = url;
  }
  
  
  
  function setUser() {
   if (user && user.email) {
    self.get("login").text(iris.translate("MENU.LOGOUT") + " (" + user.email + ")").data("url", "/logout");
   } else{
    self.get("login").text(iris.translate("MENU.LOGIN")).data("url", "/auth/google");
   }
  }
            
            
  self.create = function () {
            
   self.tmpl(iris.path.screen.welcome.html);
   
   modal = self.ui("modal", iris.path.ui.modal.js);
            
   _onError();
   
   _ajaxPrepare();
            
   _createScreens();
            
   $("[data-lang]").click(
    function (event) {
     _changeLang($(this));
     event.preventDefault();
    }
    );
   
   
   self.get("login").click(function(event) {
    event.preventDefault();
    iris.resource(iris.path.service.auth).newWindow($(this).data("url"), "auth", iris.resource(iris.path.service.auth).userChanged);
   });
   
   self.on(iris.evts.user.changed ,function(u) {
    user = u;
    setUser();
   });
   iris.resource(iris.path.service.auth).getUser(function(u) {
    user = u;
    setUser();
   });
   
  };
  
  self.awake = function(params) {
   if (params.msg) {
    modal.get('header').text(iris.translate("INFO"));
    self.get("text").html(params.msg);
    modal.get('div_modal').modal('show');
    iris.navigate("#/admin"); //Default page
   } else if ( !document.location.hash ) {                
    iris.navigate("#/admin"); //Default page
   }
  }
  
 } , iris.path.screen.welcome.js);
