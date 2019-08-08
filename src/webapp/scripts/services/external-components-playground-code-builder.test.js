import externalComponentsPlaygroundDefaultCodeBuilder from '@scripts/services/external-components-playground-default-code-builder';
import externalComponentsPlaygroundCodeBuilder from './external-components-playground-code-builder';

describe('External Components Playground Code Builder', () => {
  it('should build default code if no template nor controller have been given', () => {
    externalComponentsPlaygroundDefaultCodeBuilder.build = jest.fn();
    externalComponentsPlaygroundCodeBuilder.build('vue');
    expect(externalComponentsPlaygroundDefaultCodeBuilder.build).toHaveBeenCalledWith('vue');
  });

  it('should not build default code if template and controller have been given', () => {
    const template = '<div></div>';
    const controller = 'function(){}';
    const styles = '.class { color: blue; }';
    const code = externalComponentsPlaygroundCodeBuilder.build('vue', template, controller, styles);
    expect(code).toEqual({ template, controller, styles });
  });
});
