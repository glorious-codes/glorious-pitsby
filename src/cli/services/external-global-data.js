const path = require('path');

const _public = {};

_public.build = ({ metrics = {}, projects = [], custom }) => {
  return {
    metrics,
    projects: projects.map(({ engine }) => ({ engine })),
    custom: parseCustomData(custom),
    fingerprint: Date.now()
  };
};

function parseCustomData(custom){
  return custom && custom.logo ? {
    ...custom,
    logo: {
      ...custom.logo,
      filepath: path.join('/external', custom.logo.filepath)
    }
  } : { logo: {} };
}

module.exports = _public;
