/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';
import * as bedrock from 'bedrock-angular';
import * as polyfill from 'credential-handler-polyfill';
import HomeComponent from './home-component';
import CredentialHandlerComponent from './credential-handler-component';
import CredentialRequestComponent from './credential-request-component';
import CredentialStoreComponent from './credential-store-component';

'use strict';

const module = angular.module('angular-credential-repository', []);
module.component('cwHome', HomeComponent);
module.component('cwCredentialHandler', CredentialHandlerComponent);
module.component('cwCredentialRequest', CredentialRequestComponent);
module.component('cwCredentialStore', CredentialStoreComponent);

bedrock.setRootModule(module);
console.log('credential repository loading at ', window.location.href);
const loadPolyfillPromise = polyfill.loadOnce();

/* @ngInject */
module.config($routeProvider => {
  $routeProvider
    .when('/', {
      title: 'Credential Repository Example',
      template: '<cw-home></cw-home>',
      resolve: {
        polyfill($q) {
          return $q.resolve(loadPolyfillPromise);
        }
      }
    })
    // TODO: Would be nice to separate out the credential handler from the
    // rest of the application as a single static page in the future because
    // it would be a better (and more efficient) example; for now it is here
    // out of convenience/speed of implementation.
    .when('/credential-handler', {
      title: 'Credential Handler',
      template: '<cw-credential-handler></cw-credential-handler>',
      resolve: {
        polyfill($q) {
          console.log('waiting to resolve credential handler route...');
          return $q.resolve(loadPolyfillPromise);
        }
      }
    })
    .when('/credential-request', {
      title: 'Credential Wallet',
      template: '<cw-credential-request></cw-credential-request>',
      resolve: {
        polyfill($q) {
          return $q.resolve(loadPolyfillPromise);
        }
      }
    })
    .when('/credential-store', {
      title: 'Credential Wallet',
      template: '<cw-credential-store></cw-credential-store>',
      resolve: {
        polyfill($q) {
          return $q.resolve(loadPolyfillPromise);
        }
      }
    });
});
