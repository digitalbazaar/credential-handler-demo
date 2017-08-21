/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';
import * as bedrock from 'bedrock-angular';
import * as polyfill from 'credential-handler-polyfill';
import HomeComponent from './home-component';

'use strict';

const module = angular.module('angular-credential-verifier', []);
module.component('cvHome', HomeComponent);

bedrock.setRootModule(module);

const MEDIATOR_ORIGIN = 'https://credential.mediator.dev:15443';
//const MEDIATOR_ORIGIN = 'https://credential-mediator.demo.digitalbazaar.com';

const loadPolyfillPromise = polyfill.loadOnce(
  MEDIATOR_ORIGIN + '/mediator?origin=' +
  encodeURIComponent(window.location.origin));

/* @ngInject */
module.config($routeProvider => {
  $routeProvider
    .when('/', {
      title: 'Basic Verifier Example',
      template: '<cv-home></cv-home>',
      resolve: {
        polyfill($q) {
          return $q.resolve(loadPolyfillPromise);
        }
      }
    });
});
