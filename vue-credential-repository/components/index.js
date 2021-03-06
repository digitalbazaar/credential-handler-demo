/*!
 * New BSD License (3-clause)
 * Copyright (c) 2017-2018, Digital Bazaar, Inc.
 * All rights reserved.
 */
/* global window */
'use strict';

import * as brVue from 'bedrock-vue';
import * as polyfill from 'credential-handler-polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';

// install all plugins
Vue.use(brVue);

console.log('credential repository loading at ', window.location.href);

const MEDIATOR_ORIGIN = window.data['authorization-io'].baseUri;

brVue.setRootVue(async () => {
  await polyfill.loadOnce(
    MEDIATOR_ORIGIN + '/mediator?origin=' +
    encodeURIComponent(window.location.origin));

  if(window.location.pathname === '/credential-handler') {
    // activate headless handler; do not bootstrap Vue app
    const {activate: activateHandler} = await import('./credential-handler.js');
    activateHandler(MEDIATOR_ORIGIN);
    return false;
  }

  // FIXME: determine if this IE11 support code must be loaded serially
  const brQuasar = await import('bedrock-quasar');
  await brQuasar.supportIE11();

  // load dynamic imports in parallel
  const [
    Quasar,
    {default: iconSet}
  ] = await Promise.all([
    import('quasar-framework'),
    import('quasar-framework/icons/fontawesome')
  ]);

  // replace default `br-root` with a custom one
  Vue.component('br-root', () => import('./BrRoot.vue'));

  const router = new VueRouter({
    mode: 'history',
    routes: [{
      path: '/',
      component: () => import('./Home.vue'),
      meta: {
        title: 'Credential Repository Example'
      }
    }, {
      path: '/credentialrequest',
      component: () => import('./CredentialRequest.vue'),
      meta: {
        title: 'Credential Wallet'
      }
    }, {
      path: '/credentialstore',
      component: () => import('./CredentialStore.vue'),
      meta: {
        title: 'Credential Wallet'
      }
    }]
  });

  Quasar.icons.set(iconSet);
  brQuasar.theme({
    Quasar,
    brand: {}
  });

  const BrApp = Vue.component('br-app');
  return new BrApp({
    router
  });
});
