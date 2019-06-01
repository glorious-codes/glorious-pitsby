describe('Input', () => {
  let compile, $timeout;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile, _$timeout_) => {
      $timeout = _$timeout_;
      compile = (bindings = {}) => {
        const scope = $rootScope.$new(true);
        const template = `<p-input
                            data-value="$ctrl.value"
                            data-placeholder="{{ $ctrl.placeholder }}"
                            on-change="$ctrl.onChange"
                            on-blur="$ctrl.onBlur" />`;
        scope.$ctrl = bindings;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('span').hasClass('p-input-wrapper')).toEqual(true);
    expect(element.find('input').hasClass('p-input')).toEqual(true);
  });

  it('should optionally accept a placeholder', () => {
    const placeholder = 'hello';
    const element = compile({ placeholder });
    expect(element.find('input').attr('placeholder')).toEqual(placeholder);
  });

  it('should execute change callback on change if callback has been given', () => {
    const onChange = jest.fn();
    const element = compile({ onChange });
    element.find('input').triggerHandler('change');
    $timeout.flush();
    expect(onChange).toHaveBeenCalled();
  });

  it('should not execute change callback on change if callback has not been given', () => {
    const onChange = jest.fn();
    const element = compile();
    element.find('input').triggerHandler('change');
    $timeout.flush();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should execute blur callback on blur if callback has been given', () => {
    const onBlur = jest.fn();
    const element = compile({ onBlur });
    element.find('input').triggerHandler('blur');
    $timeout.flush();
    expect(onBlur).toHaveBeenCalled();
  });

  it('should not execute blur callback on blur if callback has not been given', () => {
    const onBlur = jest.fn();
    const element = compile();
    element.find('input').triggerHandler('change');
    $timeout.flush();
    expect(onBlur).not.toHaveBeenCalled();
  });
});
