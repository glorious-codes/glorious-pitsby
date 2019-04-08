import metricsIdsService from '@data/metrics-ids';
import dateService from '@scripts/services/date';
import analyticsService from './analytics';

describe('Analytics Service', () => {
  const GOOGLE_ANALYTICS_ID_MOCK = '123';
  let createElementMock;

  function mockCreateElement(){
    return {
      setAttribute: jest.fn()
    };
  }

  function mockDate(){
    return new Date(2019, 3, 7);
  }

  beforeEach(() => {
    createElementMock = mockCreateElement();
    document.createElement = jest.fn(() => createElementMock);
    document.head.appendChild = jest.fn();
    dateService.getNow = jest.fn(() => mockDate());
    metricsIdsService.get = jest.fn(() => {
      return {
        googleAnalyticsId: GOOGLE_ANALYTICS_ID_MOCK
      };
    });
  });

  afterEach(() => {
    delete window.dataLayer;
    window.location.hash = '';
  });

  it('should get analytics thirdy party code asynchronously', () => {
    analyticsService.init();
    expect(createElementMock.setAttribute).toHaveBeenCalledWith('async', 'true');
  });

  it('should get analytics thirdy party code passing analytics id', () => {
    analyticsService.init();
    expect(createElementMock.setAttribute).toHaveBeenCalledWith(
      'src',
      `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID_MOCK}`
    );
  });

  it('should append script tag to get analytics thirdy party code on head', () => {
    analyticsService.init();
    expect(typeof document.head.appendChild.mock.calls[0][0]).toEqual('object');
  });

  it('should configure analytics settings after append script tag on head', () => {
    window.location.hash = '#!/home';
    analyticsService.init();
    expect(window.dataLayer[0][0]).toEqual('js');
    expect(window.dataLayer[0][1]).toEqual(mockDate());
    expect(window.dataLayer[1][0]).toEqual('config');
    expect(window.dataLayer[1][1]).toEqual(GOOGLE_ANALYTICS_ID_MOCK);
    expect(window.dataLayer[1][2]).toEqual({page_path: '/home'});
  });

  it('should track page view', () => {
    const path = '/author';
    window.location.hash = `#!${path}`;
    analyticsService.trackPageView();
    expect(window.dataLayer[0][0]).toEqual('config');
    expect(window.dataLayer[0][1]).toEqual(GOOGLE_ANALYTICS_ID_MOCK);
    expect(window.dataLayer[0][2]).toEqual({page_path: path});
  });
});
