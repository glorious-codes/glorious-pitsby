import angular from 'angular';
import container from '@scripts/components/container/container';

export default angular.module('components', [])
  .component('pContainer', container)
  .name;
