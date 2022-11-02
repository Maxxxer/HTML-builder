const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const readStream = fs.createReadStream(path.join(__dirname, 'text.txt'));

readStream.on('data', (file) => {
  console.log(file.toString())
});