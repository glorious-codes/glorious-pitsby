export class PromiseMock {
  constructor(responseType, response, shouldAbortRequest){
    this.responseType = responseType;
    this.response = response;
    this.shouldAbortRequest = shouldAbortRequest;
  }
  then(successCallback, errorCallback){
    if(!this.shouldAbortRequest)
      return handleResponse(this.responseType, this.response, {
        successCallback,
        errorCallback
      });
  }
}

function handleResponse(responseType, response, options){
  return responseType == 'success' ?
    options.successCallback(response) :
    options.errorCallback(response);
}
