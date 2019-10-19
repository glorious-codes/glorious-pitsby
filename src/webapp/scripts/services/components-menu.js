import routes from '@scripts/constants/routes';
import componentsResource from '@scripts/resources/components';

const _public = {};

_public.build = engine => {
  return componentsResource.get(engine).then(components => {
    return buildMenuItems(engine, components);
  });
};

_public.configItemsVisibilityByTerm = (items, term = '') => {
  return configItemsVisibility(items, term);
};

_public.getVisibleItems = (items, visibleItems = []) => {
  items.forEach(item => {
    const { children } = item;
    if(children)
      setParentItemVisibility(item, _public.getVisibleItems(children, visibleItems));
    else if(item.isVisible)
      visibleItems.push(item);
  });
  return visibleItems;
};

function setParentItemVisibility(parentItem, visibleChildren){
  parentItem.isVisible = visibleChildren.length > 0;
}

function configItemsVisibility(items, term){
  items.forEach(item => {
    if(item.children)
      configItemsVisibility(item.children, term);
    else
      item.isVisible = item.name.toLowerCase().includes(term.toLowerCase());
  });
  return items;
}

function buildMenuItems(engine, components){
  return [
    {
      id: 'components',
      name: 'Components',
      children: buildComponentsSubitems(engine, components),
      isVisible: true
    },
    {
      id: 'playground',
      name: 'Playground',
      route: { name: routes[3].name, params: { engine } },
      isVisible: true
    }
  ];
}

function buildComponentsSubitems(engine, components) {
  return components.map(component => {
    component.route = {
      name: routes[2].name,
      params: { engine, componentId: component.id }
    };
    component.isVisible = true;
    return component;
  });
}

export default _public;
