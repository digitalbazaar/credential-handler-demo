/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global navigator */
'use strict';

export default {
  controller: Ctrl,
  templateUrl: 'angular-credential-verifier/home-component.html'
};

/* @ngInject */
function Ctrl($scope) {
  const self = this;
  const credentials = navigator.credentialsPolyfill.credentials;

  self.request = async () => {
    try {
      self.credential = await credentials.get({
        web: {
          VerifiableProfile: {
            '@context': {
              'br': 'urn:bedrock:',
              'cred': 'https://w3id.org/credentials#'
            },
            'br:test:passport': {'cred:isOptional': true}
          }
        }
      });
      console.log('credential received by verifier', self.credential);
      $scope.$apply();
    } catch(e) {
      console.error(e);
    }
  };
}
