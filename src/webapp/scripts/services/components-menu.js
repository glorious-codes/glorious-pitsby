import routes from '@scripts/constants/routes';
import componentsResource from '@scripts/resources/components';

const _public = {};

_public.build = engine => {
  return componentsResource.get(engine).then(components => {
    return buildMenuItems(engine, components);
  });
};

_public.filter = (items, term) => {
  return items.filter(item => {
    return item.children ?
      filterSubitems(item, term) :
      item.name.toLowerCase().includes(term);
  });
};

function filterSubitems(item, term){
  const subitems = _public.filter(item.children, term);
  if(subitems.length){
    item.children = subitems;
    return true;
  }
}

function buildMenuItems(engine, components){
  return [
    {
      id: 'components',
      name: 'Components',
      children: buildComponentsSubitems(engine, components)
    },
    {
      id: 'playground',
      name: 'Playground',
      route: { name: routes[3].name, params: { engine } }
    }
  ];
}

function buildComponentsSubitems(engine, components) {
  return components.map(component => {
    component.route = {
      name: routes[2].name,
      params: { engine, componentId: component.id }
    };
    return component;
  });
}

export default _public;
