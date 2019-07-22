import { idService } from '@scripts/services/id';
import windowService from '@scripts/services/window';

const _public = {};

const subscribers = [];

_public.init = () => {
  windowService.onScroll(onWindowScroll);
};

_public.subscribe = (element, onShowUp) => {
  setTimeout(() => handleShowUpCallback(element, onShowUp));
  return addSubscriber(element, onShowUp);
};

_public.unsubscribe = subscriberId => {
  subscribers.splice(findSubscriberById(subscriberId), 1);
};

function addSubscriber(element, onShowUp){
  const id = idService.generate();
  subscribers.push({ id, element, onShowUp });
  return id;
}

function findSubscriberById(id){
  return subscribers.find(subscriber => subscriber.id === id);
}

function onWindowScroll(){
  subscribers.forEach(({ element, onShowUp }) => handleShowUpCallback(element, onShowUp));
}

function handleShowUpCallback(element, callback){
  if(windowService.isElementAbovePageFold(element))
    callback();
}

_public.init();

export default _public;
