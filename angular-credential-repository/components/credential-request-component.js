/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

export default {
  controller: Ctrl,
  templateUrl: 'angular-credential-repository/credential-request-component.html'
};

/* @ngInject */
function Ctrl($scope) {
  const self = this;

  window.addEventListener('message', event => {
    console.log('frontend got credential request', event.data);
    self.credentialRequestOptions = event.data;
    $scope.$apply();
  });

  self.send = () => {
    window.parent.postMessage({
      credential: {
        dataType: 'verifiableProfile',
        data: {
          '@context': 'https://w3id.org/credentials/v1',
          id: 'did:method1:1234-1234-1234-1234',
          name: 'Pat Doe'
        }
      }
    }, window.location.origin);
  };

  (async () => {
    // request payment request
    window.parent.postMessage({type: 'request'}, window.location.origin);

    console.log('loaded credential request UI');
  })();
}
