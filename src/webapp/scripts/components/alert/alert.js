import '@styles/alert.styl';
import controller from './alert-controller';
import template from './alert.html';

export default {
  bindings: {
    theme: '@'
  },
  controller,
  template
};
