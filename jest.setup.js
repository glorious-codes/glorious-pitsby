import 'angular';
// Do not update Jest to its v27 or greater because it conflicts with angular.mocks
// angular.mock.module function vanishes from the API and all tests break.
import 'angular-mocks';
import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom';
import Vue from 'vue/dist/vue.min';
import project from './project.json';

// Import index template to register pitsby-app angular module
// and its dependencies
require(path.join(__dirname, project.scripts.webapp.source.indexTemplate));

global.Vue = Vue;
global.React = React;
global.ReactDOM = ReactDOM;