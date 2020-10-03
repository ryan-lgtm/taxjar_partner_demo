import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';

import {
  $
} from 'meteor/jquery'

import {
  Tracker
} from 'meteor/tracker'

Template.customerOptions.onCreated(function() {
  Meteor.subscribe('customers');

  let template = Template.instance();

  template.autorun(() => {
    var sessionId = Session.get('userSessionId');

    Customer.find({
      'sessionId': sessionId
    }).count();

    var results = Meteor.call('getCustomers', sessionId, function(err, res) {
      if (err) {
        Bert.alert('An unexpected error occurred.', 'danger');
      } else {
        Session.set('customers', res)
      }
    });
    return results
  });
});

Template.customerOptions.helpers({
  customers: function() {
    return Session.get('customers');
  },

  selectedCustomer: function() {
    if (this._id == Session.get('selectedCustomer')) {
      return true
    }
  }
});

Template.customerOptions.events({
  'click .select-customer': function(event) {
    event.preventDefault();

    Session.set('selectedCustomer', this._id);
    Meteor.call('createSessionEvent', Session.get('userSessionId'), 'Imitating order activity with Customer ID '+this.customerIdentifier+'. Exemption status: '+this.customerExemptionType);
    $('.no-impersonation').css('background-color', '#fff')
    $('.customer-rows').css('background-color', '#fff');
    $('.'+String(this._id)).css('background-color','#d3d3d3')
  },

  'click .no-impersonation': function(event) {
    event.preventDefault();

    Session.set('selectedCustomer', undefined);
    Meteor.call('createSessionEvent', Session.get('userSessionId'), 'Imitating order activity with no customer selected. No exemption status applies.');
    $('.customer-rows').css('background-color', '#fff');
    $('.no-impersonation').css('background-color','#d3d3d3')
  }
});
