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
  self.loading = false;

  self.request = async () => {
    self.loading = true;
    try {
      self.credential = await navigator.credentials.get({
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
      self.done = true;
    } catch(e) {
      console.error(e);
    }
    self.loading = false;
    $scope.$apply();
  };
}
