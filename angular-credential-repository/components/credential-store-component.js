/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import localforage from 'localforage';

export default {
  controller: Ctrl,
  templateUrl: 'angular-credential-repository/credential-store-component.html'
};

/* @ngInject */
function Ctrl($scope) {
  const self = this;
  self.loading = true;

  window.addEventListener('message', event => {
    console.log('UI window got credential storage request', event.data);
    self.profile = event.data.credential.data;
    self.credential = self.profile.credential[0]['@graph'];
    console.log('credential', self.credential);
    self.loading = false;
    $scope.$apply();
  });

  self.cancel = () => {
    self.loading = true;
    window.parent.postMessage({
      type: 'response',
      credential: null
    }, window.location.origin);
  };

  self.store = async () => {
    self.loading = true;
    const storage = localforage.createInstance({name: 'credentials'});
    await storage.setItem(self.profile.id, self.credential);

    window.parent.postMessage({
      type: 'response',
      credential: {
        dataType: 'VerifiableProfile',
        data: self.profile
      }
    }, window.location.origin);
  };

  (async () => {
    // request storage request
    window.parent.postMessage({type: 'request'}, window.location.origin);

    console.log('loaded credential store UI');
  })();
}
