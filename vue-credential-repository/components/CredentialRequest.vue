<template>
  <q-page
    class="column gutter-lg"
    style="background-color: white; height: 100vh"
    padding>
    <div v-if="loading" class="row">
      <span>Loading credential request details...</span>
    </div>
    <div v-else-if="credential" class="column gutter-sm">
      <div class="row justify-center">Do you want to send these credentials?</div>
      <div class="row justify-center">
        <credential-card :credential="credential" />
        <!-- div>{{credential}}</div -->
      </div>
      <div class="row justify-center">
        <q-btn
          class="q-mr-sm"
          icon="fa-times"
          color="red"
          :disabled="loading"
          label="No"
          @click="cancel()" />
        <q-btn
          icon="fa-check"
          color="green"
          :disabled="loading"
          label="Yes"
          @click="send()" />
      </div>
    </div>
    <div v-else class="row">
      <div>You do not have the credentials required by the verifier. Make
        sure you visit the demo issuer website prior to using this
        identity.</div>
      <q-btn icon="fa-times" color="primary" :disabled="loading"
        label="Ok" @click="cancel()"/>
    </div>
    <div class="row justify-center">
      <p>
        This is a credential repository (aka wallet) demonstration website. It
        has been loaded during a credential request from a credential verifier
        website.
        <a href="" @click.stop.prevent="showDetails=!showDetails">Show technical details</a>
      </p>
    </div>
    <div v-if="showDetails" class="row col justify-center">
      <p>This website uses the Credential Handler API polyfill. It calls
      code that looks like this to receive a credential request:</p>
      <pre>
        const handler = new CredentialHandler(MEDIATOR_ORIGIN);

        handler.addEventListener('credentialrequest', event => {
          event.respondWith(new Promise(async (resolve, reject) => {
            window.addEventListener('message', e => {
              // wait for message from the window we opened with
              // credential choice
              resolve(e.data.credential);
            });

            // open a window (with the content you see above)
            const windowClient = await event.openWindow('/credentialrequest');
          }));
        });
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

import axios from 'axios';
import localforage from 'localforage';
import CredentialCard from './CredentialCard.vue';

export default {
  name: 'CredentialRequest',
  components: {CredentialCard},
  mounted() {
    const self = this;
    self.loading = true;

    window.addEventListener('message', async event => {
      console.log('UI window got credential request', event.data);
      self.credentialRequestOptions = event.data.credentialRequestOptions;
      self.domain = event.data.credentialRequestOrigin;
      if(typeof document.hasStorageAccess === 'function') {
        // webkit browsers need to use a database for storage due to cookie
        // partitioning
        try {
          const response = await axios.get(
            '/credentials/' + encodeURIComponent(event.data.hintKey));
          self.credential = response.data;
        } catch(e) {
          self.credential = null;
        }
      } else {
        const storage = localforage.createInstance({name: 'credentials'});
        self.credential = await storage.getItem(event.data.hintKey);
      }
      self.loading = false;
    });

    // request credential request
    window.parent.postMessage({type: 'request'}, window.location.origin);

    console.log('loaded credential request UI');
  },
  data() {
    return {
      loading: true,
      credential: null,
      domain: '',
      credentialRequestOptions: null,
      showDetails: false
    };
  },
  methods: {
    cancel() {
      this.loading = true;
      window.parent.postMessage({
        type: 'response',
        credential: null
      }, window.location.origin);
    },
    send() {
      this.loading = true;
      window.parent.postMessage({
        type: 'response',
        credential: {
          dataType: 'VerifiableProfile',
          data: {
            '@context': 'https://w3id.org/credentials/v1',
            id: this.credential.claim.id,
            credential: [{
              '@graph': this.credential
            }],
            signature: {
              type: 'RsaSignature2017',
              created: '2017-08-09T01:02:03Z',
              creator: 'did:736f1d73-f1d8-42bb-9145-3e30062fbd15/keys/1',
              domain: this.domain,
              signatureValue: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz01234567890ABCDEFGHIJKLM=='
            }
          }
        }
      }, window.location.origin);
    }
  }
};
</script>
<style>
</style>
