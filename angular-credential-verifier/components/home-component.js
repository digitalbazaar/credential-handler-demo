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

  self.login = async () => {
    try {
      self.credential = await credentials.get({
        web: {
          verifiableProfile: {
            fooAttribute: true
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
