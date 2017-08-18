/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global navigator */
'use strict';

export default {
  controller: Ctrl,
  templateUrl: 'angular-credential-repository/home-component.html'
};

/* @ngInject */
function Ctrl() {
  const self = this;

  self.install = async () => {
    console.log('installing...');
    try {
      await install();
      console.log('installation complete.');
    } catch(e) {
      console.error('installation failed,', e);
    }
  };

  self.uninstall = async () => {
    console.log('uninstalling...');
    try {
      await uninstall();
      console.log('uninstallation complete.');
    } catch(e) {
      console.error('uninstallation failed,', e);
    }
  };
}

async function install() {
  const CredentialHandlers = navigator.credentialsPolyfill.CredentialHandlers;
  const CredentialManager = navigator.credentialsPolyfill.CredentialManager;

  // ensure permission has been granted to add a credential hint
  const result = await CredentialManager.requestPermission();
  if(result !== 'granted') {
    throw new Error('Permission denied.');
    return;
  }

  // get payment handler registration
  const registration = await CredentialHandlers.register('/credential-handler');

  console.log('adding hints');
  await addHints(registration);
  console.log('credential hints added');
}

async function uninstall() {
  const CredentialHandlers = navigator.credentialsPolyfill.CredentialHandlers;
  const CredentialManager = navigator.credentialsPolyfill.CredentialManager;

  // ensure permission has been granted to add a credential hint
  const result = await CredentialManager.requestPermission();
  if(result !== 'granted') {
    throw new Error('Permission denied.');
  }

  // unregister credential handler registration
  await CredentialHandlers.unregister('/credential-handler');
  console.log('credential handler unregistered');
}

async function addHints(registration) {
  return Promise.all([
    registration.credentialManager.hints.set(
      'default',
      {
        name: 'My Foo Identity',
        enabledTypes: ['verifiableProfile'],
        capabilities: {
          verifiableProfileId: 'did:method1:1234-1234-1234-1234'
        }
      })
    ]);
}
