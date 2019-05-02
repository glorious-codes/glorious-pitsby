import '@styles/external-components-list.styl';
import componentsResource from '@scripts/resources/components';
import template from './external-components-list.html';

function controller (routeService){
  const $ctrl = this;

  $ctrl.fetch = () => {
    return componentsResource.get(routeService.getParams('engine'));
  };

  $ctrl.fetchSuccess = components => {
    setComponents(components);
    setFilteredComponents(components);
  };

  $ctrl.onExternalComponentsListItemClick = component => {
    goToExternalComponentDetailsView(routeService.getParams('engine'), component.id);
    if($ctrl.onListItemClick)
      $ctrl.onListItemClick(component);
  };

  $ctrl.isActiveListItem = component => {
    return routeService.getParams('componentId') === component.id;
  };

  $ctrl.onSearchTermChange = term => {
    setFilteredComponents(filterComponentsByTerm($ctrl.components, term));
  };

  function setComponents(components){
    $ctrl.components = components;
  }

  function filterComponentsByTerm(components, term){
    return !term ? components : components.filter(component => {
      return component.name.toLowerCase().includes(term.toLowerCase());
    });
  }

  function setFilteredComponents(components){
    $ctrl.filteredComponents = components;
  }

  function goToExternalComponentDetailsView(engine, componentId){
    routeService.go('app.external-components.component', { engine, componentId }, {
      resetUrlPath: true
    });
  }
}

controller.$inject = ['routeService'];

export default {
  bindings: {
    onListItemClick: '<',
  },
  controller,
  template
};
