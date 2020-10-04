Meteor.methods({
  getSessionId: function() {
    return this.connection.id;
  },

  deleteSessionData: function(sessionId) {
    VisitorSession.remove({
      sessionId: sessionId
    });

    Product.remove({
      sessionId: sessionId
    });

    TaxCategory.remove({
      sessionId: sessionId
    });

    Customer.remove({
      sessionId: sessionId
    });

    Transaction.remove({
      sessionId: sessionId
    });

    Calculation.remove({
      sessionId: sessionId
    });
  }


});
