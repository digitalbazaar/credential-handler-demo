/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';
import * as bedrock from 'bedrock-angular';
import HandlerWindowHeaderComponent from './handler-window-header-component.js';
import HomeComponent from './home-component.js';
import MediatorComponent from './mediator-component.js';

'use strict';

const module = angular.module(
  'angular-credential-mediator-site', ['web-request-mediator']);
module.component('cmHandlerWindowHeader', HandlerWindowHeaderComponent);
module.component('cmHome', HomeComponent);
module.component('cmMediator', MediatorComponent);

bedrock.setRootModule(module);

/* @ngInject */
module.config($routeProvider => {
  $routeProvider
    .when('/', {
      title: 'Credential Mediator Example',
      template: '<cm-home></cm-home>'
    })
    .when('/mediator', {
      title: 'Credential Mediator',
      template: '<cm-mediator></cm-mediator>'
    });
});
