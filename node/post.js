module.exports = function(app){
  //////////////////////////////////
  // Include local libraries here //
  //////////////////////////////////
  var fs  = require("fs");
  // var lib = require("./func-parser.js");

  //////////////
  // readfile //
  //////////////
  app.post("/readfile", function(req, res){
    fs.readFile(req.body.file, "utf8", function(err, data){
      res.json(data);
    });
  });
}
