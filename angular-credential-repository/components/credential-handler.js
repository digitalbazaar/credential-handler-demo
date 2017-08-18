/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global navigator */
'use strict';

export async function activate() {
  console.log('credential handler activating!');
  const CredentialHandler = navigator.credentialsPolyfill.CredentialHandler;
  const mediatorOrigin = 'https://credential.mediator.dev:15443';
  const self = new CredentialHandler(mediatorOrigin);

  self.addEventListener('credentialrequest', event => {
    console.log('got credential request event', event);

    event.respondWith(new Promise(async (resolve, reject) => {
      console.log('resolving event');
      // resolve({
      //   dataType: 'verifiableProfile',
      //   data: {
      //     id: 'did:method1:1234-1234-1234-1234',
      //     fooAttribute: 'foobar'
      //   }
      // });

      let windowClient;
      let listener;
      window.addEventListener('message', listener = function(e) {
        if(!(e.source === windowClient &&
          e.origin === window.location.origin)) {
          console.log('ignoring cross origin message');
          return;
        }

        if(e.data.type === 'request') {
          // send credential request
          console.log('sending credential request to frontend...');
          return windowClient.postMessage(
            event.credentialRequestOptions, window.location.origin);
        }

        // assume payment handler response or error
        window.removeEventListener('message', listener);
        if(e.data.hasOwnProperty('name')) {
          // assume data is an error
          // TODO: clean this up
          reject(e.data);
        } else {
          resolve(e.data.credential);
        }
      });

      try {
        console.log('opening app window...');
        windowClient = await event.openWindow('/credential-request');
        console.log('app window open, waiting to credential request to it...');
      } catch(err) {
        reject(err);
      }
    }));
    console.log('event.respondWith called');
  });

  self.addEventListener('credentialstore', event => {
    console.log('got credential store event', event);

    event.respondWith(new Promise(async (resolve, reject) => {
      console.log('resolving event');
      // resolve({
      //   data: {
      //     id: 'did:method1:1234-1234-1234-1234',
      //     fooAttribute: 'foobar'
      //   }
      // });

      let windowClient;
      let listener;
      window.addEventListener('message', listener = function(e) {
        if(!(e.source === windowClient &&
          e.origin === window.location.origin)) {
          console.log('ignoring cross origin message');
          return;
        }

        if(e.data.type === 'request') {
          // send credential storage request
          console.log('sending credential storage request to frontend...');
          return windowClient.postMessage(
            event.credential, window.location.origin);
        }

        // assume payment handler response or error
        window.removeEventListener('message', listener);
        if(e.data.hasOwnProperty('name')) {
          // assume data is an error
          // TODO: clean this up
          reject(e.data);
        } else {
          resolve(e.data.credential);
        }
      });

      try {
        console.log('opening app window...');
        windowClient = await event.openWindow('/credential-store');
        console.log(
          'app window open, waiting to credential storage request to it...');
      } catch(err) {
        reject(err);
      }
    }));
    console.log('event.respondWith called');
  });

  await self.connect();
  console.log('credential handler connected');
}
