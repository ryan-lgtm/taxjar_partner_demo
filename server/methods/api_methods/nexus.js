const Taxjar = require('taxjar');

Meteor.methods({
  async retrieveNexus(token,sessionId) {
    const client = new Taxjar({
      apiKey: token
    });

    const result = await client.nexusRegions().then(res => {
      Meteor.call('createSession', sessionId, 'Calling GET /v2/nexus/regions (https://developers.taxjar.com/api/reference/#get-list-nexus-regions) to retrieve nexus locations.');
      return res
    }).then(function(res) {
      Meteor.call('createSession', sessionId, 'Nexus locations retrieved: \n'+JSON.stringify(res, null, 4));
      return res
    }).catch(function(err) {
      Meteor.call('createSession', sessionId, 'Could not retrieve nexus locations: \n'+err);
      return err
    });

    return result;
  }
});
