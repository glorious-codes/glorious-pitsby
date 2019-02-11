describe('Angular Component Builder', () => {
  let service, $scope, $window;

  function compileComponent(component, scope){
    const element = service.build(component, scope);
    scope.$digest();
    return element;
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $injector) => {
      $scope = $rootScope.$new(true);
      $window = $injector.get('$window');
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
});
