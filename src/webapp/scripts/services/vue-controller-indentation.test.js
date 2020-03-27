import vueControllerIndentationService from './vue-controller-indentation';

describe('Vue Controller Indentation Service', () => {
  function mockStringifiedController(){
    return `{
  data() {
          return {
            email: '',
            password: '',
            gender: '',
            successMessage: null,
          };
        },
  "methods": {
    onSubmit() {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve({
                  title: 'Successful Login',
                  description: 'You are all set!'
                });
              }, 2000);
            });
          },
    onSubmitSuccess(response) {
            this.successMessage = response;
          }
  }
}`;
  }

  it('should normalize indentation', () => {
    const code = vueControllerIndentationService.normalize(mockStringifiedController());
    expect(code).toEqual(`{
  data() {
    return {
      email: '',
      password: '',
      gender: '',
      successMessage: null,
    };
  },
  "methods": {
    onSubmit() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            title: 'Successful Login',
            description: 'You are all set!'
          });
        }, 2000);
      });
    },
    onSubmitSuccess(response) {
      this.successMessage = response;
    }
  }
}`);
  });

  it('should normalize indentation when data method has no space between parenthesis and curly brace', () => {
    const raw = `{
  data(){
          return {
            email: '',
            password: '',
            gender: '',
            successMessage: null,
          };
        },
}`;
    const code = vueControllerIndentationService.normalize(raw);
    expect(code).toEqual(`{
  data(){
    return {
      email: '',
      password: '',
      gender: '',
      successMessage: null,
    };
  },
}`);
  });

  it('should return an empty string if no controller has been provided', () => {
    const code = vueControllerIndentationService.normalize();
    expect(code).toEqual('');
  });

  it('should normalize indentation for a controller that has no data method', () => {
    const stringifiedController = `{
  "methods": {
    greet() {
            console.log('Hello!');
          }
  }
}`;
    const code = vueControllerIndentationService.normalize(stringifiedController);
    expect(code).toEqual(`{
  "methods": {
    greet() {
      console.log('Hello!');
    }
  }
}`);
  });
});
