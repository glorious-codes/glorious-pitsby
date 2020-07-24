describe('Angular Component Builder', () => {
  let service, $scope, $window, $timeout;

  function compileComponent(component, scope){
    const element = service.build(component, scope);
    scope.$digest();
    return element;
  }

  function buildComponent(controller, dependencies){
    return { controller, template: '<div></div>', dependencies };
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $injector) => {
      $scope = $rootScope.$new(true);
      $window = $injector.get('$window');
      $timeout = $injector.get('$timeout');
      service = $injector.get('angularComponentBuilder');
    });
  });

  it('should render a component with no controller', () => {
    const component = {
      template: '<p>No Component</p>'
    };
    const element = compileComponent(component, $scope);
    expect(element.text()).toEqual('No Component');
  });

  it('should render a component containing a controller', () => {
    const component = {
      controller: function() {
        const $ctrl = this;
        $ctrl.text = 'Hello!';
      },
      template: '<p ng-bind="$ctrl.text"></p>'
    };
    const element = compileComponent(component, $scope);
    expect(element.text()).toEqual('Hello!');
  });

  it('should handle controller dependencies', () => {
    $window.alert = jest.fn();
    const component = {
      controller: function($window) {
        const $ctrl = this;
        $ctrl.greet = name => $window.alert(name);
      },
      dependencies: ['$window'],
      template: `
        <button ng-click="$ctrl.greet('Rafael')">
          Greet
        </button>
      `
    };
    const element = compileComponent(component, $scope);
    expect(element.triggerHandler('click'));
    expect($window.alert).toHaveBeenCalledWith('Rafael');
  });

  it('should execute initialization hook if controller uses it', () => {
    window.alert = jest.fn();
    const component = buildComponent(function(){
      const $ctrl = this;
      $ctrl.$onInit = () => window.alert();
    });
    compileComponent(component, $scope);
    $timeout.flush();
    expect(window.alert.mock.calls.length).toEqual(1);
  });

  it('should not execute initialization hook if controller does not use it', () => {
    window.alert = jest.fn();
    const component = buildComponent(function(){
      const $ctrl = this;
      $ctrl.onInit = () => window.alert();
    });
    compileComponent(component, $scope);
    $timeout.flush();
    expect(window.alert.mock.calls.length).toEqual(0);
  });

  it('should not execute initialization automatically hook if controller calls it manually', () => {
    window.alert = jest.fn();
    const component = buildComponent(function(){
      const $ctrl = this;
      $ctrl.$onInit = () => window.alert();
      $ctrl.$onInit();
    });
    compileComponent(component, $scope);
    expect(window.alert.mock.calls.length).toEqual(1);
  });

  it('should not execute initialization automatically hook if controller calls it manually inside $timeout', () => {
    window.alert = jest.fn();
    const component = buildComponent(function($timeout){
      const $ctrl = this;
      $ctrl.$onInit = () => window.alert();
      $timeout($ctrl.$onInit);
    }, ['$timeout']);
    compileComponent(component, $scope);
    $timeout.flush();
    expect(window.alert.mock.calls.length).toEqual(1);
  });

  it('should execute destruction hook if controller uses it', () => {
    window.alert = jest.fn();
    const component = buildComponent(function(){
      const $ctrl = this;
      $ctrl.$onDestroy = () => window.alert();
    });
    compileComponent(component, $scope);
    $scope.$destroy();
    expect(window.alert.mock.calls.length).toEqual(1);
  });
});
