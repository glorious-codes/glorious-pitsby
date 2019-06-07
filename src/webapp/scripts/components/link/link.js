import template from './link.html';

function controller(){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    setTarget($ctrl.target);
  };

  function setTarget(target = '_self'){
    $ctrl.target = target;
  }
}

export default {
  bindings: {
    href: '@',
    target: '@'
  },
  transclude: true,
  controller,
  template
};
