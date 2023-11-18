import testingService from '@scripts/services/testing';

describe('Code Editor', () => {
  let compile, $timeout;

  function getEditorInstance(element){
    return element.isolateScope().$ctrl.editor;
  }

  async function mount(props){
    const element = compile(props);
    await testingService.pause(10);
    $timeout.flush();
    return element;
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

  it('should have appropriate css class', async () => {
    const element = await mount();
    expect(element.find('div').hasClass('p-code-editor')).toEqual(true);
  });

  it('should listen for changes on editor config', async () => {
    const element = await mount();
    const controller = element.isolateScope().$ctrl;
    const session = controller.editor.getSession();
    session.on = jest.fn();
    controller.configEditor();
    expect(session.on).toHaveBeenCalledWith('change', controller.handleChange);
  });

  it('should show no code by default', async () => {
    const element = await mount();
    expect(getEditorInstance(element).getSession().getValue()).toEqual('');
  });

  it('should optionally set an initial code', async () => {
    const code = 'const a = 1;';
    const element = await mount({ code });
    expect(getEditorInstance(element).getSession().getValue()).toEqual(code);
  });

  it('should optionally set a mode', async () => {
    const mode = 'javascript';
    const element = await mount({ mode });
    expect(getEditorInstance(element).getSession().getMode().$id).toEqual('ace/mode/javascript');
  });

  it('should execute change callback when code changes if callback has been given', async () => {
    const onChange = jest.fn();
    const value = 'const a = 3;';
    const element = await mount({ onChange });
    const editorSession = getEditorInstance(element).getSession();
    editorSession.setValue(value);
    element.isolateScope().$ctrl.handleChange();
    expect(onChange).toHaveBeenCalledWith(value);
  });

  it('should destroy editor on component destroy', async () => {
    const element = await mount();
    element.isolateScope().$ctrl.editor.destroy = jest.fn();
    element.isolateScope().$ctrl.$onDestroy();
    const editorContainerEl = element[0].querySelector('[data-code-editor]');
    expect(element.isolateScope().$ctrl.editor.destroy).toHaveBeenCalled();
    expect(editorContainerEl).toEqual(null);
  });
});
