import angular from 'angular';
import alert from '@scripts/components/alert/alert';
import btn from '@scripts/components/btn/btn';
import container from '@scripts/components/container/container';
import externalComponent from '@scripts/components/external-component/external-component';
import externalComponentExample from '@scripts/components/external-component-example/external-component-example';
import externalComponentExamplesList from '@scripts/components/external-component-examples-list/external-component-examples-list';
import externalComponentPropertiesList from '@scripts/components/external-component-properties-list/external-component-properties-list';
import externalComponentPreview from '@scripts/components/external-component-preview/external-component-preview';
import externalComponentsList from '@scripts/components/external-components-list/external-components-list';
import externalComponentsViewport from '@scripts/components/external-components-viewport/external-components-viewport';
import heading from '@scripts/components/heading/heading';
import listItem from '@scripts/components/list-item/list-item';
import list from '@scripts/components/list/list';
import loader from '@scripts/components/loader/loader';
import requester from '@scripts/components/requester/requester';
import row from '@scripts/components/row/row';
import rowItem from '@scripts/components/row-item/row-item';
import tabs from '@scripts/components/tabs/tabs';
import tab from '@scripts/components/tab/tab';
import topbar from '@scripts/components/topbar/topbar';
import viewport from '@scripts/components/viewport/viewport';
import welcome from '@scripts/components/welcome/welcome';

export default angular.module('pitsby-components', [])
  .component('pAlert', alert)
  .component('pBtn', btn)
  .component('pContainer', container)
  .component('pExternalComponent', externalComponent)
  .component('pExternalComponentExample', externalComponentExample)
  .component('pExternalComponentExamplesList', externalComponentExamplesList)
  .component('pExternalComponentPropertiesList', externalComponentPropertiesList)
  .component('pExternalComponentPreview', externalComponentPreview)
  .component('pExternalComponentsList', externalComponentsList)
  .component('pExternalComponentsViewport', externalComponentsViewport)
  .component('pHeading', heading)
  .component('pList', list)
  .component('pListItem', listItem)
  .component('pLoader', loader)
  .component('pRequester', requester)
  .component('pRow', row)
  .component('pRowItem', rowItem)
  .component('pTabs', tabs)
  .component('pTab', tab)
  .component('pTopbar', topbar)
  .component('pViewport', viewport)
  .component('pWelcome', welcome)
  .name;
