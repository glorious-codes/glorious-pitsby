import project from '../../../project.json';
import angular from 'angular';
import React from 'react';
import ReactDOM from 'react-dom';
import Vue from 'vue/dist/vue.min';
import 'angular-mocks';
require(`../../../${project.scripts.webapp.source.indexTemplate}`);

global.angular = angular;
global.Vue = Vue;
global.React = React;
global.ReactDOM = ReactDOM;
