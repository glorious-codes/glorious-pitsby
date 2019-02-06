const fs = require('fs');
const path = require('path');
const { fileService } = require('./file');
const webappIndexGenerator = require('./webapp-index-generator');
const indexTemplate = fs.readFileSync(path.join(__dirname, '../../webapp/scripts/index-template.js'), 'utf-8');

describe('Webapp Index Generator', () => {
  beforeEach(() => {
    fileService.readSync = jest.fn(() => indexTemplate);
    fileService.write = jest.fn();
  });

  it('should include external angular module name on template', () => {
    webappIndexGenerator.init([{
      engine: 'angular',
      moduleName: 'external-module-name'
    }]);
    expect(fileService.write).toHaveBeenCalledWith(
      path.join(__dirname, '../../webapp/scripts/index.js'),
      `import '@styles/_native.styl';
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
  , 'external-module-name'
];

_public.init = () => {
  const app = angular.module('pitsby-app', dependencies);
  app.config(router);
};

_public.init();

export default _public;
`);
  });

  it('should not include external angular module name on template if no name has been given', () => {
    webappIndexGenerator.init();
    expect(fileService.write).toHaveBeenCalledWith(
      path.join(__dirname, '../../webapp/scripts/index.js'),
      `import '@styles/_native.styl';
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
`);
  });

  it('should import Vue components library if some Vue components library has been given', () => {
    webappIndexGenerator.init([{
      engine: 'vue',
      importFrom: './dist/vue-components'
    }]);
    expect(fileService.write).toHaveBeenCalledWith(
      path.join(__dirname, '../../webapp/scripts/index.js'),
      `import Vue from 'vue';
import vueComponents from '../external/dist/vue-components';
Vue.use(vueComponents);
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
`);
  });
});
