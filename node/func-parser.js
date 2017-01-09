var fs = require("fs"); // File system library

module.exports = {
  //////////////////
  // AppendToFile //
  //////////////////
  AppendToFile: function(file, data){
    var io = data["firstName"] + "," + data["lastName"] + "," + data["age"] + "\n";
    fs.appendFileSync("data/people.csv", io);
  },

  /////////////////
  // CsvToObject //
  /////////////////
  CsvToObject: function(file){
    var people = [];
    var fileContents = fs.readFileSync(file);
    var lines = fileContents.toString().split("\n");

    for(var i = 0; i < lines.length; i++){
      if(lines[i]){
        var data = lines[i].split(",");
        people.push({"firstName": data[0],
                     "lastName":  data[1],
                     "age":       data[2]});
      }
    }

    return people;
  },

  LocalTestingFunction: function(){
    console.log("Notice how you need to put `lib.` before calling this function");
  },
}
