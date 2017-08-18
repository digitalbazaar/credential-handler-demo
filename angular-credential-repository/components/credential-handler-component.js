/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import {activate} from './credential-handler';

export default {
  controller: Ctrl,
  template: '<div></div>'
};

let handlerActivated = false;

/* @ngInject */
function Ctrl() {
  console.log('loaded credential handler component');
  if(!handlerActivated) {
    console.log('activating handler');
    activate();
    handlerActivated = true;
  }
}
