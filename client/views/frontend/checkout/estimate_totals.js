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
  shippingTotal: function() {
    if (Session.get('shippingTotal')) {
      return Session.get('shippingTotal');
    } else {
      Session.setDefault('shippingTotal', 0);
    }
  },

  shippingTotalDisplay: function() {
    if (Session.get('shippingTotal')) {
      return (Math.round(Session.get('shippingTotal') * 100) / 100).toFixed(2);
    }
  },

  lineItemTotal: function() {
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

      return (Math.round(total * 100) / 100).toFixed(2);
    }
  },

  discountAmount: function() {
    if (Session.get('discountAmount')) {
      return (Math.round(Session.get('discountAmount') * 100) / 100).toFixed(2);
    }
  },

  amountToCollect: function() {
    if (Session.get('atc')) {
      return (Math.round(Session.get('atc') * 100) / 100).toFixed(2);
    }
  },

  orderTotal: function() {
    if (Session.get('atc')) {
      var atc = parseFloat(Session.get('atc'));
      var lineItemTotal = parseFloat(Session.get('lineItemTotal'));
      var shippingTotal = parseFloat(Session.get('shippingTotal'));
      var discountAmount = parseFloat(Session.get('discountAmount'));

      return (Math.round(((lineItemTotal - discountAmount) + shippingTotal + atc) * 100) / 100).toFixed(2);
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
    var sessionId = Session.get('userSessionId');
    var transactionId = Transaction.findOne({
      'sessionId': sessionId,
      'transactionStatus': 'In Progress'
    })._id;

    var taxReq = {};

    // 1.) Collect the "from" parameters
    taxReq.fromParams = Session.get('businessAddress');

    // 2.) Collect the "to" parameters
    if (Session.get('selectedCustomer')) {
      var customer = Customer.findOne({
        _id: Session.get('selectedCustomer')
      });
      var toParams = {
        'toStreetAddress': customer.customerStreet,
        'toCity': customer.customerCity,
        'toState': customer.customerState,
        'toZipCode': customer.customerZip,
        'toCountry': customer.customerCountry
      };
      taxReq.toParams = toParams;
      taxReq.customerId = customer.customerIdentifier
    }

    if (Session.get('customerAddress') && Session.get('customerAddress').toZipCode !== '') {
      taxReq.toParams = Session.get('customerAddress');
    }

    // 3.) Collect the "amount" parameter
    taxReq.amount = (Math.round(Session.get('lineItemTotal') * 100) / 100).toFixed(2);

    // 4.) Collect the "shipping" parameter
    if (Session.get('shippingTotal')) {
      taxReq.shipping = Session.get('shippingTotal')
    } else {
      Session.set('shippingTotal', 0);
      taxReq.shipping = 0;
    }

    // 5.) Collect the "lineItems" detail -and- divide discounts, if applicable
    var lineItemsReq = [];
    var lineItems = Transaction.findOne({
      'transactionStatus': 'In Progress',
      'sessionId': Session.get('userSessionId')
    }).lineItems;

    // Before iteration, see if there is a discount.
    if (Session.get('discountAmount') !== 0 && Session.get('discountAmount') !== undefined) {
      var discount = Session.get('discountAmount');
      var numOfLineItems = lineItems.length;
      var discountDiv = (discount / numOfLineItems); // the even distribution amount of the discount across all line items
    }
    if (Session.get('discountAmount') == 0 || Session.get('discountAmount') == undefined) {
      Session.set('discountAmount', 0);
      var discount = 0;
      var discountAmount = 0;
    }

    var iterator = 1;

    lineItems.forEach((lineItem) => {
      var quantity = lineItem.quantity;
      var product = Product.findOne({
        _id: lineItem.productId
      });
      var cost = (quantity * product.productUnitPrice);

      // initialize discountAmount as 0.
      var discountAmount = 0;
      // If the discount is not 0, and is less than or equal to the cost of the lineItem, subtract an amount less than or equal to the cost
      if (discount !== 0) {
        if (cost >= discountDiv) { // the cost of the lineItem is greater than the discount amount, use the even distribution
          var discountAmount = discountDiv;
          var discount = discount - discountDiv; // subtract the discount amount from the running total of the discount
        }
        if (cost < discount) { // the cost of the lineItem is less than the discount amount, apply the maximum amount available
          var discountAmount = cost;
          var discount = discount - discountAmount;
        }
      }

      var data = {
        'id': String(iterator),
        'quantity': quantity,
        'product_tax_code': product.productTaxCode,
        'unit_price': product.productUnitPrice,
        'discount': parseFloat((Math.round(discountAmount * 100) / 100).toFixed(2))
      }
      lineItemsReq.push(data);
      iterator++;
    });

    taxReq.lineItems = lineItemsReq;

    Meteor.call('taxCall', taxReq, sessionId, transactionId, Session.get('apiToken'), "checkout", function(err, res) {
      if (err) {
        Bert.alert('Error: ' + err, 'danger');
      } else {
        Session.set('atc', String(res.tax.amount_to_collect));
      }
    });
  },

  'click .explain': function(event, template) {
    event.preventDefault();
    var transaction = Transaction.findOne({
      'sessionId': Session.get('userSessionId'),
      'transactionStatus': 'In Progress'
    });
    Meteor.call('getCalculation', null, transaction._id, function(err,res){
      if (res) {
        FlowRouter.go('/explain/' + res._id)
      }
    });
  }
});
