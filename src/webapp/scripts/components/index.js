import angular from 'angular';
import alert from '@scripts/components/alert/alert';
import backTrigger from '@scripts/components/back-trigger/back-trigger';
import btn from '@scripts/components/btn/btn';
import codeEditor from '@scripts/components/code-editor/code-editor';
import componentsMenu from '@scripts/components/components-menu/components-menu';
import componentsMenuItem from '@scripts/components/components-menu-item/components-menu-item';
import credits from '@scripts/components/credits/credits';
import engineMenu from '@scripts/components/engine-menu/engine-menu';
import externalComponent from '@scripts/components/external-component/external-component';
import externalComponentAttributesList from '@scripts/components/external-component-attributes-list/external-component-attributes-list';
import externalComponentExample from '@scripts/components/external-component-example/external-component-example';
import externalComponentExamplesList from '@scripts/components/external-component-examples-list/external-component-examples-list';
import externalComponentCode from '@scripts/components/external-component-code/external-component-code';
import externalComponentPropsList from '@scripts/components/external-component-props-list/external-component-props-list';
import externalComponentPropsListItem from '@scripts/components/external-component-props-list-item/external-component-props-list-item';
import externalComponentPreview from '@scripts/components/external-component-preview/external-component-preview';
import externalComponentsPlayground from '@scripts/components/external-components-playground/external-components-playground';
import heading from '@scripts/components/heading/heading';
import input from '@scripts/components/input/input';
import link from '@scripts/components/link/link';
import listItem from '@scripts/components/list-item/list-item';
import list from '@scripts/components/list/list';
import loader from '@scripts/components/loader/loader';
import logo from '@scripts/components/logo/logo';
import main from '@scripts/components/main/main';
import menuTrigger from '@scripts/components/menu-trigger/menu-trigger';
import paragraph from '@scripts/components/paragraph/paragraph';
import pre from '@scripts/components/pre/pre';
import requester from '@scripts/components/requester/requester';
import row from '@scripts/components/row/row';
import rowItem from '@scripts/components/row-item/row-item';
import sidebar from '@scripts/components/sidebar/sidebar';
import searchInput from '@scripts/components/search-input/search-input';
import tabs from '@scripts/components/tabs/tabs';
import tab from '@scripts/components/tab/tab';
import tag from '@scripts/components/tag/tag';
import topbar from '@scripts/components/topbar/topbar';
import trigger from '@scripts/components/trigger/trigger';
import viewport from '@scripts/components/viewport/viewport';
import welcome from '@scripts/components/welcome/welcome';

export default angular.module('pitsby-components', [])
  .component('pAlert', alert)
  .component('pBackTrigger', backTrigger)
  .component('pBtn', btn)
  .component('pCodeEditor', codeEditor)
  .component('pComponentsMenu', componentsMenu)
  .component('pComponentsMenuItem', componentsMenuItem)
  .component('pCredits', credits)
  .component('pEngineMenu', engineMenu)
  .component('pExternalComponent', externalComponent)
  .component('pExternalComponentAttributesList', externalComponentAttributesList)
  .component('pExternalComponentExample', externalComponentExample)
  .component('pExternalComponentExamplesList', externalComponentExamplesList)
  .component('pExternalComponentCode', externalComponentCode)
  .component('pExternalComponentPropsList', externalComponentPropsList)
  .component('pExternalComponentPropsListItem', externalComponentPropsListItem)
  .component('pExternalComponentPreview', externalComponentPreview)
  .component('pExternalComponentsPlayground', externalComponentsPlayground)
  .component('pHeading', heading)
  .component('pInput', input)
  .component('pLink', link)
  .component('pList', list)
  .component('pListItem', listItem)
  .component('pLoader', loader)
  .component('pLogo', logo)
  .component('pMain', main)
  .component('pMenuTrigger', menuTrigger)
  .component('pParagraph', paragraph)
  .component('pPre', pre)
  .component('pRequester', requester)
  .component('pRow', row)
  .component('pRowItem', rowItem)
  .component('pSidebar', sidebar)
  .component('pSearchInput', searchInput)
  .component('pTabs', tabs)
  .component('pTab', tab)
  .component('pTag', tag)
  .component('pTopbar', topbar)
  .component('pTrigger', trigger)
  .component('pViewport', viewport)
  .component('pWelcome', welcome)
  .name;
