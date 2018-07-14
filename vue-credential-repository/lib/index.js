/*
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');
require('bedrock-views');
require('bedrock-webpack');
require('bedrock-express');
const database = require('bedrock-mongodb');
const {promisify} = require('util');

// load config
require('./config');

bedrock.events.on('bedrock-mongodb.ready', async () => {
  await promisify(database.openCollections)(['credential']);

  // TODO: make `capped` so database doesn't fill up
  await promisify(database.createIndexes)([{
    collection: 'credential',
    fields: {id: 1},
    options: {unique: true, background: false}
  }]);
});

bedrock.events.on('bedrock-express.configure.routes', app => {
  app.post('/credentials/:profileId', async (req, res, next) => {
    const id = req.param('profileId');

    try {
      await database.collections.credential.update({
        id: database.hash(id)
      }, {
        $set: {
          id: database.hash(id),
          credential: req.body
        }
      }, Object.assign({upsert: true}, database.writeOptions));
    } catch(e) {
      return next(e);
    }

    res.status(204).end();
  });

  app.get('/credentials/:profileId', async (req, res, next) => {
    const id = req.param('profileId');

    let record;
    try {
      record = await database.collections.credential.findOne(
        {id: database.hash(id)}, {_id: 0, credential: 1});
    } catch(e) {
      return next(e);
    }

    if(!record) {
      return res.status(404).end();
    }

    res.json(record.credential);
  });
});
