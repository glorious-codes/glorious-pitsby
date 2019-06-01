import '@styles/input.styl';
import template from './input.html';

function controller($timeout){
  const $ctrl = this;

  $ctrl.onInputChange = () => {
    handleListener($ctrl.onChange);
  };

  $ctrl.onInputBlur = () => {
    handleListener($ctrl.onBlur);
  };

  function handleListener(listener){
    if(listener)
      $timeout(listener);
  }
}

controller.$inject = ['$timeout'];

export default {
  controller,
  bindings: {
    value: '=',
    placeholder: '@',
    onChange: '=',
    onBlur: '=',
  },
  template
};
