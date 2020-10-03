import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';

import {
  $
} from 'meteor/jquery'

import {
  Tracker
} from 'meteor/tracker'

Template.estimateTotals.helpers({
  shippingTotal: function(){
    if (Session.get('shippingTotal')) {
      return Session.get('shippingTotal');
    }
  },

  lineItemTotal: function(){
    var lineItems = Transaction.findOne({
      'transactionStatus': 'In Progress',
      'sessionId': Session.get('userSessionId')
    }).lineItems;
    if (lineItems) {
      var total = 0;
      lineItems.forEach((lineItem) => {
        var qty = lineItem.quantity;
        var unitPrice = Product.findOne({
          _id: lineItem.productId
        }).productUnitPrice;

        var totalLineItem = qty * unitPrice;
        total += totalLineItem
      });
      Session.set('lineItemTotal', total);
      return total
    }
  },

  discountAmount: function(){
    if (Session.get('discountAmount')) {
      return Session.get('discountAmount');
    }
  }
});

Template.estimateTotals.events({
  'keyup #shippingTotal': function(event, template) {
    let value = event.target.value.trim();

    Session.set('shippingTotal', value);
  },

  'click .calculate-tax': function(event, template) {
    event.preventDefault();
    // do a calc
  },

  'click .explain': function(event, template) {
    event.preventDefault();
    // go to awesome tax calc explanation
  }
});
