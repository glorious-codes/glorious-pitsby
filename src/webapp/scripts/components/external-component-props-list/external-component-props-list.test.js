describe('External Component Props List', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = (bindings = {}) => {
        const template = `<p-external-component-props-list
                            data-title="{{ $ctrl.title }}">
                            ${ bindings.content }
                          </p-external-component-props-list>`;
        scope.$ctrl = bindings;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class')).toEqual('p-external-component-props-list');
  });

  it('should render a heading', () => {
    const element = compile({ title: 'Attributes' });
    expect(element.find('h3').text()).toEqual('Attributes');
  });

  it('should transclude some content', () => {
    const element = compile({ content: '<p>Hello!</p>' });
    expect(element.find('p').text()).toEqual('Hello!');
  });
});
