const { mkdir } = require("node:fs/promises");
const path = require("path");
const { copyFile, constants } = require("node:fs/promises");
const fs = require("fs/promises");

let sourceFolderName = "files";
let destination = path.join(__dirname, `${sourceFolderName}-copy`);
let source = path.join(__dirname, `${sourceFolderName}`);

async function copyDir() {
  try {
    await fs.rm(destination, { recursive: true, force: true });
    await mkdir(destination, { recursive: true });
    const files = await fs.readdir(source, "utf-8");

    for (let file of files) {
      let fileSrc = path.join(source, file);
      let fileDest = path.join(destination, file);
      copyFile(fileSrc, fileDest);
    }
    console.log("All files have been copied!");
  } catch (err) {
    console.log(err);
  }
}

copyDir();
