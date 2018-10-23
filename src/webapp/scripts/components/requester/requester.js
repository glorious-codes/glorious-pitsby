import template from './requester.html';

function controller (){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    handleFetch($ctrl.fetch);
  };

  $ctrl.$onChanges = () => {
    setContentVisibility(isContentVisible());
  };

  function handleFetch(fetch){
    return fetch ? fetchData() : setContentVisibility(true);
  }

  function fetchData(){
    request($ctrl.fetch, $ctrl.fetchSuccess);
  }

  function request(action, onActionSucess){
    setAlert(null);
    setLoaderVisibility(true);
    setContentVisibility(isContentVisible());
    action().then(response => {
      onRequestSuccess(response, onActionSucess);
    }, onRequestDataError);
  }

  function onRequestSuccess(response, onActionSucess){
    onActionSucess(response);
    onRequestComplete();
  }

  function onRequestDataError(){
    setAlert(buildErrorAlert());
    onRequestComplete();
  }

  function onRequestComplete(){
    setLoaderVisibility(false);
    setContentVisibility(isContentVisible());
  }

  function isContentVisible(){
    return !$ctrl.shouldHideContentOnRequest || (!$ctrl.shouldShowLoader && !$ctrl.alert);
  }

  function buildErrorAlert(){
    return {
      theme: 'error',
      message: getAlertErrorMessage(),
      retryAction: fetchData
    };
  }

  function getAlertErrorMessage(){
    return $ctrl.alertErrorMessage || 'Failed on processing request. Please, try again.';
  }

  function setAlert(alert){
    $ctrl.alert = alert;
  }

  function setContentVisibility(shouldShow){
    $ctrl.shouldShowContent = shouldShow;
  }

  function setLoaderVisibility(shouldShow){
    $ctrl.shouldShowLoader = shouldShow;
  }
}

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
