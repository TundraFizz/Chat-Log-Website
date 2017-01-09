module.exports = function(app){
  //////////////////////////////////
  // 404: No route or file exists //
  //////////////////////////////////
  app.use(function (req, res){
    res.render("404.ejs");
  });
}
