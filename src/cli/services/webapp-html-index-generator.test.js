const fs = require('fs');
const path = require('path');
const { buildPitsbyConfigMock } = require('../mocks/pitsby-config');
const { fileService } = require('./file');
const processService = require('./process');
const pkg = require('../../../package.json');
const webappHtmlIndexGenerator = require('./webapp-html-index-generator');

describe('Webapp HTML Index Generator', () => {
  function getAngularVersion(){
    return pkg.devDependencies.angular.replace('^','');
  }

  function buildGlobalDataInlineScriptTag(customData = {}){
    const { metrics, projects, colorScheme } = customData;
    const data = {
      metrics,
      projects,
      custom: { logo: {} },
      colorScheme: colorScheme && parseGlobalColorSchemeCustomData(colorScheme),
      fingerprint: 123,
    };
    return `<script type="text/javascript">window.pitsbyGlobals=${stringifyGlobalData(data, colorScheme)}</script>`;
  }

  function stringifyGlobalData(data, colorScheme){
    const stringifiedData = JSON.stringify(data);
    if(colorScheme && colorScheme.onChange) {
      const strFunc = colorScheme.onChange.toString().replace(/"/g, '');
      return stringifiedData.replace('"{{onChange}}"', strFunc);
    }
    return stringifiedData;
  }

  function parseGlobalColorSchemeCustomData({ initial, onChange }){
    const data = { initial };
    if(onChange) data.onChange = '{{onChange}}';
    return data;
  }

  function buildHtmlIndexFilename(){
    return path.join(__dirname, '../../webapp/index.html');
  }

  beforeEach(() => {
    fileService.write = jest.fn((filename, data, onSuccess) => onSuccess());
    processService.getCwd = jest.fn(() => '/');
    Date.now = jest.fn(() => 123);
  });

  it('should save a file named index.html', done => {
    const config = buildPitsbyConfigMock({
      projects: [{ engine: 'angular' }],
      colorScheme: { onChange: () => {} }
    });
    webappHtmlIndexGenerator.init(config).then(() => {
      expect(fileService.write).toHaveBeenCalledWith(
        buildHtmlIndexFilename(),
        `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Pitsby</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=yes">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
    <link href="/images/favicon-pitsby.png?t=123" rel="shortcut icon">
    <link href="/external/dist/styles.css?t=123" rel="stylesheet">
  </head>
  <body ng-app="pitsby-app">
    <ui-view></ui-view>
    ${buildGlobalDataInlineScriptTag(config)}
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/${getAngularVersion()}/angular.js"></script>
    <script src="/external/dist/bundle.js?t=123"></script>
  </body>
</html>`,
        expect.any(Function),
        expect.any(Function)
      );
      done();
    });
  });

  it('should not remove quotes inside color scheme change listener', done => {
    const config = buildPitsbyConfigMock({
      projects: [{ engine: 'angular' }],
      colorScheme: { onChange: () => { console.log('double quotes'); } }
    });
    webappHtmlIndexGenerator.init(config).then(() => {
      expect(fileService.write).toHaveBeenCalledWith(
        buildHtmlIndexFilename(),
        expect.stringContaining('{"onChange":function onChange() {'),
        expect.any(Function),
        expect.any(Function)
      );
      expect(fileService.write).toHaveBeenCalledWith(
        buildHtmlIndexFilename(),
        expect.stringContaining('console.log(\'double quotes\')'),
        expect.any(Function),
        expect.any(Function)
      );
      done();
    });
  });

  it('should include external assets on template', done => {
    const config = buildPitsbyConfigMock({ projects: [{ engine: 'angular' }] });
    const styles = ['https://some.lib.com/from/cdn.min.css', ...config.styles];
    const scripts = ['https://some.lib.com/from/cdn.min.js', ...config.scripts];
    webappHtmlIndexGenerator.init({ ...config, styles, scripts }).then(() => {
      expect(fileService.write).toHaveBeenCalledWith(
        buildHtmlIndexFilename(),
        `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Pitsby</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=yes">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
    <link href="/images/favicon-pitsby.png?t=123" rel="shortcut icon">
    <link href="https://some.lib.com/from/cdn.min.css?t=123" rel="stylesheet">
<link href="/external/dist/styles.css?t=123" rel="stylesheet">
  </head>
  <body ng-app="pitsby-app">
    <ui-view></ui-view>
    ${buildGlobalDataInlineScriptTag(config)}
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/${getAngularVersion()}/angular.js"></script>
    <script src="https://some.lib.com/from/cdn.min.js?t=123"></script>
<script src="/external/dist/bundle.js?t=123"></script>
  </body>
</html>`,
        expect.any(Function),
        expect.any(Function)
      );
      done();
    });
  });

  it('should optionally accept tag attributes for external assets', done => {
    const config = buildPitsbyConfigMock({ projects: [{ engine: 'angular' }] });
    const styles = [
      { rel: 'preload', href: './style.css', as: 'style' }
    ];
    const scripts = [
      { crossorigin: '', src: './script.js' },
      { crossorigin: 'use-credentials', src: 'https://some.lib.com/from/cdn.min.js' },
      { rel: 'prefetch', href: './prefetch-script.js', as: 'script' },
      { rel: 'preload', href: './preload-script.js', as: 'script' },
      { type: 'module', src: './es6-script.js' }
    ];
    webappHtmlIndexGenerator.init({ ...config, styles, scripts }).then(() => {
      const expectedHTMLTags = [
        '<link rel="preload" href="/external/style.css?t=123" as="style">',
        '<link rel="prefetch" href="/external/prefetch-script.js?t=123" as="script">',
        '<link rel="preload" href="/external/preload-script.js?t=123" as="script">',
        '<script crossorigin src="/external/script.js?t=123"></script>',
        '<script crossorigin="use-credentials" src="https://some.lib.com/from/cdn.min.js?t=123"></script>',
        '<script type="module" src="/external/es6-script.js?t=123"></script>'
      ];
      expectedHTMLTags.forEach(htmlTag => {
        expect(fileService.write).toHaveBeenCalledWith(
          buildHtmlIndexFilename(),
          expect.stringContaining(htmlTag),
          expect.any(Function),
          expect.any(Function)
        );
      });
      done();
    });
  });

  it('should optionally inline external script asset', done => {
    processService.getCwd = jest.fn(() => __dirname);
    const inlineScriptContent = '{\'imports\': {\'lib\': \'/some/path/to/lib.js\'}}';
    const filepath = path.join(__dirname, './importmap.js');
    fs.writeFileSync(filepath, inlineScriptContent, 'UTF-8');
    const config = buildPitsbyConfigMock({ projects: [{ engine: 'vanilla' }] });
    const scripts = [{ type: 'importmap', src: './importmap.js', inline: true }];
    webappHtmlIndexGenerator.init({ ...config, scripts }).then(() => {
      const expectedHTMLTag = `<script type="importmap">${inlineScriptContent}</script>`;
      expect(fileService.write).toHaveBeenCalledWith(
        buildHtmlIndexFilename(),
        expect.stringContaining(expectedHTMLTag),
        expect.any(Function),
        expect.any(Function)
      );
      fs.rm(filepath, done);
    });
  });

  it('should not include any external assets if no assets have been given', done => {
    webappHtmlIndexGenerator.init().then(() => {
      expect(fileService.write).toHaveBeenCalledWith(
        buildHtmlIndexFilename(),
        `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Pitsby</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=yes">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
    <link href="/images/favicon-pitsby.png?t=123" rel="shortcut icon">
  </head>
  <body ng-app="pitsby-app">
    <ui-view></ui-view>
    ${buildGlobalDataInlineScriptTag({ metrics: {}, projects: [] })}
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/${getAngularVersion()}/angular.js"></script>
  </body>
</html>`,
        expect.any(Function),
        expect.any(Function)
      );
      done();
    });
  });

  it('should include Vue script tag if a vue project has been given', done => {
    const config = buildPitsbyConfigMock();
    webappHtmlIndexGenerator.init(config).then(() => {
      expect(fileService.write).toHaveBeenCalledWith(
        buildHtmlIndexFilename(),
        expect.stringContaining('<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.13/vue.js"></script>'),
        expect.any(Function),
        expect.any(Function)
      );
      done();
    });
  });

  it('should use custom Vue version if custom version has been given', done => {
    const config = buildPitsbyConfigMock({ projects: [{ engine: 'vue', version: '2.6.0' }] });
    webappHtmlIndexGenerator.init(config).then(() => {
      expect(fileService.write).toHaveBeenCalledWith(
        buildHtmlIndexFilename(),
        expect.stringContaining('<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.0/vue.js"></script>'),
        expect.any(Function),
        expect.any(Function)
      );
      done();
    });
  });

  it('should use React version 16.13.0 if no custom version has been given', done => {
    const config = buildPitsbyConfigMock({ projects: [{ engine: 'react' }] });
    webappHtmlIndexGenerator.init(config).then(() => {
      expect(fileService.write).toHaveBeenCalledWith(
        buildHtmlIndexFilename(),
        `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Pitsby</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=yes">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
    <link href="/images/favicon-pitsby.png?t=123" rel="shortcut icon">
    <link href="/external/dist/styles.css?t=123" rel="stylesheet">
  </head>
  <body ng-app="pitsby-app">
    <ui-view></ui-view>
    ${buildGlobalDataInlineScriptTag(config)}
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/${getAngularVersion()}/angular.js"></script>
    <script crossorigin src="https://unpkg.com/react@16.13.0/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16.13.0/umd/react-dom.development.js"></script>
<script crossorigin src="https://unpkg.com/@babel/standalone@7.8.6/babel.min.js"></script>
<script src="/external/dist/bundle.js?t=123"></script>
  </body>
</html>`,
        expect.any(Function),
        expect.any(Function)
      );
      done();
    });
  });

  it('should use custom React version if custom version has been given', done => {
    const config = buildPitsbyConfigMock({ projects: [{ engine: 'react', version: '16.8.0' }] });
    webappHtmlIndexGenerator.init(config).then(() => {
      expect(fileService.write).toHaveBeenCalledWith(
        buildHtmlIndexFilename(),
        expect.stringContaining(
          `<script crossorigin src="https://unpkg.com/react@16.8.0/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16.8.0/umd/react-dom.development.js"></script>`),
        expect.any(Function),
        expect.any(Function)
      );
      done();
    });
  });

  it('should handle customisation', done => {
    const config = buildPitsbyConfigMock({ custom: { windowTitle: 'Taslonic' } });
    webappHtmlIndexGenerator.init(config).then(() => {
      expect(fileService.write).toHaveBeenCalledWith(
        buildHtmlIndexFilename(),
        expect.stringContaining('<title>Taslonic</title>'),
        expect.any(Function),
        expect.any(Function)
      );
      done();
    });
  });

  it('should reject promise on write file error', done => {
    const errorMock = 'some error';
    fileService.write = jest.fn((filename, data, onSuccess, onError) => onError(errorMock));
    webappHtmlIndexGenerator.init(buildPitsbyConfigMock()).then(() => {}, err => {
      expect(err).toEqual(errorMock);
      done();
    });
  });
});
