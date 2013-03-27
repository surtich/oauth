var commons = require('../../lib/commons'),
extend	= commons.extend,
mongodb = commons.mongodb,
async	= commons.async,
ObjectID = commons.mongodb.ObjectID,
passport = commons.passport,
GoogleStrategy	= commons.GoogleStrategy,
util = commons.util,
hero	= commons.hero,
app		= hero.app,
express	= commons.express,
//auth = require('./auth.js'),
RedisStore		= commons.RedisStore

module.exports = hero.worker (
 function(self){
  var port = self.config.app.port;
  var url  = self.config.app.url + ":" + port + '/';
  var redis_client;

  var dbQlog = self.db('qlog', self.config.app.db.qlog_conf);
  var dbSession = self.db('session', self.config.app.db.session);
  var dbUsers = self.db('user', self.config.app.db.user_config);
  
  self.dbUsers = dbUsers;
  
  var colCounters, colUsers, colApps;

  // Configuration
  app.configure(function() {
   app.set('port', process.env.PORT || port);
   app.set('url', url);
   app.use(express.logger());
   app.use(express.cookieParser());
   app.use(express.bodyParser());
   app.use(express.session({
    secret: 'SEC12345678RET',
    store: new RedisStore({
     host: self.config.app.db.session.host, 
     port: self.config.app.db.session.port, 
     pass: self.config.app.db.session.pass, 
     client: dbSession.client
    })
   }));
   app.use(express.methodOverride());
   //app.use(passport.initialize());
   //app.use(passport.session());
   app.use(app.router);
   app.use(express.errorHandler({
    dumpExceptions : true,
    showStack : true
   }));
   app.use(express["static"](__dirname + "/../www"));
  });
  
  //auth(self);
    
  self.ready = function(p_cbk){
   async.parallel (
    [
    // mongoDb
    function(done){
     dbQlog.setup(
      function(err, client){
       self.mongo_client = client;
       colUsers = new mongodb.Collection(client, 'users');
       colCounters = new mongodb.Collection(client, 'counters');
       colApps = new mongodb.Collection(client, 'apps');
       colApps.ensureIndex({
        name:1
       }, {
        unique:true, 
        w:1
       }, function(err, result) {
        done(err);
       });
       
      }
      );
    },
    // redis
    function(done){
     dbUsers.setup(
      function(err, client){
       redis_client = client;
       self.redis_client = redis_client;
       done(null);
      }
      );
    }
    ], function(err){
     p_cbk(err);
    }
    );
  };


  // -----
  // USERS
  // -----

  function getUserFromId(userId, p_cbk){
   var find = {
    usr: ObjectID(String(userId))
   };

   colUsers.findOne(find, {
    fields:{
     _id:0
    }
   }, function(err, user){
    if(err || user === null){
     p_cbk(err, null);
    } else {
     p_cbk(null, user);
    }
   });
  }

  function getUserFromEmail(email, p_cbk){
   var find = {
    email : email
   };

   colUsers.findOne(find, {
    fields:{
     _id:0
    }
   }, function(err, user){
    if(err || user === null){
     p_cbk(err, null);
    } else {
     p_cbk(null, user);
    }
   });
  }

  function createUser(email, p_cbk){
   var user = {
    usr : ObjectID(),
    email: email,
    lan : 'en',
    knds : [],
    idps : []
   };

   colUsers.insert(user, {
    w:1
   }, function(err, users){
    if(err || users.length === 0){
     p_cbk(err, null);
    } else {
     p_cbk(null, users[0]);
    }
   });
  }

  // -----
  // IDPS
  // -----
  function setUserIdp(userId, idp, p_cbk){
   // redis_client.set("idp:" + idp.idp + ":" + idp.uid, userId, function(){});

   var find = {
    usr: ObjectID(String(userId)),
    'idps.idp': idp.idp
   };

   var set = {
    $set:{
     'idps.$.uid': idp.uid
    }
   };

   colUsers.update(find, set, function(err,res){
    if(res){
     // idp updated
     p_cbk(err,res);
    } else {
     // idp does not exists, must be created
     var find = {
      usr: ObjectID(String(userId))
     };

     var set = {
      $addToSet: {
       'idps': idp
      }
     };

     colUsers.update(find, set, function(err,res){
      p_cbk(err,res);
     });
    }
   });
  }
  
  // -----
  // APPS
  // -----

  function createApp(appName, p_cbk){
   colApps.insert({
    name: appName,
    state: 'pending'
   }, {
    w:1
   }, function(err, result){
    if (result && result.length > 0) {
     p_cbk(err, result[0]);
    } else {
     p_cbk(err, null);
    }
    
   });
  }
  
  function configApp(application, p_cbk){
   var find = {
    _id: ObjectID(String(application._id))
   };
   application.state = 'configured'
   
   var set = {
    $set:{
     endpoint: application.endpoint,
     clientId: application.clientId,
     clientSecret: application.clientSecret,
     state: application.state,
     scope: application.scope,
     redirectURI: application.redirectURI
    }
   };
   
   colApps.update(find, set, {
    w: 1
   }, function(err, res){
    if (err || !res) {
     p_cbk(err, res);
    } else {
     p_cbk(null, application);
    }
   });
  }
  
  function setAuthCode(app_id, code, p_cbk){
   var find = {
    _id: ObjectID(String(app_id))
   };
   
   var set = {
    $set:{
     state: 'authorized',
     code: code
    }
   };
   
   colApps.update(find, set, {
    w: 1
   }, function(err, res){
    if (err || !res) {
     p_cbk(err, res);
    } else {
     getAppById(app_id, p_cbk);
    }
   });
  }
  
  function getApps(p_cbk){
   colApps.find().toArray(function(err, result){
    p_cbk(err, result);
   });
  }
  
  function getAppById(app_id, p_cbk){
   try {
   colApps.findOne({
    _id: ObjectID(String(app_id))
   }, function(err, app){
    if(err || app === null){
     p_cbk(err, null);
    } else {
     p_cbk(null, app);
    }
   });
   } catch(err) {
    p_cbk("error", null);
   }
  }
  
  function getAppByName(app_name, p_cbk){
   colApps.findOne({
    name: app_name
   }, function(err, app){
    if(err || app === null){
     p_cbk(err, null);
    } else {
     p_cbk(null, app);
    }
   });
  }
  
  function removeApp(app_id, p_cbk){
   
   var find = {
    _id: ObjectID(String(app_id))
   };
   
   colApps.remove(find, {
    w: 1
   }, function(err, res){
    p_cbk(err, res);
   });
   
  }

  // -----
  // UTILS
  // -----

 
  function getNextSequence(name, p_cbk, order) {
   colCounters.findAndModify({
    _id: name
   }, {}, {
    $inc: {
     seq: order !== undefined ? order : 1
    }
   }, {
    "new": true, 
    "upsert": true
   }, function (err, ret) {
    p_cbk(err, ret);
   });
   
  }

  self.getUserFromId = getUserFromId;
  self.getUserFromEmail = getUserFromEmail;
  self.createUser = createUser;
  self.setUserIdp = setUserIdp;
  self.addApp = createApp;
  self.getApps = getApps;
  self.removeApp = removeApp;
  self.configApp = configApp;
  self.setAuthCode = setAuthCode;
  //self.setAuthToken = setAuthToken;
  self.getAppById = getAppById
  self.getAppByName = getAppByName
 }
 );