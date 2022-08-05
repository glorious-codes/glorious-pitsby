import testingService from '@scripts/services/testing';
import externalGlobalDataService from './external-global-data';

describe('External Global Data Service', () => {
  afterEach(() => {
    testingService.clearExternalGlobalData();
  });

  it('should get external global data', () => {
    const data = { some: 'data' };
    testingService.mockExternalGlobalData(data);
    expect(externalGlobalDataService.get()).toEqual(data);
  });
});
