const path = require("path");
const { copyFile, constants } = require("node:fs/promises");
const fs = require("fs/promises");
const streams = require('fs')

let sourceFolderName = "project-dist";
let destination = path.join(__dirname, 'project-dist', 'bundle.css');
let source = path.join(__dirname, `styles`);

(async function copyStyles() {
  try {
    await fs.rm(destination, { recursive: true, force: true });
    await fs.open(destination, 'w', 0o666,(err) => {
      if (err) throw err;
      console.log('file created')
    });
    let writeStream = streams.createWriteStream(destination, 'utf-8')
    const files = await fs.readdir(source, "utf-8");
    files.forEach(file => {
      streams.stat(path.join(source, file), (err, stats) => {
        if (stats.isFile() && path.parse(path.join(source, file)).ext === ".css") {
          console.log(`File ${file} appended`)
          let readableStream = streams.createReadStream(path.join(source, file), 'utf-8');
          readableStream.pipe(writeStream);
        } else
        console.log(`File ${file} rejected`)
      })
     
    })
  } catch (err) {
    console.log(`Error ${err}`)
  }
})()

