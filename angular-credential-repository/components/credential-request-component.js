/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import localforage from 'localforage';

export default {
  controller: Ctrl,
  templateUrl: 'angular-credential-repository/credential-request-component.html'
};

/* @ngInject */
function Ctrl($scope) {
  const self = this;

  window.addEventListener('message', async event => {
    console.log('UI window got credential request', event.data);
    self.credentialRequestOptions = event.data.credentialRequestOptions;
    self.domain = event.data.credentialRequestOrigin;
    const storage = localforage.createInstance({name: 'credentials'});
    self.credential = await storage.getItem(event.data.hintKey);
    $scope.$apply();
  });

  self.send = () => {
    window.parent.postMessage({
      type: 'response',
      credential: {
        dataType: 'VerifiableProfile',
        data: {
          '@context': 'https://w3id.org/credentials/v1',
          id: self.credential.claim.id,
          credential: [{
            '@graph': self.credential
          }],
          signature: {
            type: 'RsaSignature2017',
            created: '2017-08-09T01:02:03Z',
            creator: 'did:736f1d73-f1d8-42bb-9145-3e30062fbd15/keys/1',
            domain: self.domain,
            signatureValue: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz01234567890ABCDEFGHIJKLM=='
          }
        }
      }
    }, window.location.origin);
  };

  // request payment request
  window.parent.postMessage({type: 'request'}, window.location.origin);

  console.log('loaded credential request UI');
}
