import angular from 'angular';
import container from '@scripts/components/container/container';
import loader from '@scripts/components/loader/loader';
import viewport from '@scripts/components/viewport/viewport';

export default angular.module('components', [])
  .component('pContainer', container)
  .component('pLoader', loader)
  .component('pViewport', viewport)
  .name;
