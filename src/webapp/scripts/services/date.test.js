import dateService from './date';

describe('Date Service', () => {
  beforeEach(() => {
    spyOn(window, 'Date');
  });

  it('should build now date', () => {
    dateService.getNow();
    expect(window.Date).toHaveBeenCalled();
  });
});
