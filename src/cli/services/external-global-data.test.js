const { buildPitsbyConfigMock } = require('../mocks/pitsby-config');
const webappDataService = require('./webapp-data');
const externalGlobalDataService = require('./external-global-data');

describe('External Global Data Service', () => {
  function buildCustomConfig(){
    return {
      logo: {
        filepath: './dist/images/logo.svg',
        width: '200px',
        height: '100px'
      }
    };
  }

  beforeEach(() => {
    webappDataService.save = jest.fn((filename, data, onSuccess) => onSuccess());
    Date.now = jest.fn(() => 123);
  });

  it('should build a JavaScript file that adds Pitsby global values to the browser window', () => {
    const config = buildPitsbyConfigMock({ custom: buildCustomConfig() });
    expect(externalGlobalDataService.build(config)).toEqual({
      metrics: config.metrics,
      projects: config.projects.map(({ engine }) => ({ engine })),
      custom: { logo: { filepath: '/external/dist/images/logo.svg', width: '200px', height: '100px' } },
      fingerprint: 123
    });
  });

  it('should Pitsby global contain empty data if no data has been found in config', () => {
    const config = buildPitsbyConfigMock();
    delete config.metrics;
    delete config.projects;
    expect(externalGlobalDataService.build(config)).toEqual({
      metrics: {},
      projects: [],
      custom: { logo: {} },
      fingerprint: 123
    });
  });
});
