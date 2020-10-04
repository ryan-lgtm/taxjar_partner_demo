import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';

import {
  $
} from 'meteor/jquery'

import {
  Tracker
} from 'meteor/tracker'

Template.lineItems.helpers({
  transaction: function() {
    var transaction = Transaction.findOne({
      'transactionStatus': 'In Progress',
      'sessionId': Session.get('userSessionId')
    });

    if (transaction) {
      return transaction
    }
  },

  productName: function() {
    return Product.findOne({
      _id: this.productId
    }).productName;
  },

  productUnitPrice: function() {
    return Product.findOne({
      _id: this.productId
    }).productUnitPrice;
  },

  productTotalPrice: function() {
    var quantity = this.quantity;

    var unitPrice = Product.findOne({
      _id: this.productId
    }).productUnitPrice;

    return (quantity * unitPrice).toFixed(2);
  },

  discountAmount: function() {
    if (Session.get('discountAmount')) {
      return Session.get('discountAmount');
    } else {
      Session.setDefault('discountAmount', 0);
    }
  }
});

Template.lineItems.events({
  'click .delete-lineitem': function(event, template) {
    event.preventDefault();
    var transactionId = Transaction.findOne({
      'transactionStatus': 'In Progress',
      'sessionId': Session.get('userSessionId')
    })._id;
    Meteor.call('transactionRemoveLineItem', Session.get('userSessionId'), transactionId, this);
  },

  'keyup #discountAmount': function(event, template) {
    let value = event.target.value.trim();

    Session.set('discountAmount', value);
  }
});
