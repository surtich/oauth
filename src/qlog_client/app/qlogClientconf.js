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
request = commons.request,
//auth = require('./auth.js'),
RedisStore		= commons.RedisStore;

module.exports = hero.worker (
 function(self){
  var port = self.config.client.port;
  var url  = self.config.client.url + ":" + port + '/';
  
  var server_port = self.config.app.port;
  var server_url  = self.config.app.url + ":" + server_port + '/';
  
  var redis_client;

  var dbQlog = self.db('qlog', self.config.client.db.qlog_conf);
  var dbSession = self.db('session_client', self.config.client.db.session);
  var dbUsers = self.db('user_client', self.config.client.db.user_config);
  
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

  function getApp(app_name, p_cbk){
   
   var uri = server_url + "qlog/app/name/" + app_name;
   
   var options = {
    uri: uri,
    method: 'GET'
   };
   
   request(options, function(err, response, body) {
    p_cbk(err, body);
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
  self.getApp = getApp;
 }
 );