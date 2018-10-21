import routeService from '@scripts/services/route';

function router($stateProvider, $urlRouterProvider) {
  routeService.getAllRoutes().forEach(route => {
    $stateProvider.state(route);
  });
  $urlRouterProvider.otherwise('/');
}

export default router;
