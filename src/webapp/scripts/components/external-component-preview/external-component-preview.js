import jsonService from '../../../../cli/services/json';
import template from './external-component-preview.html';

function controller($scope, $compile, $element){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    const component = buildExternalComponent($ctrl.example);
    $element.find('div').append(component);
  };

  function buildExternalComponent(example = {}){
    const element = buildExternalElement(example.template);
    const scope = buildExternalScope(example);
    return $compile(element)(scope);
  }

  function buildExternalElement(template){
    return angular.element(template);
  }

  function buildExternalScope(example){
    const scope = $scope.$new(true);
    example = jsonService.parseFunctions(example);
    scope.$ctrl = example.controller ? new example.controller() : {};
    return scope;
  }
}

controller.$inject = ['$scope', '$compile', '$element'];

export default {
  bindings: {
    example: '<'
  },
  controller,
  template
};
