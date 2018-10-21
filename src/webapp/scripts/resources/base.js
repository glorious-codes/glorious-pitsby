import axios from 'axios';

const _public = {};

_public.get = (url, query) => {
  return request({
    url: url,
    method: 'get',
    query: query
  });
};

function request(args){
  return axios[args.method](args.url, getParams(args));
}

function getParams(args){
  if(args.query)
    return {
      params: args.query
    };
  return args.body;
}

export default _public;
