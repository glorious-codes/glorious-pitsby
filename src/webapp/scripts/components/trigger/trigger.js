import '@styles/trigger.styl';
import template from './trigger.html';

function controller(){
  const $ctrl = this;

  $ctrl.click = () => $ctrl.onClick && $ctrl.onClick();
}

export default {
  bindings: {
    iconName: '@',
    ariaLabel: '@',
    onClick: '<'
  },
  controller,
  template
};
