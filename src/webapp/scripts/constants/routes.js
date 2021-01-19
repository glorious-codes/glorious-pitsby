import app from '@scripts/views/app.html';
import externalComponents from '@scripts/views/external-components.html';
import externalComponent from '@scripts/views/external-component.html';
import externalComponentsPlayground from '@scripts/views/external-components-playground.html';

export default [
  {
    name: 'app',
    url: '/',
    template: app
  },
  {
    name: 'app.external-components',
    url: 'components/:engine',
    template: externalComponents
  },
  {
    name: 'app.external-components.component',
    url: '/:componentId?externalComponentExampleTabs',
    template: externalComponent,
    reloadOnSearch: false
  },
  {
    name: 'app.external-components.playground',
    url: '/playground?tab&code&source',
    template: externalComponentsPlayground,
    reloadOnSearch: false
  }
];
