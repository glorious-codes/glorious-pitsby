import Staly from '@compilorama/staly';
import googleAnalyticsAdapter from '@compilorama/staly/dist/adapters/google-analytics';
import testingService from '@scripts/services/testing';
import { stalyMock, stalyInstanceMock } from '@mocks/staly';
import windowService from '@scripts/services/window';
import analyticsService from './analytics';

Staly.mockImplementation(stalyMock);

describe('Analytics Service', () => {
  function mockGoogleAnalyticsData(googleAnalyticsId){
    mockExternalGlobalData({ googleAnalyticsId });
  }

  function mockPlausibleData({ plausibleId, plausibleOptions }){
    mockExternalGlobalData({ plausibleId, plausibleOptions });
  }

  function mockExternalGlobalData(data){
    testingService.mockExternalGlobalData({ metrics: data });
  }

  beforeEach(() => {
    jest.useFakeTimers();
    stalyInstanceMock.init = jest.fn();
    stalyInstanceMock.trackPageview = jest.fn();
    windowService.getHash = jest.fn(() => '#!/');
  });

  afterEach(() => {
    testingService.clearExternalGlobalData();
    jest.useRealTimers();
  });

  it('should not initialize glorious analytics if no metrics data has been found', () => {
    analyticsService.init();
    expect(stalyInstanceMock.init).not.toHaveBeenCalled();
  });

  it('should initialize analytics with Google Analytics by default', () => {
    const googleAnalyticsId = '123';
    mockGoogleAnalyticsData(googleAnalyticsId);
    analyticsService.init();
    expect(stalyInstanceMock.init).toHaveBeenCalledWith(
      googleAnalyticsId,
      { adapter: googleAnalyticsAdapter }
    );
  });

  it('should track page view using Google Analytics by default', () => {
    windowService.getHash = jest.fn(() => '#!/components/vue/column');
    mockGoogleAnalyticsData('123');
    analyticsService.init();
    analyticsService.trackPageView();
    jest.runOnlyPendingTimers();
    expect(stalyInstanceMock.trackPageview).toHaveBeenCalledTimes(1);
    expect(stalyInstanceMock.trackPageview).toHaveBeenCalledWith({
      path: '/components/vue/column'
    });
  });

  it('should optionally initialize analytics with Plausible', () => {
    const plausibleId = 'some.website.com';
    mockPlausibleData({ plausibleId });
    analyticsService.init();
    expect(stalyInstanceMock.init).toHaveBeenCalledWith(plausibleId, {});
  });

  it('should optionally pass options to Plausible initialization', () => {
    const plausibleId = 'some.website.com';
    const plausibleOptions = { trackLocalhost: true };
    mockPlausibleData({ plausibleId, plausibleOptions });
    analyticsService.init();
    expect(stalyInstanceMock.init).toHaveBeenCalledWith(plausibleId, plausibleOptions);
  });

  it('should optionally track page view using Plausible', () => {
    windowService.getHash = jest.fn(() => '#!/components/vue/form');
    const plausibleId = 'some.website.com';
    mockPlausibleData({ plausibleId });
    analyticsService.trackPageView();
    jest.runOnlyPendingTimers();
    expect(stalyInstanceMock.trackPageview).toHaveBeenCalledWith({
      url: '/components/vue/form'
    });
  });
});
