Meteor.publish('transactions', function() {
    let sessionId = this.connection.id;
    return Transaction.find({'sessionId': sessionId});
  });
