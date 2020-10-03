Meteor.methods({
  createSessionEvent: function(sessionId, logEvent) {
    VisitorSession.insert({
      'sessionId': sessionId,
      'logEvent': logEvent
    }, function(err, res) {
      if (err) {
        console.log(err);
        return err
      }
    });
  }
});
