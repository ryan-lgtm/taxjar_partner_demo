Meteor.methods({
  getSessionId: function() {
    return this.connection.id;
  },

  deleteSessionData: function(sessionId) {
    VisitorSession.remove({
      sessionId: sessionId
    });
  }


});
