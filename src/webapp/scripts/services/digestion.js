function promiseService($timeout){
  const _public = {};

  _public.request = (promiseAction, options = {}) => {
    promiseAction().then(response => {
      handleCompletion(options.success, response);
    }, err => {
      handleCompletion(options.error, err);
    });
  };

  function handleCompletion(completionCallback, data){
    $timeout(() => {
      completionCallback && completionCallback(data);
    });
  }

  return _public;
}

promiseService.$inject = ['$timeout'];

export default promiseService;
