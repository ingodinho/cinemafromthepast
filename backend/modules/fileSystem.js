const fs = require('fs');


const readJSON = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err,data) => {
      if(err) reject(err);
      else resolve(JSON.parse(data));
    })
  })
}

const writeJSON = (path,data) => {
  const dataJson = JSON.stringify(data, null, 2);
  return new Promise((resolve, reject) => {
    fs.writeFile(path, dataJson, (err) => {
      if(err) reject(err);
      else resolve(dataJson);
    })
  })
}

module.exports = {
  readJSON,
  writeJSON
}