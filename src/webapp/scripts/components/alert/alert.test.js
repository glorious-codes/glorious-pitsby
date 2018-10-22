describe('Alert', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($componentController) => {
      compile = bindings => {
        return $componentController('pAlert', {}, bindings);
      };
    });
  });

  it('should render a default alert', () => {
    const component = compile();
    component.$onInit();
    expect(component.themeCssClass).toEqual('');
  });

  it('should render a themed alert', () => {
    const component = compile({alert: {theme: 'danger'}});
    component.$onInit();
    expect(component.themeCssClass).toEqual('p-alert-danger');
  });

  it('should retry some action if alert retry action has been passed', () => {
    const alert = {retryAction: jest.fn()};
    const component = compile({alert});
    component.retry();
    expect(alert.retryAction).toHaveBeenCalled();
  });

  it('should not retry some action if alert retry action has not been passed', () => {
    const alert = {retryAction: jest.fn()};
    const component = compile();
    component.retry();
    expect(alert.retryAction).not.toHaveBeenCalled();
  });
});
