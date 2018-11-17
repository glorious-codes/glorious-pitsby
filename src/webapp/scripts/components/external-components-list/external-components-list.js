import '@styles/external-components-list.styl';
import componentsResource from '@scripts/resources/components';
import template from './external-components-list.html';

function controller (routeService){
  const $ctrl = this;

  $ctrl.fetch = () => {
    return componentsResource.get();
  };

  $ctrl.fetchSuccess = components => {
    setComponents(components);
  };

  $ctrl.onExternalComponentsListItemClick = component => {
    routeService.go('externalComponents.component', {
      componentId: component.id
    });
  };

  $ctrl.isActiveListItem = component => {
    return routeService.getParams('componentId') === component.id;
  };

  function setComponents(components){
    $ctrl.components = components;
  }
}

controller.$inject = ['routeService'];

export default {
  controller,
  template
};
