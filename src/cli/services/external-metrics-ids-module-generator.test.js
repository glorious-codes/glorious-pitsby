const externalMetricsIdsFileGenerator = require('./external-metrics-ids-module-generator');
const webappDataService = require('./webapp-data');

describe('External Metrics Ids Module Generator', () => {
  function mockMetricsIds(){
    return {
      some: 'id'
    };
  }

  beforeEach(() => {
    webappDataService.save = jest.fn();
  });

  it('should return a promise', () => {
    const promise = externalMetricsIdsFileGenerator.init(mockMetricsIds());
    expect(promise.then).toBeDefined();
  });

  it('should save metrics ids data', () => {
    const data = mockMetricsIds();
    externalMetricsIdsFileGenerator.init(data);
    expect(webappDataService.save.mock.calls[0][0]).toEqual('metrics-ids.js');
    expect(webappDataService.save.mock.calls[0][1]).toEqual(`module.exports = {
  get(){
    return ${JSON.stringify(data)};
  }
};`);
    expect(typeof webappDataService.save.mock.calls[0][2]).toEqual('function');
    expect(typeof webappDataService.save.mock.calls[0][3]).toEqual('function');
  });

  it('should save a blank module if no metrics ids have been given', () => {
    externalMetricsIdsFileGenerator.init();
    expect(webappDataService.save.mock.calls[0][1]).toEqual(`module.exports = {
  get(){
    return {};
  }
};`);
  });
});
