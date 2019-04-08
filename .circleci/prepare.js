const fs = require('fs');
const path = require('path');
const externalMetricsIdsModuleGenerator = require('../src/cli/services/external-metrics-ids-module-generator');
const webappHtmlIndexGenerator = require('../src/cli/services/webapp-html-index-generator');
const webappIndexGenerator = require('../src/cli/services/webapp-index-generator');

function createDirectory(directoryPath){
  fs.mkdirSync(path.join(__dirname, directoryPath));
}

createDirectory('../src/webapp/data/');
createDirectory('../src/webapp/external/');

externalMetricsIdsModuleGenerator.init();
webappHtmlIndexGenerator.init();
webappIndexGenerator.init();
