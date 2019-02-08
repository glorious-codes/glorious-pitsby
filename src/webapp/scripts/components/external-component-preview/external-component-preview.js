import jsonService from '../../../../cli/services/json';
import vueComponentBuilder from '@scripts/services/vue-component-builder';
import template from './external-component-preview.html';

function controller($scope, $element, angularComponentBuilder){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    const component = jsonService.parseFunctions($ctrl.example);
    return $ctrl.engine == 'angular' ?
      handleAngularComponent(component) :
      handleVueComponent(component);
  };

  function handleAngularComponent(component){
    const element = angularComponentBuilder.build(component, $scope);
    $element.find('div').append(element);
  }

  function handleVueComponent(component){
    vueComponentBuilder.build(component, $element.find('div')[0]);
  }
}

controller.$inject = ['$scope', '$element', 'angularComponentBuilder'];

export default {
  bindings: {
    example: '<',
    engine: '<'
  },
  controller,
  template
};
