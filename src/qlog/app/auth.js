var commons = require('../../lib/commons'),
passport = commons.passport,
GoogleStrategy	= commons.GoogleStrategy,
util = commons.util,
hero	= commons.hero,
request			= commons.request,
app		= hero.app;

function auth (self) {
 
 passport.use(
  new GoogleStrategy({
   clientID    : self.config.oauth.login.google.client_id,
   clientSecret: self.config.oauth.login.google.secret_key,
   callbackURL : self.config.oauth.login.google.redirect_uri
  },

  function(accessToken, refreshToken, profile, done) {
   var idp      = 'google';
   var idpUid   = profile.id;
   var idpEmail = profile.emails[0].value;

   getUid(idp, idpUid, function (err, uid){
    debugger
    if(err===null) {
     if ( uid===null) {
      createAccount( idp, idpUid, idpEmail, done);
     }
     else {
      done(null, uid);
     }
    }
   });
  }
  ));
   
 passport.serializeUser(function(user, done) {
  done(null, user);
 });

 passport.deserializeUser(function(id, done) {
  if (!self.user) {
   self.user = {};
  }
  if(self.user[id]) {
   done(null, self.user[id]);
  } else {
   self.getUserFromId(id, function(err, user) {
    if (err) {
     done(err, null);
    } else {
     self.user[id] = user;
     done(null, self.user[id]);
    }
   }); 
  }
  
 });
 
 function getUid(p_idp, p_idpUid, callback){
  console.log( 'getUid', p_idp, p_idpUid );
  self.dbUsers.client.get('idp:'+p_idp+':'+p_idpUid, function (err, uid) {
   debugger
   console.log('getUid response', 'idp:'+p_idp+':'+p_idpUid, uid);
   if(err){
    hero.err(err);
    callback(err, null);
   }
   else if ( uid === null ) {
    callback(null, null);
   }
   else {
    callback(null, uid);
   }
  });
 }

 function createAccount(p_idp, p_idpUid, p_email, callback){
  console.log( 'createAccount', p_idp, p_idpUid, p_email );
  //saveUid(p_idp, p_idpUid, Math.random()*10000, callback);

  request.post(
  {
   headers : {
    'content-type' : 'application/json'
   },
   url : app.get('url') + "api/user",
   body : JSON.stringify( {
    idp : p_idp, 
    uid : p_idpUid , 
    email : p_email
   } )
  },
  function(err, res, body){
   var json = JSON.parse( body );
   saveUid(p_idp, p_idpUid, json.uid, callback);
  }
  );

 }

 function saveUid(p_idp, p_idpUid, p_uid, callback){
  self.dbUsers.client.set (
   'idp:'+p_idp+':'+p_idpUid,
   p_uid,
   function (err){
    callback(err, p_uid);
   }
   );
 }
 
 // GET /auth/google
 //   Use passport.authenticate() as route middleware to authenticate the
 //   request.  The first step in Google authentication will involve
 //   redirecting the user to google.com.  After authorization, Google
 //   will redirect the user back to this application at /auth/google/callback
 app.get('/auth/google',
  passport.authenticate('google', {
   scope: ['https://www.googleapis.com/auth/userinfo.profile',
   'https://www.googleapis.com/auth/userinfo.email']
  }),
  function(req, res){
  // The request will be redirected to Google for authentication, so this
  // function will not be called.
  });
     
 // GET /auth/google/callback
 //   Use passport.authenticate() as route middleware to authenticate the
 //   request.  If authentication fails, the user will be redirected back to the
 //   login page.  Otherwise, the primary route function function will be called,
 //   which, in this example, will redirect the user to the home page.
 app.get('/oauth2callback', 
  passport.authenticate('google', {
   failureRedirect: '/auth/google'
  }),
  function(req, res) {
   res.redirect('/connected');
  });

 app.get('/logout', function(req, res){
  req.session.destroy();
  req.logout();
  res.redirect('/disconnected');
 });
 
}

module.exports = auth;