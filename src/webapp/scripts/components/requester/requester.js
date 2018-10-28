import template from './requester.html';

function controller(digestionService){
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
    digestionService.request(action, {
      success(response){
        onRequestSuccess(response, onActionSucess);
      },
      error: onRequestDataError
    });
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
    if(!$ctrl.shouldHideContentOnRequest)
      return true;
    return !$ctrl.alert && !$ctrl.shouldShowLoader;
  }

  function buildErrorAlert(){
    return {
      theme: 'danger',
      message: getAlertErrorMessage(),
      retryAction: fetchData
    };
  }

  function getAlertErrorMessage(){
    return $ctrl.alertErrorMessage || 'Failed to process request. Please, try again.';
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

controller.$inject = ['digestionService'];

export default {
  transclude: true,
  bindings: {
    alert: '<',
    alertErrorMessage: '@',
    fetch: '=',
    fetchSuccess: '=',
    shouldHideContentOnRequest: '<'
  },
  controller,
  template
};
