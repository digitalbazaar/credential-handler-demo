/*!
 * New BSD License (3-clause)
 * Copyright (c) 2017-2018, Digital Bazaar, Inc.
 * All rights reserved.
 */
'use strict';

import * as brVue from 'bedrock-vue';
import * as polyfill from 'credential-handler-polyfill';
import {activate as activateHandler} from './credential-handler';
import iconSet from 'quasar-framework/icons/fontawesome';
import BrRoot from './BrRoot.vue';
import CredentialRequest from './CredentialRequest.vue';
import CredentialStore from './CredentialStore.vue';
import Home from './Home.vue';
import Quasar from 'quasar-framework';
import Vue from 'vue';
import VueRouter from 'vue-router';

// install all plugins
Vue.use(brVue);

// replace default `br-root` with a custom one
Vue.component('br-root', BrRoot);

console.log('credential repository loading at ', window.location.href);

const MEDIATOR_ORIGIN = window.data['authorization-io'].baseUri;

brVue.setRootVue(async () => {
  await polyfill.loadOnce(
    MEDIATOR_ORIGIN + '/mediator?origin=' +
    encodeURIComponent(window.location.origin));

  if(window.location.pathname === '/credential-handler') {
    // activate headless handler; do not bootstrap Vue app
    activateHandler(MEDIATOR_ORIGIN);
    return false;
  }

  const router = new VueRouter({
    mode: 'history',
    routes: [{
      path: '/',
      component: Home,
      meta: {
        title: 'Credential Repository Example'
      }
    }, {
      path: '/credentialrequest',
      component: CredentialRequest,
      meta: {
        title: 'Credential Wallet'
      }
    }, {
      path: '/credentialstore',
      component: CredentialStore,
      meta: {
        title: 'Credential Wallet'
      }
    }]
  });

  Quasar.icons.set(iconSet);
  //Quasar.utils.colors.setBrand('primary', '#ffffff');

  const BrApp = Vue.component('br-app');
  return new BrApp({
    router
  });
});
