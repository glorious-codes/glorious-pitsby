import app from '@scripts/views/app.html';
import externalComponents from '@scripts/views/external-components.html';
import externalComponent from '@scripts/views/external-component.html';

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
  }
];
