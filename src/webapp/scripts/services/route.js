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

  return _public;
}

routeService.$inject = ['$state', '$stateParams'];

export default routeService;
