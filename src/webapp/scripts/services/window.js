const _public = {};

_public.onScroll = callback => {
  window.addEventListener('scroll', callback);
};

_public.isElementAbovePageFold = element => {
  return element.offsetTop - (_public.getInnerHeight() + _public.getPageYOffset()) < 0;
};

_public.getInnerHeight = () => {
  return window.innerHeight;
};

_public.getPageYOffset = () => {
  return window.pageYOffset;
};

_public.getHash = () => {
  return window.location.hash;
};

export default _public;
