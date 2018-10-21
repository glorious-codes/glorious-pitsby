import angular from 'angular';
import container from '@scripts/components/container/container';
import viewport from '@scripts/components/viewport/viewport';

export default angular.module('components', [])
  .component('pContainer', container)
  .component('pViewport', viewport)
  .name;
