import home from '@scripts/views/home.html';
import externalComponents from '@scripts/views/external-components.html';
import externalComponent from '@scripts/views/external-component.html';

export default [
  {
    name: 'home',
    url: '/',
    template: home,
    redirectTo: 'externalComponents'
  },
  {
    name: 'externalComponents',
    url: '/components',
    template: externalComponents
  },
  {
    name: 'externalComponents.component',
    url: '/:componentId?tabs',
    template: externalComponent,
    reloadOnSearch: false
  }
];
