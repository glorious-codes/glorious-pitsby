import angular from 'angular';
import uirouter from '@uirouter/angularjs/release/angular-ui-router';
import router from '@scripts/router';
import components from '@scripts/components';

const _public = {};

const dependencies = [
  uirouter,
  components
];

_public.init = () => {
  const app = angular.module('pitsby-app', dependencies);
  app.config(router);
};

_public.init();

export default _public;
