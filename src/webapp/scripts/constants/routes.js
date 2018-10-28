import home from '@scripts/views/home.html';
import externalComponents from '@scripts/views/external-components.html';

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
  }
];
