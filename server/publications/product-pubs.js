Meteor.publish('products', function() {
    let sessionId = this.connection.id;
    return Product.find({'sessionId': sessionId});
  });
