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
    let windowClient;
    let listener;
    window.addEventListener('message', listener = e => {
      if(!(e.source === windowClient &&
        e.origin === window.location.origin)) {
        return;
      }

      if(e.data.type === 'request') {
        console.log('sending credential event data to frontend...');
        // send event data to frontend
        const message = event.type === 'credentialrequest' ?
          event.credentialRequestOptions : event.credential;
        return windowClient.postMessage(message, window.location.origin);
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
