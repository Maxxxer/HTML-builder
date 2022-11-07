const path = require("path");
const { copyFile, constants } = require("node:fs/promises");
const { mkdir } = require("node:fs/promises");
const fs = require("fs/promises");
const streams = require("fs");

let destination = path.join(__dirname, "project-dist");
let sourceHTML = path.join(__dirname, "components");
let components = {};
let index;

async function makeWebPage() {
  try {
    await fs.rm(destination, { recursive: true, force: true });
    await createDir();
    await assembleHTML();
    await copyStyles();
    await copyAssets();
    // await render();
  } catch (err) {
    console.log(`Error in ${err}`);
  }
}

async function createDir() {
  try {
    mkdir(destination, { recursive: true });
    console.log("directory created");
  } catch (err) {
    console.log(`Error in ${err}`);
  }
}

async function copyStyles() {
  let destinationStyles = path.join(__dirname, "project-dist", "style.css");
  let sourceStyles = path.join(__dirname, "styles");
  try {
    await fs.open(destinationStyles, "w", 0o666, (err) => {
      if (err) throw err;
      console.log("file created");
    });
    let writeStream = streams.createWriteStream(destinationStyles, "utf-8");
    const files = await fs.readdir(sourceStyles, "utf-8");
    files.forEach((file) => {
      streams.stat(path.join(sourceStyles, file), (err, stats) => {
        if (
          stats.isFile() &&
          path.parse(path.join(sourceStyles, file)).ext === ".css"
        ) {
          console.log(`File ${file} appended`);
          let readableStream = streams.createReadStream(
            path.join(sourceStyles, file),
            "utf-8"
          );
          readableStream.pipe(writeStream);
        } else console.log(`File ${file} rejected`);
      });
    });
  } catch (err) {
    console.log(`Error ${err}`);
  }
}

async function assembleHTML() {
  const file = streams.createReadStream(
    path.join(__dirname, "template.html"),
    "utf-8"
  );
  file.on("data", (template) => {
    index = template;
  });
  const componentFiles = await fs.readdir(sourceHTML);
  for (let file of componentFiles) {
    let filename = path.parse(path.join(sourceHTML, file)).name;
    let content = streams.createReadStream(
      path.join(sourceHTML, file),
      "utf-8"
    );
    let text = [];
    for await (const data of content) {
      text.push(data).toString();
    }
      components[filename] = text;
    };
  
  async function render() {
    for (let component in components) {
      let regexp = new RegExp(`{{${component}}}`);
      index = index.replace(regexp, components[component]);
    }
    const file = streams.createWriteStream(path.join(destination, "index.html"));
    file.write(index);
  }
  await render();
}

async function copyAssets() {
  let destinationAssets = path.join(destination, "assets");
  let sourceAssets = path.join(__dirname, "assets");
  mkdir(destinationAssets);
  copyDir(sourceAssets, destinationAssets);
  async function copyDir(sourceAssets, destinationAssets) {
    try {
      const files = await fs.readdir(sourceAssets);
      for (let file of files) {
        streams.stat(path.join(sourceAssets, file), (err, stats) => {
          if (stats.isDirectory()) {
            mkdir(path.join(destinationAssets, file));
            copyDir(
              path.join(sourceAssets, file),
              path.join(destinationAssets, file)
            );
          } else {
            copyFile(
              path.join(sourceAssets, file),
              path.join(destinationAssets, file)
            );
          }
        });
      }
      console.log("All files have been copied!");
    } catch (err) {
      console.log(err);
    }
  }
}

makeWebPage();
