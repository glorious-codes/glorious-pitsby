export const stalyInstanceMock = {
  init: jest.fn(),
  trackPageview: jest.fn()
};

export const stalyMock = jest.fn(() => stalyInstanceMock);
