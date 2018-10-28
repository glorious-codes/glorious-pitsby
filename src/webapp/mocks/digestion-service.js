export class DigestionServiceMock {
  constructor(responseType, response){
    this.responseType = responseType;
    this.response = response;
    this.request = jest.fn((action, options) => {
      if(this.responseType == 'success') {
        options.success(this.response);
      }
      if(this.responseType == 'error')
        options.error(this.response);
    });
  }
}
