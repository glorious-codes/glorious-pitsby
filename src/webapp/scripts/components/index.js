import angular from 'angular';
import alert from '@scripts/components/alert/alert';
import btn from '@scripts/components/btn/btn';
import container from '@scripts/components/container/container';
import externalComponent from '@scripts/components/external-component/external-component';
import externalComponentPropertiesList from '@scripts/components/external-component-properties-list/external-component-properties-list';
import externalComponentsList from '@scripts/components/external-components-list/external-components-list';
import externalComponentsViewport from '@scripts/components/external-components-viewport/external-components-viewport';
import heading from '@scripts/components/heading/heading';
import listItem from '@scripts/components/list-item/list-item';
import list from '@scripts/components/list/list';
import loader from '@scripts/components/loader/loader';
import requester from '@scripts/components/requester/requester';
import row from '@scripts/components/row/row';
import rowItem from '@scripts/components/row-item/row-item';
import topbar from '@scripts/components/topbar/topbar';
import viewport from '@scripts/components/viewport/viewport';

export default angular.module('pitsby-components', [])
  .component('pAlert', alert)
  .component('pBtn', btn)
  .component('pContainer', container)
  .component('pExternalComponent', externalComponent)
  .component('pExternalComponentPropertiesList', externalComponentPropertiesList)
  .component('pExternalComponentsList', externalComponentsList)
  .component('pExternalComponentsViewport', externalComponentsViewport)
  .component('pHeading', heading)
  .component('pList', list)
  .component('pListItem', listItem)
  .component('pLoader', loader)
  .component('pRequester', requester)
  .component('pRow', row)
  .component('pRowItem', rowItem)
  .component('pTopbar', topbar)
  .component('pViewport', viewport)
  .name;
