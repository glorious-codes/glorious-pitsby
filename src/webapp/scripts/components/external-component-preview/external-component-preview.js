import jsonService from '../../../../cli/services/json';
import template from './external-component-preview.html';

function controller($scope, $compile, $controller, $injector, $element){
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
    scope.$ctrl = example.controller ? instantiateController(example) : {};
    return scope;
  }

  function instantiateController(example){
    const dependencies = getDependencies(example.dependencies);
    return $controller(example.controller, dependencies);
  }

  function getDependencies(dependencies = []){
    return dependencies.map(dependency => {
      return $injector.get(dependency);
    });
  }
}

controller.$inject = ['$scope', '$compile', '$controller', '$injector', '$element'];

export default {
  bindings: {
    example: '<'
  },
  controller,
  template
};
