Meteor.methods({
  getCalculation: function(id, transactionId, sessionId) {
    if (id !== null) {
      var calc = Calculation.findOne({
        _id: id
      });
    }

    if (id == null && transactionId !== null) {
      var calc = Calculation.findOne({
        forTransaction: transactionId
      }, {
        sort: {
          createdOn: -1
        }
      });
    }

    if (id == null && transactionId == null) {
      var calc = Calculation.findOne({
        sessionId: sessionId
      }, {
        sort: {
          createdOn: -1
        }
      });
    }

    return calc;
  }
});
