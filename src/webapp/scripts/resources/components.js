import dataResource from '@scripts/resources/data';

const _public = {};
const BASE_URI = '/components';

_public.get = (engine, id) => {
  return dataResource.get(`${BASE_URI}-${engine}`).then(components => {
    return id ? findComponent(components, id) : sortComponentsByAscendingName(components);
  });
};

function sortComponentsByAscendingName(components){
  return components.sort((component, adjacentComponent) => {
    return component.name < adjacentComponent.name ? -1 : 1;
  });
}

function findComponent(components, id){
  return components.filter(component => {
    return component.id === id;
  })[0];
}

export default _public;
