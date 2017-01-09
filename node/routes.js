module.exports = function(app){
  //////////////////////////////////
  // Include local libraries here //
  //////////////////////////////////
  var fs = require("fs");

  ///////////
  // Index //
  ///////////
  app.get("/", function(req, res){
    try{
      var log_history = "";
      var html        = "";

      // Default values are the current year and week
      var d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate()+4-(d.getDay()||7));

      var this_year;
      var this_week;

      // Read the path
      if(req.query.server){
        var this_server = req.query.server;

        if(req.query.log){
          // Set to a user-defined year and week
          var this_year = req.query.log.substr(0, 4);
          var this_week = req.query.log.substr(5, 2);
        }
      }

      ///////////////////////
      // Build log_history //
      var week_container   = [];                         // Array to contain the weeks
      var log_server       = "log" + "/" + this_server;  // Get what server we're looking at
      var log_server_years = fs.readdirSync(log_server); // Get all years from log_server

      // Loop through all years that are a part of the log files
      for(var i = 0; i < log_server_years.length; i++){
        var log_server_year = "log" + "/" + this_server + "/" + log_server_years[i]; // Get the exact year of logs we're currently looking at
        var log_server_months = fs.readdirSync(log_server_year);                     // Get all months in a year

        // Loop through all the months of a year and push the results into week_container
        for(var j = 0; j < log_server_months.length; j++){
          week_container.push(log_server_years[i] + "-" + log_server_months[j]);
        }
      }

      // Reverse week_container so that the array is in chronological order
      week_container = week_container.reverse();

      // Find out which should be selected. If it's invalid, default to the first one
      var selected_choice = 0;
      for(var i = 0; i < week_container.length; i++)
        if(week_container[i] == this_year + "-" + this_week)
          selected_choice = i;

      log_history += `
      <form style="display: inline">
      <input type="hidden" name="server" value="` + this_server + `">
      <select name="log" onchange="this.form.submit()">`;

      // Build log_history here
      for(var i = 0; i < week_container.length; i++){
        var selected = "";

        if(i == selected_choice)
          selected = "selected";

        var thingy = week_container[i]; // YYYY-WW

        var y = thingy.substr(0, 4); // YYYY
        var w = thingy.substr(5, 2); // WW

        var d = new Date(y, 0, 1);
        var week_start = new Date(d);
        var week_end   = new Date(d);
        var dow = d.getDay();
        if     (dow == 1) week_start.setDate(week_start.getDate() + 6); // If Monday,    add 6 days
        else if(dow == 2) week_start.setDate(week_start.getDate() + 5); // If Tuesday,   add 5 days
        else if(dow == 3) week_start.setDate(week_start.getDate() + 4); // If Wednesday, add 4 days
        else if(dow == 4) week_start.setDate(week_start.getDate() + 3); // If Thursday,  add 3 days
        else if(dow == 5) week_start.setDate(week_start.getDate() + 2); // If Friday,    add 2 days
        else if(dow == 6) week_start.setDate(week_start.getDate() + 1); // If Saturday,  add 1 days

        week_start.setDate(week_start.getDate() + ((w - 1) * 7)); // Now add an amount of days equal to: (week - 1) * 7
        week_end.setDate(week_start.getDate() + 6);               // Add six days to the start of the week

        var start_month = ConvertDateToMonthName(week_start);
        var start_day   = week_start.getDate();
        var start_year  = week_start.getFullYear();

        var end_month   = ConvertDateToMonthName(week_end);
        var end_day     = week_end.getDate();
        var end_year    = week_end.getFullYear();

        var formatted_date = start_month + " " + start_day + ", " + start_year + " - " +
                             end_month   + " " + end_day   + ", " + end_year;

        log_history += `
        <option ` + selected + ` value="` + week_container[i] + `">` + formatted_date + `</option>
        `;
      }

      log_history += `</select></form>`;

      ////////////////
      // Build html //
      if(!(week_container.indexOf(this_year + "-" + this_week) > -1)){
        this_year = week_container[0].substr(0, 4);
        this_week = week_container[0].substr(5, 2);
      }

      var path = "log" + "/" + this_server + "/" + this_year + "/" + this_week;
      var files_of_date = fs.readdirSync(path);

      for(var i = 0; i < files_of_date.length; i++){
        var file    = path + "/" + files_of_date[i];
        var channel = files_of_date[i].substr(8, files_of_date[i].length - 8 - 4);

        html += `
        <button type="button" onclick="ReadFile(this);"
        file="` + file + `">` + channel + `</button>`;
      }
    }
    catch(error){
      log_history = "";
      html = `
      Enter a server ID number:
      <form>
        <input type="text" name="server"><input type="submit" value="Submit">
      </form>
      `;
    }

    //////////////////////////
    // Send results to user //
    res.render("index.ejs",{
      log_history: log_history,
      html:        html
    });
  });
}
