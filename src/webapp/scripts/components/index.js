import angular from 'angular';
import alert from '@scripts/components/alert/alert';
import btn from '@scripts/components/btn/btn';
import engineMenu from '@scripts/components/engine-menu/engine-menu';
import externalComponent from '@scripts/components/external-component/external-component';
import externalComponentExample from '@scripts/components/external-component-example/external-component-example';
import externalComponentExamplesList from '@scripts/components/external-component-examples-list/external-component-examples-list';
import externalComponentCode from '@scripts/components/external-component-code/external-component-code';
import externalComponentPropertiesList from '@scripts/components/external-component-properties-list/external-component-properties-list';
import externalComponentPreview from '@scripts/components/external-component-preview/external-component-preview';
import externalComponentsList from '@scripts/components/external-components-list/external-components-list';
import heading from '@scripts/components/heading/heading';
import listItem from '@scripts/components/list-item/list-item';
import list from '@scripts/components/list/list';
import loader from '@scripts/components/loader/loader';
import logo from '@scripts/components/logo/logo';
import main from '@scripts/components/main/main';
import menuTrigger from '@scripts/components/menu-trigger/menu-trigger';
import requester from '@scripts/components/requester/requester';
import row from '@scripts/components/row/row';
import rowItem from '@scripts/components/row-item/row-item';
import sidebar from '@scripts/components/sidebar/sidebar';
import searchInput from '@scripts/components/search-input/search-input';
import tabs from '@scripts/components/tabs/tabs';
import tab from '@scripts/components/tab/tab';
import topbar from '@scripts/components/topbar/topbar';
import trigger from '@scripts/components/trigger/trigger';
import viewport from '@scripts/components/viewport/viewport';
import welcome from '@scripts/components/welcome/welcome';

export default angular.module('pitsby-components', [])
  .component('pAlert', alert)
  .component('pBtn', btn)
  .component('pEngineMenu', engineMenu)
  .component('pExternalComponent', externalComponent)
  .component('pExternalComponentExample', externalComponentExample)
  .component('pExternalComponentExamplesList', externalComponentExamplesList)
  .component('pExternalComponentCode', externalComponentCode)
  .component('pExternalComponentPropertiesList', externalComponentPropertiesList)
  .component('pExternalComponentPreview', externalComponentPreview)
  .component('pExternalComponentsList', externalComponentsList)
  .component('pHeading', heading)
  .component('pList', list)
  .component('pListItem', listItem)
  .component('pLoader', loader)
  .component('pLogo', logo)
  .component('pMain', main)
  .component('pMenuTrigger', menuTrigger)
  .component('pRequester', requester)
  .component('pRow', row)
  .component('pRowItem', rowItem)
  .component('pSidebar', sidebar)
  .component('pSearchInput', searchInput)
  .component('pTabs', tabs)
  .component('pTab', tab)
  .component('pTopbar', topbar)
  .component('pTrigger', trigger)
  .component('pViewport', viewport)
  .component('pWelcome', welcome)
  .name;
