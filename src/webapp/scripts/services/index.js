import angular from 'angular';
import digestion from './digestion';
import route from './route';
import tabsRouteParams from './tabs-route-params';

export default angular.module('pitsby-services', [])
  .service('digestionService', digestion)
  .service('routeService', route)
  .service('tabsRouteParamsService', tabsRouteParams)
  .name;
