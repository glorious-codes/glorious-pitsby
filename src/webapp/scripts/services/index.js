import angular from 'angular';
import angularComponentBuilder from './angular-component-builder';
import digestion from './digestion';
import engineRedirection from './engine-redirection';
import route from './route';
import tabsRouteParams from './tabs-route-params';

export default angular.module('pitsby-services', [])
  .service('angularComponentBuilder', angularComponentBuilder)
  .service('digestionService', digestion)
  .service('engineRedirectionService', engineRedirection)
  .service('routeService', route)
  .service('tabsRouteParamsService', tabsRouteParams)
  .name;
