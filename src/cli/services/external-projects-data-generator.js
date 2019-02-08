const webappDataService = require('./webapp-data');

const _public = {};

_public.init = projects => {
  return new Promise(resolve => {
    webappDataService.save('projects', buildData(projects));
    resolve();
  });
};

function buildData(projects = []){
  return projects.map(project => {
    return { engine: project.engine };
  });
}

module.exports = _public;
