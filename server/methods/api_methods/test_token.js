const Taxjar = require('taxjar');

Meteor.methods({
  async testToken(token,sessionId) {
    const client = new Taxjar({
      apiKey: token
    });

    const result = await client.categories().then(res => {
      Meteor.call('createSessionEvent', sessionId, 'Calling GET /v2/categories (https://developers.taxjar.com/api/reference/#categories) to validate successful response.');
      var testCall = res;
      return testCall
    }).then(function(testCall) {
      Meteor.call('createSessionEvent', sessionId, 'Validated token: true');
      var tokenValidated = "true";
      return tokenValidated
    }).catch(function(err) {
      Meteor.call('createSessionEvent', sessionId, 'Validated token: false');
      var tokenValidated = "false";
      return tokenValidated;
    });

    return result;
  }
});
