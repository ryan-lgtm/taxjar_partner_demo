Meteor.publish('visitor_sessions', function() {
    var sessionId = this.connection.id;
    return VisitorSession.find({'sessionId': sessionId});
  });
