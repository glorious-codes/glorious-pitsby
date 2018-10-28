import componentsResource from '@scripts/resources/components';
import template from './external-components-list.html';

function controller (){
  const $ctrl = this;

  $ctrl.fetch = () => {
    return componentsResource.get();
  };

  $ctrl.fetchSuccess = components => {
    setComponents(components);
  };

  function setComponents(components){
    $ctrl.components = components;
  }
}

export default {
  controller,
  template
};
