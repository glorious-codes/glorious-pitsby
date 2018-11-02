describe('Heading', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = (bindings = {}) => {
        const template = `<p-heading
                            data-size="{{ size }}"
                            data-text="{{ text }}">
                          </p-heading>`;
        scope.size = bindings.size;
        scope.text = bindings.text;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').hasClass('p-heading')).toEqual(true);
  });

  it('should render a default heading', () => {
    const text = 'Hello!';
    const element = compile({text});
    expect(element.find('h1').text()).toEqual(text);
  });

  it('should render a heading with custom size', () => {
    const text = 'Hello2!';
    const element = compile({text, size: '3'});
    expect(element.find('h3').text()).toEqual(text);
  });

  it('should render a default heading if passed size is not valid', () => {
    const text = 'Hello3!';
    const element = compile({text, size: '7'});
    expect(element.find('h1').text()).toEqual(text);
  });
});
