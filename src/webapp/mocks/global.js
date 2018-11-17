import project from '../../../project.json';
import angular from 'angular';
import 'angular-mocks';
require(`../../../${project.scripts.source.indexTemplate}`);

global.angular = angular;
