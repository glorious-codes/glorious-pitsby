import angular from 'angular';

function angularComponentBuilder($compile, $controller, $injector){
  const _public = {};

  _public.build = ({ template, controller, dependencies }, $scope) => {
    const element = buildElement(template);
    const scope = buildScope($scope, controller, dependencies);
    $compile(element)(scope);
    return element;
  };

  function buildElement(template){
    return angular.element(template);
  }

  function buildScope($scope, controller, dependencies){
    const scope = $scope.$new(true);
    scope.$ctrl = controller ? instantiateController(controller, dependencies) : {};
    return scope;
  }

  function instantiateController(controller, dependencies){
    return $controller(controller, getDependencies(dependencies));
  }

  function getDependencies(dependencies = []){
    return dependencies.map(dependency => {
      return $injector.get(dependency);
    });
  }

  return _public;
}

angularComponentBuilder.$inject = ['$compile', '$controller', '$injector'];

export default angularComponentBuilder;
