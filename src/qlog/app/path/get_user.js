function handler(req, res){
 console.log("GET /api/user");
 if(req.user) {
  res.send(200, {
   email : req.user.email
  });
 } else {
  res.send(200, null);
 }
}

module.exports = handler;

