import '@styles/tab.styl';
import template from './tab.html';

function controller(){
  const $ctrl = this;

  $ctrl.select = () => {
    if($ctrl.onSelect)
      $ctrl.onSelect();
  };
}

export default {
  transclude: true,
  bindings: {
    name: '@',
    onSelect: '='
  },
  controller,
  template
};
