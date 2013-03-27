$(document).ready(
 function () {
        
  function _setLang() {    
   var regExp = /[?&]lang=[a-z][a-z][\-_][A-Z][A-Z]/;
   var lang = window.location.href.match(regExp);
   if ( lang !== null) {
    iris.locale(lang[0].substring(lang[0].length - 5, lang[0].length));
   } else {
    iris.locale("en_US");
   }
  }
            
  iris.translations("es_ES", {
   MENU: {
    WELCOME: "CLIENTE QLOG"
   },
   OK: "OK",
   ERROR: "Error",
   NAME: "Nombre de la aplicación",
   LOGIN: "Conectar",
   LOGOUT: "Desconectar"
  });
            
  iris.translations("en_US", {
   MENU: {
    WELCOME: "QLOG CLIENT"
   },
   OK: "OK",
   ERROR: "Error",
   NAME: "App name",
   LOGIN: "Login",
   LOGOUT: "Logout"
  });
        
  iris.locale(
   "en_US", {
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    dateFormat: "m/d/Y h:i:s",
    currency: {
     formatPos: "n",
     formatNeg: "(n)",
     decimal: ".",
     thousand: ",",
     precision: 2
    }
   }
   );

  iris.locale(
   "es_ES", {
    dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    dateFormat: "d/m/Y H:i:s",
    currency: {
     formatPos: "n",
     formatNeg: "-n",
     decimal: ",",
     thousand: ".",
     precision: 2
    }
   }
   );

  _setLang();
        
  iris.path = {
   screen: {
    welcome: {
     js: "/qlog/screen/welcome.js", 
     html: "/qlog/screen/welcome.html"
    },
    logger: {
     js: "/qlog/screen/logger/logger.js", 
     html: "/qlog/screen/logger/logger.html"
    }
   },
   ui: {
    modal: {
     js: "/qlog/ui/modal.js", 
     html: "/qlog/ui/modal.html"
    }
   },
   service: {
    auth: "/qlog/service/auth.js",
    logger: "/qlog/service/logger.js"
   }
  };
        
  iris.evts = {
   shopping : {
    listCreated: "shopping_list_created",
    listLoaded: "shopping_list_loaded",
    listSaved: "shopping_list_saved",
    listRemoved: "shopping_list_removed",
    productAdded: "shopping_product_added",
    productRemoved: "shopping_product_removed",
    productRemoved_io: "shopping_product_removed_io",
    productPurchased: "shopping_product_purchased",
    productPurchased_io: "shopping_product_purchased_io"
   },
   user : {
    changed: "user_changed",
    collaboratorRemoved: "collaborator_removed"
   }
  };
        
  iris.on(iris.SERVICE_ERROR, function(p_request, p_textStatus, p_errorThrown) {
   if (p_request.request.status === 401) {
    window.location.href = "/login?next=/#admin";
   }
  });
        
  iris.baseUri(".");
  iris.enableLog("localhost");
  iris.welcome("/qlog/screen/welcome.js");
        
 }
 );