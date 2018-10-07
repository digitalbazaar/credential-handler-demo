/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global navigator */
'use strict';

export async function activate(mediatorOrigin) {
  console.log('credential handler activating!');
  const CredentialHandler = navigator.credentialsPolyfill.CredentialHandler;
  const self = new CredentialHandler(mediatorOrigin);

  self.addEventListener('credentialrequest', handleCredentialEvent)
  self.addEventListener('credentialstore', handleCredentialEvent);

  await self.connect();
  console.log('credential handler connected');
}

function handleCredentialEvent(event) {
  event.respondWith(new Promise(async (resolve, reject) => {
    // handle request for ID and public key (typical login)
    if(event.type === 'credentialrequest') {
      let query = event.credentialRequestOptions.web.VerifiableProfile;
      query = Object.assign({}, query);
      delete query['@context'];
      // use default hint key for demo if a specific one was not chosen
      const hintKey = event.hintKey || 'did:method1:1234-1234-1234-1234';
      if('id' in query && 'publicKey' in query &&
        Object.keys(query).length === 2) {
        // cryptokey request, return verifiable profile immediately
        return resolve({
          dataType: 'VerifiableProfile',
          data: {
            '@context': 'https://w3id.org/identity/v1',
            id: hintKey,
            // TODO: add public key credential
            // credential: ...
          }
        });
      }
    }

    // handle other requests that require a UI
    let windowClient;
    let listener;
    window.addEventListener('message', listener = e => {
      if(!(e.source === windowClient &&
        e.origin === window.location.origin)) {
        return;
      }

      if(e.data.type === 'request') {
        console.log('sending credential event data to UI window...');
        // send event data to UI window
        return windowClient.postMessage({
          type: event.type,
          credentialRequestOrigin: event.credentialRequestOrigin,
          credentialRequestOptions: event.credentialRequestOptions,
          credential: event.credential,
          hintKey: event.hintKey
        }, window.location.origin);
      }

      // this message is final (an error or a response)
      window.removeEventListener('message', listener);

      if(e.data.type === 'response') {
        return resolve(e.data.credential);
      }

      // assume e.data is an error
      // TODO: clean this up
      reject(e.data);
    });

    try {
      console.log('opening app window...');
      windowClient = await event.openWindow('/' + event.type);
      console.log('app window open, waiting for it to request event data...');
    } catch(err) {
      window.removeEventListener('message', listener);
      reject(err);
    }
  }));
}
