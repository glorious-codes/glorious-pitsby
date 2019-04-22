import dataResource from '@scripts/resources/data';

const _public = {};
const BASE_URI = '/projects';

_public.get = () => {
  if(_public.projects)
    return Promise.resolve(_public.projects);
  return dataResource.get(BASE_URI).then(projects => {
    setProjects(projects);
    return projects;
  });
};

function setProjects(projects){
  _public.projects = projects;
}

export default _public;
