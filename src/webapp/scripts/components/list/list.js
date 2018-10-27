import template from './list.html';

export default {
  transclude: true,
  bindings: {
    alertErrorMessage: '@',
    fetch: '=',
    fetchSuccess: '=',
    shouldHideContentOnRequest: '='
  },
  template
};
