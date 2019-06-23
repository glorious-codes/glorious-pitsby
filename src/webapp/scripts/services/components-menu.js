import routes from '@scripts/constants/routes';
import componentsResource from '@scripts/resources/components';

const _public = {};

_public.build = engine => {
  return componentsResource.get(engine).then(components => {
    return buildMenuStructure(engine, components);
  });
};

function buildMenuStructure(engine, components){
  return [
    {
      id: 'components',
      name: 'Components',
      children: buildComponentsSubitems(engine, components)
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
