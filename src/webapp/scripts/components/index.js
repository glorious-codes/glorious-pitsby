import angular from 'angular';
import alert from '@scripts/components/alert/alert';
import container from '@scripts/components/container/container';
import listItem from '@scripts/components/list-item/list-item';
import list from '@scripts/components/list/list';
import loader from '@scripts/components/loader/loader';
import requester from '@scripts/components/requester/requester';
import viewport from '@scripts/components/viewport/viewport';

export default angular.module('pitsby-components', [])
  .component('pAlert', alert)
  .component('pContainer', container)
  .component('pList', list)
  .component('pListItem', listItem)
  .component('pLoader', loader)
  .component('pRequester', requester)
  .component('pViewport', viewport)
  .name;
