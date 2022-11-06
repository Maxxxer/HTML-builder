const { mkdir } = require('node:fs/promises');
const path = require('path');
const { copyFile, constants } = require('node:fs')

async function makeDir(){
  const projectFolder = path.join(__dirname, 'new-folder');
  const createDir = await mkdir(projectFolder, { recursive: true });
  return createDir;
} 

function callback(err) {
  if (err) throw err;
  console.log('hi')
}




makeDir().catch(console.error)