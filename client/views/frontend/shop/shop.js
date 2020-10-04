import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';

import {
  $
} from 'meteor/jquery'

import {
  Tracker
} from 'meteor/tracker'

Template.shop.helpers({
  products: function() {
    return Session.get('products');
  },

  checkoutCount: function() {
    if (Session.get('transactionInProgress')) {
      if (Session.get('transactionInProgress') == true) {
        var transaction = Transaction.findOne({
          'transactionStatus': 'In Progress',
          'sessionId': Session.get('userSessionId')
        });
        if (transaction) {
          return transaction.lineItems.length
        }
      }
    }
  }
});

Template.shop.events({
  'click .checkout': function(event, template) {
    event.preventDefault();
    $('.nav-item').removeClass('active');
    $('.checkout-active').addClass('active');
    FlowRouter.go('/checkout');
  },

  'click .add-to-cart': function(event, template) {
    event.preventDefault();
    var product = this;
    var quantity = $.trim($('.' + String(product._id) + '.qty').val());

    if (Session.get('selectedCustomer')) {
      var selectedCustomer = Session.get('selectedCustomer');
    } else {
      var selectedCustomer = 'none';
    }

    if (Session.get('transactionInProgress') == true) {
      var transactionId = Transaction.findOne({
        'transactionStatus': 'In Progress',
        'sessionId': Session.get('userSessionId')
      })._id;
      Meteor.call('transactionAddProduct', Session.get('userSessionId'), product, quantity, transactionId);
    } else {
      // new transaction
      Session.set('transactionInProgress', true);
      // params: sessionId, selected customer ID, product
      Meteor.call('newTransaction', Session.get('userSessionId'), selectedCustomer, product, quantity);
    }
  }
});
