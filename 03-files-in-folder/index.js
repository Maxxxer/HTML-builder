const path = require("path");
const fs = require("fs");
fs.readdir(path.join(__dirname, "secret-folder"), "utf-8", (err, data) => {
  if (err) throw err;
  for (let file of data) {
    let filepath = (path.join(__dirname, "secret-folder", file));
    fs.stat(filepath, (err, stats) => {
      if (stats.isFile())
        console.log(path.parse(filepath).name+' - '+path.parse(filepath).ext.slice(1)+' - '+ (Math.round((100 * stats.size) / 1024) / 100)+"kb")
    });
  }
});
