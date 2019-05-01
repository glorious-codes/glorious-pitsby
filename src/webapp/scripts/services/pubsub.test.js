import { idService } from '@scripts/services/id';
import pubsubService from './pubsub';

describe('Pubsub Service', () => {
  it('should not subscribe if event name has not been given', () => {
    console.error = jest.fn();
    const eventNameRequiredErrorMessage = '[Pubsub Service] You must pass an event name (String) as first argument.';
    const callback = jest.fn();
    pubsubService.subscribe(callback);
    expect(console.error).toHaveBeenCalledWith(eventNameRequiredErrorMessage);
  });

  it('should not subscribe if callback has not been given', () => {
    console.error = jest.fn();
    const callbackRequiredErrorMessage = '[Pubsub Service] You must pass a callback (Function) as second argument.';
    pubsubService.subscribe('testTopic');
    expect(console.error).toHaveBeenCalledWith(callbackRequiredErrorMessage);
  });

  it('should subscribe', () => {
    const eventName = 'testTopic';
    const data = {some: 'data'};
    const callback = jest.fn();
    const id = pubsubService.subscribe(eventName, callback);
    pubsubService.publish(eventName, data);
    expect(callback).toHaveBeenCalledWith(data);
    pubsubService.unsubscribe(id);
  });

  it('should only execute callbacks for the published event name', () => {
    const firstTopic = 'firstTopic';
    const secondTopic = 'secondTopic';
    const firstCallback = jest.fn();
    const secondCallback = jest.fn();
    const firstSubscriberId = pubsubService.subscribe(firstTopic, firstCallback);
    const secondSubscriberId = pubsubService.subscribe(secondTopic, secondCallback);
    pubsubService.publish(firstTopic);
    expect(firstCallback).toHaveBeenCalled();
    expect(secondCallback).not.toHaveBeenCalled();
    pubsubService.unsubscribe(firstSubscriberId);
    pubsubService.unsubscribe(secondSubscriberId);
  });

  it('should return a subscriber id on subscribe', () => {
    idService.generate = jest.fn(() => '123');
    const id = pubsubService.subscribe('testTopic', jest.fn());
    expect(id).toEqual('123');
    pubsubService.unsubscribe(id);
  });

  it('should unsubscribe', () => {
    const eventName = 'testTopic';
    const callback = jest.fn();
    const id = pubsubService.subscribe(eventName, callback);
    pubsubService.unsubscribe(id);
    pubsubService.publish(eventName);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should only unsubscribe the subscriber for the given subscriber id', () => {
    const firstTopic = 'firstTopic';
    const secondTopic = 'secondTopic';
    const firstCallback = jest.fn();
    const secondCallback = jest.fn();
    const firstSubscriberId = pubsubService.subscribe(firstTopic, firstCallback);
    const secondSubscriberId = pubsubService.subscribe(secondTopic, secondCallback);
    pubsubService.publish(firstTopic);
    expect(firstCallback).toHaveBeenCalled();
    pubsubService.unsubscribe(firstSubscriberId);
    pubsubService.publish(secondTopic);
    expect(secondCallback).toHaveBeenCalled();
    pubsubService.unsubscribe(secondSubscriberId);
  });

  it('should not unsubscribe if subscriber id has not been given', () => {
    console.error = jest.fn();
    const listenerIdRequiredErrorMessage = '[Pubsub Service] You must pass a subscriber id (String) as first argument.';
    const id = pubsubService.subscribe('testTopic', jest.fn());
    pubsubService.unsubscribe();
    expect(console.error).toHaveBeenCalledWith(listenerIdRequiredErrorMessage);
    pubsubService.unsubscribe(id);
  });
});
