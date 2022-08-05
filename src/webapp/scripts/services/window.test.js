import windowService from './window';

describe('Window Service', () => {
  const { getInnerHeight, getPageYOffset } = windowService;

  function scollPageUp(offsetInPixels){
    windowService.getPageYOffset = jest.fn(() => offsetInPixels);
  }

  afterEach(() => {
    windowService.getInnerHeight = getInnerHeight;
    windowService.getPageYOffset = getPageYOffset;
  });

  it('should be able to set some window scroll listener', () => {
    const callback = jest.fn();
    window.addEventListener = jest.fn();
    windowService.onScroll(callback);
    expect(window.addEventListener).toHaveBeenCalledWith('scroll', callback);
  });

  it('should answer if an element is above the page fold', () => {
    const element = { offsetTop: 500 };
    windowService.getInnerHeight = jest.fn(() => 400);
    windowService.getPageYOffset = jest.fn(() => 0);
    expect(windowService.isElementAbovePageFold(element)).toEqual(false);
    scollPageUp(200);
    expect(windowService.isElementAbovePageFold(element)).toEqual(true);
  });

  it('should get window inner height', () => {
    expect(windowService.getInnerHeight()).toEqual(window.innerHeight);
  });

  it('should get page vertical offset', () => {
    expect(windowService.getPageYOffset()).toEqual(window.pageYOffset);
  });

  it('should get pathname', () => {
    expect(windowService.getPathname()).toEqual(window.location.pathname);
  });
});
