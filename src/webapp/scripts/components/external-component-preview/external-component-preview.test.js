describe('External Component Preview', () => {
  let compile, $window;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile, $injector) => {
      const scope = $rootScope.$new(true);
      $window = $injector.get('$window');
      compile = (bindings = {}) => {
        const template = `<p-external-component-preview
                            data-example="example">
                          </p-external-component-preview>`;
        scope.example = bindings.example;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class')).toEqual('p-external-component-preview');
  });

  it('should render an example if example has been given', () => {
    const example = {
      controller: `function() {
        const $ctrl = this;
        $ctrl.text = 'Hello!';
      }`,
      template: `
        <p ng-bind="$ctrl.text"></p>
      `
    };
    const element = compile({example});
    expect(element.find('p').text()).toEqual('Hello!');
  });

  it('should parse stringified functions in example', () => {
    console.log = jest.fn();
    const example = {
      controller: `function() {
        const $ctrl = this;
        $ctrl.greet = name => console.log(name);
      }`,
      template: `
        <button ng-click="$ctrl.greet('Rafael')">
          Greet
        </button>
      `
    };
    const element = compile({ example });
    expect(typeof example.controller).toEqual('function');
    expect(element.find('button').triggerHandler('click'));
    expect(console.log).toHaveBeenCalledWith('Rafael');
  });

  it('should handle controller dependencies', () => {
    $window.alert = jest.fn();
    const example = {
      controller: `function($window) {
        const $ctrl = this;
        $ctrl.greet = name => $window.alert(name);
      }`,
      dependencies: ['$window'],
      template: `
        <button ng-click="$ctrl.greet('Rafael')">
          Greet
        </button>
      `
    };
    const element = compile({ example });
    expect(typeof example.controller).toEqual('function');
    expect(element.find('button').triggerHandler('click'));
    expect($window.alert).toHaveBeenCalledWith('Rafael');
  });

  it('should not render an example if no example has been given', () => {
    const element = compile();
    const children = element.find('div')[0].children;
    expect(children.length).toEqual(0);
  });
});
