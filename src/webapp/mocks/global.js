import project from '../../../project.json';
import angular from 'angular';
import Vue from 'vue/dist/vue.min';
import 'angular-mocks';
require(`../../../${project.scripts.source.indexTemplate}`);

global.angular = angular;
global.Vue = Vue;
