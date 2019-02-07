import '@styles/welcome.styl';
import template from './welcome.html';

function controller(routeService){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    setEngine(routeService.getParams('engine'));
  };

  function setEngine(engine){
    $ctrl.engine = engine;
  }
}

controller.$inject = ['routeService'];

export default {
  template,
  controller
};
