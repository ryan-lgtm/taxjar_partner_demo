import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';

import {
  $
} from 'meteor/jquery'

import {
  Tracker
} from 'meteor/tracker'

Template.customerBusinessDetails.helpers({
  customer: function() {
    var currentCustomer = Session.get('selectedCustomer');

    if (currentCustomer) {
      return Customer.findOne({_id: currentCustomer});
    } else {
      return null
    }
  },

  businessAddress: function() {
    var businessAddress = Session.get('businessAddress');

    if (businessAddress) {
      return businessAddress
    } else {
      return null
    }
  }
});

Template.customerBusinessDetails.events({
  'click .remove-customer': function(event, template) {
    event.preventDefault();

    Session.set('selectedCustomer', 'none');
  },

  'click .remove-froms': function(event, template) {
    event.preventDefault();

    Session.set('businessAddress', undefined);
  }
});
