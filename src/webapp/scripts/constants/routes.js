import home from '@scripts/views/home.html';
import externalComponents from '@scripts/views/external-components.html';
import externalComponent from '@scripts/views/external-component.html';

export default [
  {
    name: 'home',
    url: '/',
    template: home
  },
  {
    name: 'external-components',
    url: '/components',
    template: externalComponents
  },
  {
    name: 'external-components.component',
    url: '/:componentId',
    template: externalComponent
  }
];
