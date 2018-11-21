const fs = require('fs');
const path = require('path');
const webappHtmlIndexGenerator = require('../src/cli/services/webapp-html-index-generator');
const webappIndexGenerator = require('../src/cli/services/webapp-index-generator');

function createDirectory(directoryPath){
  fs.mkdirSync(path.join(__dirname, directoryPath));
}

webappHtmlIndexGenerator.init();
webappIndexGenerator.init();
createDirectory('../src/webapp/data/');
createDirectory('../src/webapp/external/');
