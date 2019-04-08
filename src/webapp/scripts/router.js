import analyticsService from '@scripts/services/analytics';
import routes from '@scripts/constants/routes';

function router($stateProvider, $urlRouterProvider, $transitionsProvider) {
  routes.forEach(route => {
    $stateProvider.state(route);
  });
  $urlRouterProvider.otherwise('/');
  $transitionsProvider.onSuccess({}, analyticsService.trackPageView);
}

router.$inject = ['$stateProvider', '$urlRouterProvider', '$transitionsProvider'];

export default router;
