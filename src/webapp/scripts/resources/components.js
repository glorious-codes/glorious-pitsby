import dataResource from '@scripts/resources/data';

const _public = {};
const BASE_URI = '/components';

_public.get = id => {
  return dataResource.get(BASE_URI).then(components => {
    return id ? findComponent(components, id) : components;
  });
};

function findComponent(components, id){
  return components.filter(component => {
    return component.id === id;
  })[0];
}

export default _public;
