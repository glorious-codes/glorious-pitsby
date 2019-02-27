const webappDataService = require('./webapp-data');

const _public = {};

_public.init = projects => {
  return new Promise((resolve, reject) => {
    webappDataService.save('projects', buildData(projects), resolve, reject);
  });
};

function buildData(projects = []){
  return projects.map(project => {
    return { engine: project.engine };
  });
}

module.exports = _public;
