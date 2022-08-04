import testingService from '@scripts/services/testing';

describe('Logo', () => {
  let compile;

  afterEach(() => {
    testingService.clearExternalGlobalData();
  });

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      compile = () => {
        const scope = $rootScope.$new(true);
        const template = '<p-logo />';
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('img').attr('class')).toContain('p-logo');
  });

  it('should render pitsby logo by default', () => {
    const element = compile();
    expect(element.find('img').attr('src')).toEqual('/images/logo.svg');
    expect(element.find('img').attr('width')).toEqual('130px');
    expect(element.find('img').attr('height')).toEqual('40px');
  });

  it('should optionally render a custom logo', () => {
    const data = {
      custom: {
        logo: {
          filepath: '/external/dist/logo.svg'
        }
      },
      fingerprint: 123
    };
    testingService.mockExternalGlobalData(data);
    const element = compile();
    expect(element.find('img').attr('src')).toEqual('/external/dist/logo.svg?t=123');
    expect(element.find('img').attr('width')).toEqual('');
    expect(element.find('img').attr('height')).toEqual('');
  });

  it('should optionally render a custom logo with width and height', () => {
    const data = {
      custom: {
        logo: {
          filepath: '/external/dist/logo.svg',
          width: '90px',
          height: '30px'
        }
      },
      fingerprint: 123
    };
    testingService.mockExternalGlobalData(data);
    const element = compile();
    expect(element.find('img').attr('src')).toEqual('/external/dist/logo.svg?t=123');
    expect(element.find('img').attr('width')).toEqual('90px');
    expect(element.find('img').attr('height')).toEqual('30px');
  });
});
