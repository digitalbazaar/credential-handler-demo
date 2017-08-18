/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';
import * as bedrock from 'bedrock-angular';
import * as polyfill from 'credential-handler-polyfill';
import HomeComponent from './home-component';

'use strict';

const module = angular.module('angular-credential-issuer', []);
module.component('ciHome', HomeComponent);

bedrock.setRootModule(module);

const loadPolyfillPromise = polyfill.loadOnce();

/* @ngInject */
module.config($routeProvider => {
  $routeProvider
    .when('/', {
      title: 'Basic Issuer Example',
      template: '<ci-home></ci-home>',
      resolve: {
        polyfill($q) {
          return $q.resolve(loadPolyfillPromise);
        }
      }
    });
});
