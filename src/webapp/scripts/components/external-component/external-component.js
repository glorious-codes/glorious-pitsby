import '@styles/external-component.styl';
import componentsResource from '@scripts/resources/components';
import template from './external-component.html';

function controller(routeService) {
  const $ctrl = this;

  $ctrl.fetch = () => {
    return componentsResource.get(routeService.getParams('componentId'));
  };

  $ctrl.fetchSuccess = component => {
    setComponent(component);
  };

  function setComponent(component){
    $ctrl.component = component;
  }
}

controller.$inject = ['routeService'];

export default {
  controller,
  template
};
