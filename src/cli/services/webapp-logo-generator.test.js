const fs = require('fs');
const path = require('path');
const { fileService } = require('./file');
const webappLogoGenerator = require('./webapp-logo-generator');
const logoTemplateDirectory = path.join(__dirname, '../../webapp/scripts/components/logo');
const logoTemplate = fs.readFileSync(`${logoTemplateDirectory}/logo-template.html`, 'utf-8');

describe('Webapp Logo Generator', () => {
  function getLogoComponentTemplateFullPath(){
    return `${logoTemplateDirectory}/logo.html`;
  }

  beforeEach(() => {
    fileService.readSync = jest.fn(() => logoTemplate);
    fileService.write = jest.fn();
  });

  it('should write logo component template with the appropriate filepath', () => {
    webappLogoGenerator.init({});
    expect(fileService.write.mock.calls[0][0]).toEqual(getLogoComponentTemplateFullPath());
  });

  it('should write logo template without style attribute if no custom logo has been passed', () => {
    webappLogoGenerator.init({});
    expect(fileService.write.mock.calls[0][1].trim()).toEqual('<div class="p-logo" ></div>');
  });

  it('should write logo template with style attribute if a custom logo has been passed', () => {
    webappLogoGenerator.init({
      logo: { filepath: './dist/images/logo.svg', width: '190px', height: '30px' }
    });
    const styles = 'background-image: url(\'external/dist/images/logo.svg\'); width: 190px; height: 30px';
    const logoMarkup = `<div class="p-logo" style="${styles}"></div>`;
    expect(fileService.write.mock.calls[0][1].trim()).toEqual(logoMarkup);
  });

  it('should log an error if custom logo has missing attributes', () => {
    const errorMessage = 'Custom logo must have "filepath", "width" and "height".';
    console.error = jest.fn();
    webappLogoGenerator.init({ logo: {} });
    expect(console.error).toHaveBeenCalledWith(errorMessage);
  });
});
