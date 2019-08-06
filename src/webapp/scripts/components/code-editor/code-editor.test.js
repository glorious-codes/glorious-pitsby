describe('Code Editor', () => {
  let compile, $timeout;

  function getEditorInstance(element){
    return element.isolateScope().$ctrl.editor;
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile, _$timeout_) => {
      $timeout = _$timeout_;
      compile = (bindings = {}) => {
        const scope = $rootScope.$new(true);
        const template = `<p-code-editor
                            data-code="$ctrl.code"
                            data-mode="{{ $ctrl.mode }}"
                            data-on-change="$ctrl.onChange" />`;
        scope.$ctrl = bindings;
        const element = $compile(template)(scope);
        scope.$digest();
        $timeout.flush();
        return element;
      };
    });
    console.warn = jest.fn();
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').hasClass('p-code-editor')).toEqual(true);
  });

  it('should listen for changes on initialization', () => {
    const element = compile();
    const controller = element.isolateScope().$ctrl;
    const session = controller.editor.getSession();
    session.on = jest.fn();
    controller.$onInit();
    $timeout.flush();
    expect(session.on).toHaveBeenCalledWith('change', controller.handleChange);
  });

  it('should show no code by default', () => {
    const element = compile();
    expect(getEditorInstance(element).getSession().getValue()).toEqual('');
  });

  it('should optionally set an initial code', () => {
    const code = 'const a = 1;';
    const element = compile({ code });
    expect(getEditorInstance(element).getSession().getValue()).toEqual(code);
  });

  it('should optionally set a mode', () => {
    const mode = 'javascript';
    const element = compile({ mode });
    expect(getEditorInstance(element).getSession().getMode().$id).toEqual('ace/mode/javascript');
  });

  it('should execute change callback when code changes if callback has been given', () => {
    const onChange = jest.fn();
    const value = 'const a = 3;';
    const element = compile({ onChange });
    const editorSession = getEditorInstance(element).getSession();
    editorSession.setValue(value);
    element.isolateScope().$ctrl.handleChange();
    expect(onChange).toHaveBeenCalledWith(value);
  });

  it('should not execute change callback when code changes if no callback has been given', () => {
    const onChange = jest.fn();
    const element = compile({ onChange });
    delete element.isolateScope().$ctrl.onChange;
    element.isolateScope().$ctrl.handleChange();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should destroy editor on component destroy', () => {
    const element = compile();
    element.isolateScope().$ctrl.editor.destroy = jest.fn();
    element.isolateScope().$ctrl.$onDestroy();
    expect(element.isolateScope().$ctrl.editor.destroy).toHaveBeenCalled();
    expect(element.html().trim()).toEqual('');
  });
});
