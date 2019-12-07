const path = require('path');
const { fileService } = require('./file');

const _public = {};

_public.init = customConfig => {
  const customLogo = customConfig.logo;
  const styleAttribute = buildStyleAttribute(customLogo);
  return writeCustomStylesOnLogoTemplate(getLogoComponentTemplate(), styleAttribute);
};

function getLogoComponentTemplate(){
  return fileService.readSync(buildLogoFullFilepath('logo-template.html'));
}

function buildLogoFullFilepath(filename){
  return path.join(__dirname, `../../webapp/scripts/components/logo/${filename}`);
}

function buildStyleAttribute(customLogo){
  const styles = buildLogoStyle(customLogo);
  return customLogo && styles ? `style="${styles}"` : '';
}

function buildLogoStyle(customLogo){
  if(!customLogo) return '';
  if(!hasAllLogoAttributes(customLogo)) {
    console.error('Custom logo must have "filepath", "width" and "height".');
    return '';
  }
  return stringifyLogoStyle(customLogo);
}

function stringifyLogoStyle(customLogo){
  const style = [];
  style.push(`background-image: url('${buildLogoImageUrl(customLogo)}')`);
  style.push(`width: ${customLogo.width}`);
  style.push(`height: ${customLogo.height}`);
  return style.join('; ');
}

function buildLogoImageUrl(customLogo){
  const fingerprint = Date.now();
  return path.join('external', `${customLogo.filepath}?t=${fingerprint}`);
}

function hasAllLogoAttributes(customLogo){
  return  customLogo.filepath &&
          customLogo.width &&
          customLogo.height;
}

function writeCustomStylesOnLogoTemplate(template, styleAttribute){
  return new Promise((resolve, reject) => {
    fileService.write(
      buildLogoFullFilepath('logo.html'),
      template.replace('style=""', styleAttribute),
      resolve,
      reject
    );
  });
}

module.exports = _public;
