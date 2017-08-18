/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global navigator */
'use strict';

import * as polyfill from 'credential-mediator-polyfill';
import {utils} from 'web-request-rpc';

// TODO: import from angular-web-request or something else?
//import {PermissionDialogComponent} from 'angular-web-request';

export default {
  controller: Ctrl,
  templateUrl: 'angular-credential-mediator-site/mediator-component.html'
};

/* @ngInject */
function Ctrl($location, $scope) {
  const self = this;
  self.permissions = [{
    name: 'Manage credentials',
    icon: 'fa fa-id-card-o'
  }];

  if(window.location.ancestorOrigins &&
    window.location.ancestorOrigins.length > 0) {
    self.relyingOrigin = window.location.ancestorOrigins[0];
  } else {
    const query = $location.search();
    self.relyingOrigin = query.origin;
  }

  self.relyingDomain = utils.parseUrl(self.relyingOrigin).hostname;

  self.accept = async () => {
    self.permissionRequest('granted');
    self.display = null;
    await navigator.credentialMediator.hide();
  };

  self.deny = async () => {
    self.permissionRequest('denied');
    self.display = null;
    await navigator.credentialMediator.hide();
  };

  self.selectHint = async (selection) => {
    self.display = null;
    let response;
    try {
      response = await navigator.credentialMediator.ui.selectCredentialHint(
        selection);
      console.log('response', response);
    } catch(e) {
      console.error(e);
      self.credentialOperationPromise.reject(e);
    }
    if(response) {
      self.credentialOperationPromise.resolve(response);
    }
    await navigator.credentialMediator.hide();
  };

  (async () => {
    try {
      await polyfill.load({
        relyingOrigin: self.relyingOrigin,
        requestPermission,
        getCredential,
        storeCredential
      });
      console.log('credential mediator site loaded polyfill');
    } catch(e) {
      console.error('credential mediator site failed to load polyfill');
      console.error(e);
    }
  })();

  async function requestPermission(permissionDesc) {
    // prep display
    self.display = 'permissionRequest';
    const promise = new Promise(resolve => {
      self.permissionRequest = state => resolve({state: state});
    });
    $scope.$apply();

    // show display and return promise
    await navigator.credentialMediator.show();
    return promise;
  }

  async function getCredential(operationState) {
    // prep display
    self.display = 'credentialRequest';
    self.credentialRequestOptions = operationState.credentialRequestOptions;
    self.loading = true;
    const promise = new Promise((resolve, reject) => {
      self.credentialOperationPromise = {resolve, reject};
    });
    $scope.$apply();

    // show display
    await navigator.credentialMediator.show();

    // get matching hints
    const hintOptions = await navigator.credentialMediator.ui
      .matchCredential(operationState.credential);
    self.hintOptions = hintOptions.map(
      option => Object.assign({
        hostname: utils.parseUrl(option.credentialHandler).hostname
      }, option));
    self.loading = false;
    $scope.$apply();

    console.log('hints', self.hintOptions);

    return promise;
  }

  async function storeCredential(operationState) {
    // prep display
    self.display = 'credentialStore';
    self.credential = operationState.credential;
    self.loading = true;
    const promise = new Promise((resolve, reject) => {
      self.credentialOperationPromise = {resolve, reject};
    });
    $scope.$apply();

    // show display
    await navigator.credentialMediator.show();

    // get matching hints
    const hintOptions = await navigator.credentialMediator.ui
      .matchCredential(operationState.credential);
    self.hintOptions = hintOptions.map(
      option => Object.assign({
        hostname: utils.parseUrl(option.credentialHandler).hostname
      }, option));
    self.loading = false;
    $scope.$apply();

    console.log('hints', self.hintOptions);

    return promise;
  }
}
