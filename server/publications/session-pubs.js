Meteor.publish('visitor_sessions', function() {
    let sessionId = this.connection.id;
    return VisitorSession.find({'sessionId': sessionId});
  });
