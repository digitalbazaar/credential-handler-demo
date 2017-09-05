/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';
import * as bedrock from 'bedrock-angular';
import * as polyfill from 'credential-handler-polyfill';
import {activate as activateHandler} from './credential-handler';
import HomeComponent from './home-component';
import CredentialRequestComponent from './credential-request-component';
import CredentialStoreComponent from './credential-store-component';

'use strict';

const module = angular.module('angular-credential-repository', ['ngMaterial']);
module.component('cwHome', HomeComponent);
module.component('cwCredentialRequest', CredentialRequestComponent);
module.component('cwCredentialStore', CredentialStoreComponent);

console.log('credential repository loading at ', window.location.href);

const MEDIATOR_ORIGIN = window.data['authorization-io'].baseUri;

const loadPolyfillPromise = polyfill.loadOnce(
  MEDIATOR_ORIGIN + '/mediator?origin=' +
  encodeURIComponent(window.location.origin));

if(window.location.pathname === '/credential-handler') {
  (async () => {
    await loadPolyfillPromise;
    activateHandler(MEDIATOR_ORIGIN);
  })();
  bedrock.setRootModule(false);
} else {
  // only bootstrap AngularJS app when not using credential handler
  bedrock.setRootModule(module);
}

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
    .when('/credentialrequest', {
      title: 'Credential Wallet',
      template: '<cw-credential-request></cw-credential-request>',
      resolve: {
        polyfill($q) {
          return $q.resolve(loadPolyfillPromise);
        }
      }
    })
    .when('/credentialstore', {
      title: 'Credential Wallet',
      template: '<cw-credential-store></cw-credential-store>',
      resolve: {
        polyfill($q) {
          return $q.resolve(loadPolyfillPromise);
        }
      }
    });
});
