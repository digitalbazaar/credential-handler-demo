/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global navigator */
'use strict';

export default {
  controller: Ctrl,
  templateUrl: 'angular-credential-issuer/home-component.html'
};

/* @ngInject */
function Ctrl($scope) {
  const self = this;
  const credentials = navigator.credentialsPolyfill.credentials;
  const WebCredential = navigator.credentialsPolyfill.WebCredential;

  self.store = async () => {
    try {
      const credential = new WebCredential('verifiableProfile', {
        '@context': 'https://w3id.org/credentials/v1',
        id: 'did:method1:1234-1234-1234-1234',
        name: 'Pat Doe'
      });
      self.credential = await credentials.store(credential);
      console.log('credential stored', self.credential);
      $scope.$apply();
    } catch(e) {
      console.error(e);
    }
  };
}
