const Taxjar = require('taxjar');

Meteor.methods({
  async testToken(token,sessionId) {
    const client = new Taxjar({
      apiKey: token
    });

    const result = await client.categories().then(res => {
      var testCall = res;
      return testCall
    }).then(function(testCall) {
      Meteor.call('createSession', sessionId, 'Validated token: true');
      var tokenValidated = "true";
      return tokenValidated
    }).catch(function(err) {
      Meteor.call('createSession', sessionId, 'Validated token: false');
      var tokenValidated = "false";
      return tokenValidated;
    });

    return result;
  }
});
