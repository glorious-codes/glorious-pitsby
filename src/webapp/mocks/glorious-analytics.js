export const ganalyticsInstanceMock = {
  init: jest.fn(),
  trackPageview: jest.fn()
};

export const GAnalyticsMock = jest.fn(() => ganalyticsInstanceMock);
