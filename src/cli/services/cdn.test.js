const processService = require('./process');
import service from './cdn';

describe('CDN Service', () => {
  function mockNodeEnv(env){
    processService.getNodeEnv = jest.fn(() => env);
  }

  beforeEach(() => {
    mockNodeEnv();
  });

  it('should build scripts tag for Angular 1.7.9 by default', () => {
    expect(service.buildAngularScriptTag()).toEqual(
      '<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular.js"></script>'
    );
  });

  it('should build Angular scripts tag for production when node env is production', () => {
    mockNodeEnv('production');
    expect(service.buildAngularScriptTag()).toEqual(
      '<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular.min.js"></script>'
    );
  });

  it('should build scripts tag for Vue 2.5.13 by default', () => {
    expect(service.buildVueScriptTag()).toEqual(
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.13/vue.js"></script>'
    );
  });

  it('should build Vue scripts tag for production when node env is production', () => {
    mockNodeEnv('production');
    expect(service.buildVueScriptTag()).toEqual(
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.13/vue.min.js"></script>'
    );
  });

  it('shuold optionally build script tag for custom Vue version', () => {
    expect(service.buildVueScriptTag('2.6.0')).toEqual(
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.0/vue.js"></script>'
    );
  });

  it('should build scripts tag for React 16.13.0 by default', () => {
    expect(service.buildReactScriptTag()).toEqual([
      '<script crossorigin src="https://unpkg.com/react@16.13.0/umd/react.development.js"></script>',
      '<script crossorigin src="https://unpkg.com/react-dom@16.13.0/umd/react-dom.development.js"></script>'
    ].join('\n'));
  });

  it('should build React scripts tag for production when node env is production', () => {
    mockNodeEnv('production');
    expect(service.buildReactScriptTag()).toEqual([
      '<script crossorigin src="https://unpkg.com/react@16.13.0/umd/react.production.min.js"></script>',
      '<script crossorigin src="https://unpkg.com/react-dom@16.13.0/umd/react-dom.production.min.js"></script>'
    ].join('\n'));
  });

  it('shuold optionally build script tag for custom React version', () => {
    expect(service.buildReactScriptTag('16.8.0')).toEqual([
      '<script crossorigin src="https://unpkg.com/react@16.8.0/umd/react.development.js"></script>',
      '<script crossorigin src="https://unpkg.com/react-dom@16.8.0/umd/react-dom.development.js"></script>'
    ].join('\n'));
  });
});
