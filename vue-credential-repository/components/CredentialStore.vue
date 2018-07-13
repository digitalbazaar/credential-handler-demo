<template>
  <q-page
    class="column gutter-lg"
    style="background-color: white; height: 100vh"
    padding>
    <div v-if="loading" class="row">
      <span>Loading credential request details...</span>
    </div>
    <div v-else-if="profile" class="column gutter-sm">
      <div class="row justify-center">Do you want to store these credentials?</div>
      <div class="row justify-center">
        <credential-card :credential="credential" />
        <!-- div>{{profile}}</div -->
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
          @click="store()" />
      </div>
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
      code that looks like this to receive a credential storage request:</p>
      <pre>
        const handler = new CredentialHandler(MEDIATOR_ORIGIN);

        handler.addEventListener('credentialstore', event => {
          event.respondWith(new Promise(async (resolve, reject) => {
            window.addEventListener('message', e => {
              // wait for message from the window we opened with what was stored
              resolve(e.data.credential);
            });

            // open a window (with the content you see above)
            const windowClient = await event.openWindow('/credentialstore');
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

import localforage from 'localforage';
import CredentialCard from './CredentialCard.vue';

export default {
  name: 'CredentialStore',
  components: {CredentialCard},
  mounted() {
    const self = this;
    self.loading = true;

    window.addEventListener('message', async event => {
      console.log('UI window got credential storage request', event.data);
      self.profile = event.data.credential.data;
      self.credential = self.profile.credential[0]['@graph'];
      console.log('credential', self.credential);
      self.loading = false;
    });

    // request storage request
    window.parent.postMessage({type: 'request'}, window.location.origin);

    console.log('loaded credential storage UI');
  },
  data() {
    return {
      loading: true,
      credential: null,
      profile: null,
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
    async store() {
      this.loading = true;
      const storage = localforage.createInstance({name: 'credentials'});
      await storage.setItem(this.profile.id, this.credential);

      window.parent.postMessage({
        type: 'response',
        credential: {
          dataType: 'VerifiableProfile',
          data: this.profile
        }
      }, window.location.origin);
    }
  }
};
</script>
<style>
</style>
