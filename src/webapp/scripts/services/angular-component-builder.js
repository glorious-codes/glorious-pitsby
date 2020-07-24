import angular from 'angular';

function angularComponentBuilder($compile, $controller, $injector, $timeout){
  const _public = {};

  _public.build = ({ template, controller, dependencies }, $scope) => {
    const element = buildElement(template);
    const scope = buildScope($scope, controller, dependencies);
    $compile(element)(scope);
    handleHooks(scope, !usesOnInitHookManually(controller));
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

  function handleHooks(scope, shouldCallOnInitHookAutomatically){
    if(shouldCallOnInitHookAutomatically)
      $timeout(() => callHook(scope.$ctrl.$onInit));
    scope.$on('$destroy', () => callHook(scope.$ctrl.$onDestroy));
  }

  function usesOnInitHookManually(controller){
    const stringifiedController = stringifyController(controller);
    if(stringifiedController)
      return stringifiedController.includes('$onInit(') ||
             stringifiedController.includes('$timeout($ctrl.$onInit');
  }

  function stringifyController(controller){
    if(typeof controller == 'function')
      return controller.toString();
  }

  function callHook(hook){
    return hook && hook();
  }

  return _public;
}

angularComponentBuilder.$inject = ['$compile', '$controller', '$injector', '$timeout'];

export default angularComponentBuilder;
