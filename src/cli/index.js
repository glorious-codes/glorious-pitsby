#!/usr/bin/env node
const argsService = require('./services/args');
const commands = require('./commands');

const HELPER_TEXT = 'Try "pitsby --help" to see available commands.';

const _public = {};

_public.init = () => {
  const args = getArgs();
  const commandName = getCommandName(args[0]);
  if(commandName)
    return handleCommand(commandName, args);
  return console.log(`No command given. ${HELPER_TEXT}`);
};

function getArgs(){
  return argsService.getCliArgs();
}

function getCommandName(arg){
  if(isFlagArg(arg, 'help'))
    return 'help';
  if(isFlagArg(arg, 'version'))
    return 'version';
  return arg;
}

function isFlagArg(arg, flag){
  const letter = flag[0];
  return arg == `-${letter}` || arg == `--${flag}`;
}

function handleCommand(commandName, args){
  const command = commands[commandName];
  if(command)
    return command.exec(args.slice(1));
  return console.log(`Unknown command "${commandName}". ${HELPER_TEXT}`);
}

_public.init();

module.exports = _public;
