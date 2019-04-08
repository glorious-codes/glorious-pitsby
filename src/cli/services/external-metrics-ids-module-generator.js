const webappDataService = require('./webapp-data');

const _public = {};

_public.init = metricsIds => {
  return new Promise((resolve, reject) => {
    webappDataService.save('metrics-ids.js', buildFileData(metricsIds), resolve, reject);
  });
};

function buildFileData(metricsIds = {}){
  return `module.exports = {
  get(){
    return ${JSON.stringify(metricsIds)};
  }
};`;
}

module.exports = _public;
