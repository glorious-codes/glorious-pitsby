const fs = require('fs');
const path = require('path');
const pkg = require('../../../package.json');
const processService = require('./process');
const { fileService } = require('./file');
const webappHtmlIndexGenerator = require('./webapp-html-index-generator');
const webappHtmlIndexCustomisation = require('./webapp-html-index-customisation');
const indexTemplate = fs.readFileSync(path.join(__dirname, '../../webapp/index-template.html'), 'utf-8');

describe('Webapp HTML Index Generator', () => {
  function mockConfig(){
    return {
      projects: [{engine: 'angular'}],
      styles: ['https://some.lib.com/from/cdn.min.css', './dist/css/main.css'],
      scripts: ['https://some.lib.com/from/cdn.min.js', 'dist/scripts/main.js']
    };
  }

  function getAngularVersion(){
    return pkg.devDependencies.angular.replace('^','');
  }

  beforeEach(() => {
    fileService.readSync = jest.fn(() => indexTemplate);
    fileService.write = jest.fn();
    processService.getNodeEnv = jest.fn(() => 'development');
    webappHtmlIndexCustomisation.init = jest.fn(param => param);
    Date.now = jest.fn(() => 123);
  });

  it('should save a file named index.html', () => {
    webappHtmlIndexGenerator.init(mockConfig());
    expect(fileService.write.mock.calls[0][0]).toEqual(path.join(__dirname, '../../webapp/index.html'));
  });

  it('should include external assets on template', () => {
    webappHtmlIndexGenerator.init(mockConfig());
    expect(fileService.write.mock.calls[0][1]).toEqual(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{{ title }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=yes">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
    <link href="{{ faviconHref }}" rel="shortcut icon">
    <link href="https://some.lib.com/from/cdn.min.css?t=123" rel="stylesheet">
<link href="external/dist/css/main.css?t=123" rel="stylesheet">
  </head>
  <body ng-app="pitsby-app">
    <ui-view></ui-view>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/${getAngularVersion()}/angular.js"></script>
    <script src="https://some.lib.com/from/cdn.min.js?t=123"></script>
<script src="external/dist/scripts/main.js?t=123"></script>
  </body>
</html>
`);
  });

  it('should not include any external assets if no assets have been given', () => {
    webappHtmlIndexGenerator.init();
    expect(fileService.write.mock.calls[0][1]).toEqual(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{{ title }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=yes">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
    <link href="{{ faviconHref }}" rel="shortcut icon">

  </head>
  <body ng-app="pitsby-app">
    <ui-view></ui-view>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/${getAngularVersion()}/angular.js"></script>

  </body>
</html>
`);
  });

  it('should include vue script tag if a vue project has been given', () => {
    const config = mockConfig();
    config.projects.push({engine: 'vue'});
    webappHtmlIndexGenerator.init({ projects: config.projects });
    expect(fileService.write.mock.calls[0][1]).toEqual(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{{ title }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=yes">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
    <link href="{{ faviconHref }}" rel="shortcut icon">

  </head>
  <body ng-app="pitsby-app">
    <ui-view></ui-view>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/${getAngularVersion()}/angular.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.13/vue.js"></script>
  </body>
</html>
`);
  });

  it('should use vue version 2.5.13 if no custom vue version has been given', () => {
    const config = mockConfig();
    config.projects.push({engine: 'vue'});
    webappHtmlIndexGenerator.init({ projects: config.projects });
    expect(fileService.write.mock.calls[0][1]).toEqual(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{{ title }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=yes">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
    <link href="{{ faviconHref }}" rel="shortcut icon">

  </head>
  <body ng-app="pitsby-app">
    <ui-view></ui-view>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/${getAngularVersion()}/angular.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.13/vue.js"></script>
  </body>
</html>
`);
  });

  it('should use custom vue version if custom vue version has been given', () => {
    const config = mockConfig();
    config.projects.push({engine: 'vue', version: '2.6.0'});
    webappHtmlIndexGenerator.init({ projects: config.projects });
    expect(fileService.write.mock.calls[0][1]).toEqual(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{{ title }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=yes">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
    <link href="{{ faviconHref }}" rel="shortcut icon">

  </head>
  <body ng-app="pitsby-app">
    <ui-view></ui-view>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/${getAngularVersion()}/angular.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.0/vue.js"></script>
  </body>
</html>
`);
  });

  it('should not include vue script tag if no projects have been given', () => {
    webappHtmlIndexGenerator.init();
    expect(fileService.write.mock.calls[0][1]).toEqual(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{{ title }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=yes">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
    <link href="{{ faviconHref }}" rel="shortcut icon">

  </head>
  <body ng-app="pitsby-app">
    <ui-view></ui-view>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/${getAngularVersion()}/angular.js"></script>

  </body>
</html>
`);
  });

  it('should include minified component engine script tags if environment is production', () => {
    const config = mockConfig();
    config.projects.push({engine: 'vue', version: '2.6.0'});
    processService.getNodeEnv = jest.fn(() => 'production');
    webappHtmlIndexGenerator.init({ projects: config.projects });
    expect(fileService.write.mock.calls[0][1]).toEqual(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{{ title }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=yes">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
    <link href="{{ faviconHref }}" rel="shortcut icon">

  </head>
  <body ng-app="pitsby-app">
    <ui-view></ui-view>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/${getAngularVersion()}/angular.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.0/vue.min.js"></script>
  </body>
</html>
`);
  });

  it('should handle customisation', () => {
    const config = mockConfig();
    config.custom = { windowTitle: 'Taslonic' };
    webappHtmlIndexGenerator.init(config);
    expect(typeof webappHtmlIndexCustomisation.init.mock.calls[0][0]).toEqual('string');
    expect(webappHtmlIndexCustomisation.init.mock.calls[0][1]).toEqual({ windowTitle: 'Taslonic' });
  });

  it('should reject promise on write file error', () => {
    const config = mockConfig();
    const errorMock = 'some error';
    fileService.write = jest.fn((filename, data, onSuccess, onError) => onError(errorMock));
    webappHtmlIndexGenerator.init(config).then(() => {}, err => {
      expect(err).toEqual(errorMock);
    });
  });
});
