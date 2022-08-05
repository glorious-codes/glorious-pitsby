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

  it('should save a file named index.js', () => {
    webappIndexGenerator.init([{
      engine: 'angular',
      moduleName: 'external-module-name'
    }]);
    expect(fileService.write.mock.calls[0][0]).toEqual(path.join(__dirname, '../../webapp/scripts/index.js'));
  });

  it('should include external angular module name on template', () => {
    webappIndexGenerator.init([{
      engine: 'angular',
      moduleName: 'external-module-name'
    }]);
    expect(fileService.write.mock.calls[0][1]).toEqual(`import '@styles/_native.styl';
import angular from 'angular';
import uirouter from '@uirouter/angularjs/release/angular-ui-router';
import router from '@scripts/router';
import components from '@scripts/components';
import services from '@scripts/services';
import analyticsService from '@scripts/services/analytics';
import stylesheetsOrderService from '@scripts/services/stylesheets-order';

const _public = {};

const dependencies = [
  uirouter,
  components,
  services
  , 'external-module-name'
];

_public.init = () => {
  const app = angular.module('pitsby-app', dependencies);
  stylesheetsOrderService.makeLestStylesheetAsFirst(document.head);
  analyticsService.init();
  app.config(router);
};

_public.init();

export default _public;
`);
  });

  it('should not include external angular module name on template if no name has been given', () => {
    webappIndexGenerator.init();
    expect(fileService.write.mock.calls[0][1]).toEqual(`import '@styles/_native.styl';
import angular from 'angular';
import uirouter from '@uirouter/angularjs/release/angular-ui-router';
import router from '@scripts/router';
import components from '@scripts/components';
import services from '@scripts/services';
import analyticsService from '@scripts/services/analytics';
import stylesheetsOrderService from '@scripts/services/stylesheets-order';

const _public = {};

const dependencies = [
  uirouter,
  components,
  services
];

_public.init = () => {
  const app = angular.module('pitsby-app', dependencies);
  stylesheetsOrderService.makeLestStylesheetAsFirst(document.head);
  analyticsService.init();
  app.config(router);
};

_public.init();

export default _public;
`);
  });

  it('should import Vue components library if some Vue components library has been given', () => {
    webappIndexGenerator.init([{
      engine: 'vue',
      importFrom: './dist/my-vue-components',
      libraryName: 'myVueComponents'
    }]);
    expect(fileService.write.mock.calls[0][1]).toEqual(`import Vue from 'vue';
Vue.use(window['myVueComponents']);
import '@styles/_native.styl';
import angular from 'angular';
import uirouter from '@uirouter/angularjs/release/angular-ui-router';
import router from '@scripts/router';
import components from '@scripts/components';
import services from '@scripts/services';
import analyticsService from '@scripts/services/analytics';
import stylesheetsOrderService from '@scripts/services/stylesheets-order';

const _public = {};

const dependencies = [
  uirouter,
  components,
  services
];

_public.init = () => {
  const app = angular.module('pitsby-app', dependencies);
  stylesheetsOrderService.makeLestStylesheetAsFirst(document.head);
  analyticsService.init();
  app.config(router);
};

_public.init();

export default _public;
`);
  });

  it('should reject promise on write file error', () => {
    const errorMock = 'some error';
    fileService.write = jest.fn((filename, data, onSuccess, onError) => onError(errorMock));
    webappIndexGenerator.init([{engine: 'vue', importFrom: './dist/vue-components'}]).then(() => {}, err => {
      expect(err).toEqual(errorMock);
    });
  });
});
