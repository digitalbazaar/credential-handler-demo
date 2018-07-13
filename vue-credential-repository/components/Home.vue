<template>
  <q-page
    class="column gutter-md"
    style="background-color: white; height: 100vh"
    padding>
    <div class="row justify-center">
      <div>
        <h4 class="text-center">Credential Handler</h4>
        <div class="row justify-center gutter-sm">
          <q-btn
            class="q-mr-sm"
            color="primary"
            :disabled="installed"
            label="Install"
            @click="install()" />
          <q-btn
            color="red"
            :disabled="!installed"
            label="Uninstall"
            @click="uninstall()" />
        </div>
      </div>
    </div>
    <div v-if="installed" class="row justify-center">
      <div style="border: 1px solid lightgray; padding: 20px">
        <i class="fa fa-check fa-lg" style="color: green; vertical-align: 0; margin-right: 5px"></i>
        <span style="font-size: 20px">Credential handler installed! Three
        demo identities have been added. Please
        visit the <a href="https://credential-issuer.demo.digitalbazaar.com">Example Credential Issuer</a>
        to receive a demo credential.</span>
      </div>
    </div>
    <div class="row justify-center">
      This is a credential repository (aka wallet) demonstration website. It
      allows you to register a "credential handler" that can handle credential
      requests and credential storage requests from other websites.
    </div>
    <div class="row justify-center">
      <a href="" @click.stop.prevent="showDetails=!showDetails">Show technical details</a>
    </div>
    <div v-if="showDetails" class="row col justify-center">
      <p>This website uses the Credential Handler API polyfill. It calls
      code that looks like this to add choices for users to select to fulfill
      requests for credentials:</p>
      <pre>
      async function install() {
        const result = await CredentialManager.requestPermission();
        if(result !== 'granted') {
          throw new Error('Permission denied.');
          return;
        }

        // get credential handler registration
        const registration = await CredentialHandlers.register(
          '/credential-handler');

        await addHints(registration);
      }

      function addHints(registration) {
        return Promise.all([
          registration.credentialManager.hints.set(
            // this could be a UUID or any 'key'
            // understood by this wallet
            'default',
            {
              name: 'One of my many identities',
              enabledTypes: ['VerifiableProfile'],
              match: {
                VerifiableProfile: {
                  id: 'did:method1:1234-1234-1234-1234'
                }
              }
            })
          ]);
      }
      </pre>
    </div>
  </q-page>
</template>
<script>
/*!
 * New BSD License (3-clause)
 * Copyright (c) 2017-2018, Digital Bazaar, Inc.
 * All rights reserved.
 */
'use strict';

export default {
  name: 'Home',
  async mounted() {
    try {
      const registration = await getRegistration();
      await registration.credentialManager.hints.keys();
      this.registration = registration;
    } catch(e) {
      // assume permission denied for demo
    }
    console.log('installed', !!this.registration);
  },
  data() {
    return {
      showDetails: false,
      registration: null
    };
  },
  computed: {
    installed() {
      return !!this.registration;
    },
    uninstalled() {
      return !this.registration;
    }
  },
  methods: {
    async install() {
      try {
        this.registration = null;
        this.registration = await install();
      } catch(e) {
        console.error('installation failed,', e);
      }
    },
    async uninstall() {
      try {
        await uninstall();
        this.registration = null;
      } catch(e) {
        console.error('uninstallation failed,', e);
      }
    }
  }
};

async function getRegistration() {
  const CredentialHandlers = navigator.credentialsPolyfill.CredentialHandlers;

  let registration;
  try {
    // get credential handler registration
    registration = await CredentialHandlers.register('/credential-handler');
  } catch(e) {
    // ignore
    console.error(e);
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
        name: 'My social wallet',
        enabledTypes: ['VerifiableProfile'],
        match: {
          VerifiableProfile: {
            id: 'did:method1:1234-1234-1234-1234'
          }
        }
      }),
    registration.credentialManager.hints.set(
      'did:method1:1234-1234-1234-1235', {
        name: 'My business wallet',
        enabledTypes: ['VerifiableProfile'],
        match: {
          VerifiableProfile: {
            id: 'did:method1:1234-1234-1234-1235'
          }
        }
      }),
    registration.credentialManager.hints.set(
      'did:method1:1234-1234-1234-1236', {
        name: 'My account for this website',
        enabledTypes: ['VerifiableProfile'],
        match: {
          VerifiableProfile: {
            id: 'did:method1:1234-1234-1234-1236'
          }
        }
      })
    ]);
}
</script>
<style>
</style>
