import '@styles/viewport.styl';
import template from './viewport.html';

function controller(engineRedirectionService){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    engineRedirectionService.init();
  };
}

controller.$inject = ['engineRedirectionService'];

export default {
  transclude: true,
  controller,
  template
};
