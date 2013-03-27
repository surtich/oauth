iris.resource(
 function(self){
  
  var currentUser = null;
  
  self.cleanUser = function() {
   currentUser = null;
  }
  
  self.getUser = function(success, error, force){
   if (currentUser && !force) {
    success(currentUser);
   } else {
    getUser(success, error)
   }
  };
  
  
  function getUser (success, error){
   iris.ajax({
    url : 'api/user'
   }).done(function(user){
    success(user);
   }).fail(function(user) {
    error(user);
   });
  };
  
  self.newWindow = function(url, name, fnOnClosed, fnAfterOnclosed) {
   var popupWindow = window.open(
    url,
    name,'height=500,width=450,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes');
   var it = setInterval(function() {
    if (popupWindow.closed) {
     clearInterval(it);
     if (fnOnClosed) {
      fnOnClosed(fnAfterOnclosed);
     }
    }
   }, 200);
  }
  
  self.userChanged = function(fn) {
   getUser(function(user) {
    if (user !== currentUser) {
     iris.resource(iris.path.service.io).disconnect();
     currentUser = user;
     iris.notify(iris.evts.user.changed, currentUser);
     iris.navigate("#/home");
     if (currentUser) {
      iris.resource(iris.path.service.io).connect(function() {
       });
     }
    }
    if (fn) {
     fn();
    }
   }, function(){
    
    }, true);
  }
 },
 iris.path.service.auth);
