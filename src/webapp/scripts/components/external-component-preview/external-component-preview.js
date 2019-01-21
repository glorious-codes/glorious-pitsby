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
    const scope = buildExternalScope(example.data);
    return $compile(element)(scope);
  }

  function buildExternalElement(template){
    return angular.element(template);
  }

  function buildExternalScope(data = {}){
    const scope = $scope.$new(true);
    scope.$ctrl = jsonService.parseFunctions(data);
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
