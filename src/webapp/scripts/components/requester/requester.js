import controller from './requester-controller';
import template from './requester.html';

export default {
  transclude: true,
  bindings: {
    alertErrorMessage: '@',
    fetch: '=',
    fetchSuccess: '=',
    shouldHideContentOnRequest: '='
  },
  controller,
  template
};
