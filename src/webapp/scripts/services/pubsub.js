import { idService } from '@scripts/services/id';

const _public = {};

const subscribers = [];

const ERROR_MESSAGES_PREFIX = '[Pubsub Service]';

const ERROR_MESSAGES = {
  EVENT_NAME_REQUIRED: `${ERROR_MESSAGES_PREFIX} You must pass an event name (String) as first argument.`,
  CALLBACK_REQUIRED: `${ERROR_MESSAGES_PREFIX} You must pass a callback (Function) as second argument.`,
  SUBSCRIBER_ID_REQUIRED: `${ERROR_MESSAGES_PREFIX} You must pass a subscriber id (String) as first argument.`
};

_public.subscribe = (eventName, callback) => {
  if(areSubscribeArgumentsValid(eventName, callback))
    return addSubscriber({ eventName, callback });
};

_public.unsubscribe = subscriberId => {
  if(isArgumentValid(subscriberId, 'string', ERROR_MESSAGES.SUBSCRIBER_ID_REQUIRED))
    removeSubscriber(subscriberId);
};

_public.publish = (eventName, data) => {
  for (var i = 0; i < subscribers.length; i++)
    if(subscribers[i].eventName === eventName)
      subscribers[i].callback(data);
};

function areSubscribeArgumentsValid(eventName, callback){
  return  isArgumentValid(eventName, 'string', ERROR_MESSAGES.EVENT_NAME_REQUIRED)
          && isArgumentValid(callback, 'function', ERROR_MESSAGES.CALLBACK_REQUIRED);
}

function isArgumentValid(argument, argumentType, errorMessage){
  if(typeof argument === argumentType)
    return true;
  return throwTopicRequiredError(errorMessage);
}

function addSubscriber({ eventName, callback }){
  const id = idService.generate();
  subscribers.push({ id, eventName, callback });
  return id;
}

function removeSubscriber(subscriberId){
  subscribers.splice(getSubscriberIndex(subscriberId), 1);
}

function getSubscriberIndex(subscriberId){
  return subscribers.filter(subscriber => {
    return subscriber.id === subscriberId;
  });
}

function throwTopicRequiredError(message){
  console.error(message);
}

export default _public;
