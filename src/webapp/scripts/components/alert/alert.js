import '@styles/alert.styl';
import template from './alert.html';

function controller(){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    setThemeCssClass(buildThemeCssClass($ctrl.alert));
  };

  $ctrl.$onChanges = () => {
    setThemeCssClass(buildThemeCssClass($ctrl.alert));
  };

  $ctrl.retry = () => {
    const retryAction = getRetryAction();
    if(retryAction)
      retryAction();
  };

  function buildThemeCssClass(alert){
    return isValidTheme(alert) ? `p-alert-${alert.theme}` : '';
  }

  function isValidTheme(alert){
    return alert && ['danger', 'warn', 'success'].includes(alert.theme);
  }

  function setThemeCssClass(cssClass){
    $ctrl.themeCssClass = cssClass;
  }

  function getRetryAction(){
    return $ctrl.alert ? $ctrl.alert.retryAction : null;
  }
}

export default {
  bindings: {
    alert: '<'
  },
  controller,
  template
};
