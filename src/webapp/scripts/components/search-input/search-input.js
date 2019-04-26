import '@styles/search-input.styl';
import template from './search-input.html';

function controller (){
  const $ctrl = this;

  $ctrl.dispatch = () => {
    $ctrl.onChange($ctrl.term);
  };
}

export default {
  bindings: {
    onChange: '='
  },
  controller,
  template
};
