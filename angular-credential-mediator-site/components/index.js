/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';
import * as bedrock from 'bedrock-angular';
import HomeComponent from './home-component';
import MediatorComponent from './mediator-component';

'use strict';

const module = angular.module(
  'angular-credential-mediator-site', ['web-request-mediator']);
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
