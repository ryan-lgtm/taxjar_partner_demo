Meteor.publish('calculations', function() {
    let sessionId = this.connection.id;
    return Calculation.find({'sessionId': sessionId});
  });
