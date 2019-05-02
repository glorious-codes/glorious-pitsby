import '@styles/trigger.styl';
import template from './trigger.html';

function controller(){
  const $ctrl = this;

  $ctrl.click = () => {
    const onClick = $ctrl.onClick;
    if(onClick)
      onClick();
  };
}

export default {
  bindings: {
    onClick: '<'
  },
  controller,
  template
};
