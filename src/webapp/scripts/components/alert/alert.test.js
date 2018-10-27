describe('Alert', () => {
  let instantiateController;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($componentController) => {
      instantiateController = bindings => {
        return $componentController('pAlert', {}, bindings);
      };
    });
  });

  it('should render a default alert', () => {
    const component = instantiateController();
    component.$onInit();
    expect(component.themeCssClass).toEqual('');
  });

  it('should render a themed alert', () => {
    const component = instantiateController({alert: {theme: 'danger'}});
    component.$onInit();
    expect(component.themeCssClass).toEqual('p-alert-danger');
  });

  it('should update alert on change', () => {
    const alert = {};
    const component = instantiateController({alert});
    component.$onInit();
    alert.theme = 'danger';
    component.$onChanges();
    expect(component.themeCssClass).toEqual('p-alert-danger');
  });

  it('should retry some action if alert retry action has been passed', () => {
    const alert = {retryAction: jest.fn()};
    const component = instantiateController({alert});
    component.retry();
    expect(alert.retryAction).toHaveBeenCalled();
  });

  it('should not retry some action if alert retry action has not been passed', () => {
    const alert = {retryAction: jest.fn()};
    const component = instantiateController();
    component.retry();
    expect(alert.retryAction).not.toHaveBeenCalled();
  });
});
