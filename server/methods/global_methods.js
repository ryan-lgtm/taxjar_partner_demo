Meteor.methods({
  getSessionId: function() {
    return this.connection.id;
  }
});
