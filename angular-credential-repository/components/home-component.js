/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global navigator, CredentialManager */
'use strict';

export default {
  controller: Ctrl,
  templateUrl: 'angular-credential-repository/home-component.html'
};

/* @ngInject */
function Ctrl($scope) {
  const self = this;

  let registration;

  self.$onInit = async () => {
    try {
      registration = await getRegistration();
      //self.identities = await getIdentities(registration);
      await registration.credentialManager.hints.keys();
      self.installed = true;
    } catch(e) {
      // assume permission denied for demo
      self.installed = false;
      //self.identities = [];
    }
    $scope.$apply();
  };

  self.install = async () => {
    try {
      self.installed = self.uninstalled = false;
      registration = await install();
      self.installed = true;
      $scope.$apply();
    } catch(e) {
      console.error('installation failed,', e);
    }
  };

  self.uninstall = async () => {
    try {
      self.installed = self.uninstalled = false;
      await uninstall();
      self.uninstalled = true;
      registration = null;
      $scope.$apply();
    } catch(e) {
      console.error('uninstallation failed,', e);
    }
  };
}

async function getRegistration() {
  const CredentialHandlers = navigator.credentialsPolyfill.CredentialHandlers;

  let registration;
  try {
    // get credential handler registration
    registration = await CredentialHandlers.register('/credential-handler');
  } catch(e) {
    // ignore
  }
  return registration;
}

async function install() {
  console.log('installing...');

  // ensure permission has been granted to add a credential hint
  const result = await CredentialManager.requestPermission();
  if(result !== 'granted') {
    throw new Error('Permission denied.');
  }

  // get credential handler registration
  const registration = await getRegistration();
  if(!registration) {
    throw new Error('Credential handler not registered');
  }

  console.log('adding hints');
  await addHints(registration);
  console.log('credential hints added');

  console.log('installation complete.');
  return registration;
}

async function uninstall() {
  console.log('uninstalling...');

  const CredentialHandlers = navigator.credentialsPolyfill.CredentialHandlers;

  // ensure permission has been granted to add a credential hint
  const result = await CredentialManager.requestPermission();
  if(result !== 'granted') {
    throw new Error('Permission denied.');
  }

  // unregister credential handler registration
  await CredentialHandlers.unregister('/credential-handler');
  console.log('credential handler unregistered');

  // revoke permission (useful for demonstration purposes)
  await navigator.credentialsPolyfill.permissions.revoke(
    {name: 'credentialhandler'});

  console.log('uninstallation complete.');
}

async function addHints(registration) {
  return Promise.all([
    registration.credentialManager.hints.set(
      'did:method1:1234-1234-1234-1234', {
        name: 'My social identity',
        enabledTypes: ['VerifiableProfile'],
        match: {
          VerifiableProfile: {
            id: 'did:method1:1234-1234-1234-1234'
          }
        }
      }),
    registration.credentialManager.hints.set(
      'did:method1:1234-1234-1234-1235', {
        name: 'My business identity',
        enabledTypes: ['VerifiableProfile'],
        match: {
          VerifiableProfile: {
            id: 'did:method1:1234-1234-1234-1235'
          }
        }
      }),
    registration.credentialManager.hints.set(
      'did:method1:1234-1234-1234-1236', {
        name: 'My personal identity',
        enabledTypes: ['VerifiableProfile'],
        match: {
          VerifiableProfile: {
            id: 'did:method1:1234-1234-1234-1236'
          }
        }
      })
    ]);
}
