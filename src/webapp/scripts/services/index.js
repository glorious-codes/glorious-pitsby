import angular from 'angular';
import digestionService from './digestion';

export default angular.module('pitsby-services', [])
  .service('digestionService', digestionService)
  .name;
