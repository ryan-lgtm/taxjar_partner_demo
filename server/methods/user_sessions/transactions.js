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
        Meteor.call('createSessionEvent', sessionId, 'Started new transaction: ' + res + '.\nTransaction Status: In Progress\nExemption Status: ' + exemptionStatus + '\nProducts: ' + product.productName + ' (qty: ' + quantity + ')')
      }
    });
  },

  transactionAddProduct: function(sessionId, product, quantity, transactionId) {
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
      if (err) {
        console.log(err);
      } else {
        Meteor.call('createSessionEvent', sessionId, 'Added ' + product.productName + ' (qty: ' + quantity + ') to transaction ID: ' + transactionId);
      }
    });
  },

  transactionRemoveLineItem: function(sessionId, transactionId, productData) {
    Transaction.update({
      '_id': transactionId
    }, {
      $pull: {
        lineItems: productData
      }
    }, function(err, res) {
      if (err) {
        console.log(err);
      } else {
        Meteor.call('createSessionEvent', sessionId, 'Removed line item from transaction ' + transactionId);
      }
    })
  }
});
