describe('Tag', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      compile = (bindings = {}, content = '') => {
        const scope = $rootScope.$new(true);
        const template = `<p-tag data-theme="{{ $ctrl.theme }}">
                            ${content}
                          </p-tag>`;
        scope.$ctrl = bindings;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('span').hasClass('p-tag')).toEqual(true);
  });

  it('should render a info themed tag', () => {
    const element = compile({ theme: 'info' });
    expect(element.find('span').hasClass('p-tag-info')).toEqual(true);
  });

  it('should render a success themed tag', () => {
    const element = compile({ theme: 'success' });
    expect(element.find('span').hasClass('p-tag-success')).toEqual(true);
  });

  it('should render a danger themed tag', () => {
    const element = compile({ theme: 'danger' });
    expect(element.find('span').hasClass('p-tag-danger')).toEqual(true);
  });

  it('should transclude some content', () => {
    const element = compile({}, '<p>Hello!</p>');
    expect(element.find('p').text().trim()).toEqual('Hello!');
  });
});
