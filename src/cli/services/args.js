const _public = {};

_public.getCliArgs = argName => {
  const allArgs = process.argv.slice(2);
  return argName ? findArg(argName, allArgs): allArgs;
};

function findArg(argName, allArgs){
  for (var i = 0; i < allArgs.length; i++) {
    const arg = buildArgObject(allArgs[i]);
    if(arg.name == argName)
      return arg.value;
  }
}

function buildArgObject(arg){
  const argKeyValuePair = arg.split('=');
  return {
    name: argKeyValuePair[0],
    value: argKeyValuePair[1] || true
  };
}

module.exports = _public;
