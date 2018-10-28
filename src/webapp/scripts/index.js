import '@styles/_native.styl';
import angular from 'angular';
import uirouter from '@uirouter/angularjs/release/angular-ui-router';
import router from '@scripts/router';
import components from '@scripts/components';
import services from '@scripts/services';

const _public = {};

const dependencies = [
  uirouter,
  components,
  services
];

_public.init = () => {
  const app = angular.module('pitsby-app', dependencies);
  app.config(router);
};

_public.init();

export default _public;
