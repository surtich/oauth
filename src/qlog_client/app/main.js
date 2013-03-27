#!/usr/bin/env node
var commons = require('../../lib/commons'),
hero	= commons.hero
server =  commons.http.createServer(hero.app),
io = commons.io.listen(server, { log: false }),
qlogClientconf = require('./qlogClientconf.js');

hero.app.io = io;

hero.init(
 require("./paths.js").paths,

 function (){
  qlogClientconf.ready(function(err){
   if(err) {
    hero.error(err);
   } else {
    
    server.listen(hero.app.get('port'));
    //console.log(commons.util.inspect(app));
    console.log('listening on port ' + hero.app.get('port'));
   }
  });
 }
 );

