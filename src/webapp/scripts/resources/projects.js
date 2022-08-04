import externalGlobalDataService from '@scripts/services/external-global-data';

const _public = {};

_public.get = () => {
  return new Promise((resolve, reject) => {
    const projects = getProjects();
    return projects ? resolve(projects) : reject('Projects have not been found');
  });
};

function getProjects(){
  const data = externalGlobalDataService.get();
  return data && data.projects;
}

export default _public;
