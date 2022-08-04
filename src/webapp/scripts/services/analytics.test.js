import GAnalytics from '@glorious/analytics';
import googleAnalyticsAdapter from '@glorious/analytics/dist/adapters/google-analytics';
import testingService from '@scripts/services/testing';
import { GAnalyticsMock, ganalyticsInstanceMock } from '@mocks/glorious-analytics';
import windowService from '@scripts/services/window';
import analyticsService from './analytics';

GAnalytics.mockImplementation(GAnalyticsMock);

describe('Analytics Service', () => {
  function mockGoogleAnalyticsId(googleAnalyticsId){
    const data = { metrics: { googleAnalyticsId } };
    testingService.mockExternalGlobalData(data);
  }

  beforeEach(() => {
    ganalyticsInstanceMock.init = jest.fn();
    ganalyticsInstanceMock.trackPageview = jest.fn();
  });

  afterEach(() => {
    testingService.clearExternalGlobalData();
  });

  it('should not initialize glorious analytics by default', () => {
    analyticsService.init();
    expect(ganalyticsInstanceMock.init).not.toHaveBeenCalled();
  });

  it('should initialize glorious analytics passing Google Analytics as adapter', () => {
    const googleAnalyticsId = '123';
    mockGoogleAnalyticsId(googleAnalyticsId);
    analyticsService.init();
    expect(ganalyticsInstanceMock.init).toHaveBeenCalledWith(
      googleAnalyticsId,
      { adapter: googleAnalyticsAdapter }
    );
  });

  it('should track page view', () => {
    windowService.getPathname = jest.fn(() => '/#!/components/vue/alert?some=param');
    const googleAnalyticsId = '123';
    mockGoogleAnalyticsId(googleAnalyticsId);
    analyticsService.init();
    analyticsService.trackPageView();
    expect(ganalyticsInstanceMock.trackPageview).toHaveBeenCalledTimes(1);
    expect(ganalyticsInstanceMock.trackPageview).toHaveBeenCalledWith({
      path: '/components/vue/alert'
    });
  });
});
