function routeService($state, $stateParams){
  const _public = {};

  _public.getAllRoutes = () => {
    return $state.get();
  };

  _public.getParams = param => {
    if (param)
      return $stateParams[param];
    return $stateParams;
  };

  _public.go = (state, params, options) => {
    return $state.go(state, params, options);
  };

  return _public;
}

routeService.$inject = ['$state', '$stateParams'];

export default routeService;
