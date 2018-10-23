export default function(){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    setThemeCssClass(buildThemeCssClass($ctrl.alert));
  };

  $ctrl.retry = () => {
    const retryAction = getRetryAction();
    if(retryAction)
      retryAction();
  };

  function buildThemeCssClass(alert = {}){
    return isValidTheme(alert.theme) ? `p-alert-${alert.theme}` : '';
  }

  function isValidTheme(theme){
    return ['danger', 'warn', 'success'].includes(theme);
  }

  function setThemeCssClass(cssClass){
    $ctrl.themeCssClass = cssClass;
  }

  function getRetryAction(){
    return $ctrl.alert ? $ctrl.alert.retryAction : null;
  }
}
