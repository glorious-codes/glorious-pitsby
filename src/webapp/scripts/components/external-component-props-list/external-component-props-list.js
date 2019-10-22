import '@styles/external-component-props-list.styl';
import template from './external-component-props-list.html';

export default {
  transclude: true,
  bindings: {
    title: '@'
  },
  template
};
