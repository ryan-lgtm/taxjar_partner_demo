Meteor.publish('customers', function() {
    let sessionId = this.connection.id;
    return Customer.find({'sessionId': sessionId});
  });
