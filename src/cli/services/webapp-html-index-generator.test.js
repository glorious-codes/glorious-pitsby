const fs = require('fs');
const path = require('path');
const { fileService } = require('./file');
const webappHtmlIndexGenerator = require('./webapp-html-index-generator');
const indexTemplate = fs.readFileSync(path.join(__dirname, '../../webapp/index-template.html'), 'utf-8');

describe('Webapp HTML Index Generator', () => {
  function mockOptions(){
    return {
      styles: ['https://some.lib.com/from/cdn.min.css', './dist/css/main.css'],
      scripts: ['https://some.lib.com/from/cdn.min.js', 'dist/scripts/main.js']
    };
  }

  beforeEach(() => {
    fileService.readSync = jest.fn(() => indexTemplate);
    fileService.write = jest.fn();
  });

  it('should include external assets on template', () => {
    webappHtmlIndexGenerator.init(mockOptions());
    expect(fileService.write).toHaveBeenCalledWith(
      path.join(__dirname, '../../webapp/index.html'), `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Pitsby</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=yes">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
    <link href="https://some.lib.com/from/cdn.min.css" rel="stylesheet">
<link href="external/dist/css/main.css" rel="stylesheet">
  </head>
  <body ng-app="pitsby-app">
    <ui-view></ui-view>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.5/angular.min.js"></script>
    <script src="https://some.lib.com/from/cdn.min.js"></script>
<script src="external/dist/scripts/main.js"></script>
  </body>
</html>
`);
  });

  it('should not include any external assets if no assets have been given', () => {
    webappHtmlIndexGenerator.init();
    expect(fileService.write).toHaveBeenCalledWith(
      path.join(__dirname, '../../webapp/index.html'), `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Pitsby</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=yes">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">

  </head>
  <body ng-app="pitsby-app">
    <ui-view></ui-view>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.5/angular.min.js"></script>

  </body>
</html>
`);
  });
});
