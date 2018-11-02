import angular from 'angular';
import digestion from './digestion';
import route from './route';

export default angular.module('pitsby-services', [])
  .service('digestionService', digestion)
  .service('routeService', route)
  .name;
