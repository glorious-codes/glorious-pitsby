import codeEditorService from '@scripts/services/code-editor';
import template from './code-editor.html';

function controller($timeout, $element){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    codeEditorService.load().then(ace => {
      $timeout(() => {
        setEditor(ace.edit(getEditorHostElement()));
        $ctrl.configEditor();
      });
    });
  };

  $ctrl.handleChange = () => {
    $ctrl.onChange && $ctrl.onChange(getSession().getValue());
  };

  $ctrl.configEditor = () => {
    setEditorMode(buildModePath($ctrl.mode));
    setEditorOptions({ tabSize: 2 });
    setEditorCode($ctrl.code);
    listenChanges();
  };

  $ctrl.$onDestroy = () => {
    if($ctrl.editor) {
      $ctrl.editor.destroy();
      $ctrl.editor.container.remove();
    }
  };

  function getEditorHostElement(){
    return $element[0].querySelector('[data-code-editor]');
  }

  function setEditor(editor){
    $ctrl.editor = editor;
    $ctrl.editor.$blockScrolling = Infinity;
  }

  function buildModePath(mode){
    return `ace/mode/${mode}`;
  }

  function setEditorCode(code){
    const value = code || '';
    getSession().setValue(value);
  }

  function setEditorMode(modePath){
    getSession().setMode(modePath);
  }

  function setEditorOptions(options){
    $ctrl.editor.setOptions(options);
  }

  function listenChanges(){
    const session = getSession();
    session.on('change', $ctrl.handleChange);
  }

  function getSession(){
    return $ctrl.editor && $ctrl.editor.getSession();
  }
}

controller.$inject = ['$timeout', '$element'];

export default {
  bindings: {
    code: '<',
    mode: '@',
    onChange: '='
  },
  controller,
  template
};
