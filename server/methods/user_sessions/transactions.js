Meteor.methods({
  newTransaction: function(sessionId, selectedCustomer, product, quantity) {
    if (selectedCustomer !== 'none') {
      var exemptionStatus = Customer.findOne({
        _id: selectedCustomer
      }).customerExemptionType;
    } else {
      var exemptionStatus = 'non_exempt';
    }

    var productData = [{
      productId: String(product._id),
      quantity: quantity
    }];

    Transaction.insert({
      sessionId: sessionId,
      transactionStatus: 'In Progress',
      customerId: selectedCustomer,
      exemptionStatus: exemptionStatus,
      lineItems: productData
    }, function(err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
        return
      }
    });
  },

  transactionAddProduct: function(product, quantity, transactionId) {
console.log('called to add products');
    var productData = {
      productId: String(product._id),
      quantity: quantity
    };

    Transaction.update({
      '_id': transactionId
    }, {
      $push: {
        lineItems: productData
      }
    }, function(err, res) {
      console.log(err);
      console.log(res);
    });
  }
});
