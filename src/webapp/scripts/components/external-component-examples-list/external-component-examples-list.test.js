import vueComponentBuilder from '@scripts/services/vue-component-builder';
vueComponentBuilder.build = jest.fn();

describe('External Component Example List', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = (bindings = {}) => {
        const template = `<p-external-component-examples-list
                            data-examples="$ctrl.examples"
                            data-engine="$ctrl.engine">
                          </p-external-component-examples-list>`;
        scope.$ctrl = bindings;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class')).toEqual('p-external-component-examples-list');
  });

  it('should bind examples', () => {
    const examplesMock = [{some: 'example', template: ''}, {other: 'example', template: ''}];
    const element = compile({examples: examplesMock});
    expect(element.isolateScope().$ctrl.examples).toEqual(examplesMock);
  });

  it('should bind engine', () => {
    const element = compile({engine: 'vue'});
    expect(element.isolateScope().$ctrl.engine).toEqual('vue');
  });
});
