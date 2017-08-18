/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

export default {
  controller: Ctrl,
  templateUrl: 'angular-credential-repository/credential-store-component.html'
};

/* @ngInject */
function Ctrl($scope) {
  const self = this;

  window.addEventListener('message', event => {
    console.log('frontend got credential storage request', event.data);
    self.credential = event.data;
    $scope.$apply();
  });

  self.store = () => {
    window.parent.postMessage({
      credential: self.credential
    }, window.location.origin);
  };

  (async () => {
    // request storage request
    window.parent.postMessage({type: 'request'}, window.location.origin);

    console.log('loaded credential store UI');
  })();
}
