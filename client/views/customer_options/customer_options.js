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
  }
});

Template.customerOptions.events({
  'click .select-customer': function(event) {
    event.preventDefault();

    Session.set('impersonated', this._id);
    $('.no-impersonation').css('background-color', '#fff')
    $('.customer-rows').css('background-color', '#fff');
    $('.'+String(this._id)).css('background-color','#d3d3d3')
  },

  'click .no-impersonation': function(event) {
    event.preventDefault();

    Session.set('impersonated', 'none');
    $('.customer-rows').css('background-color', '#fff');
    $('.no-impersonation').css('background-color','#d3d3d3')
  }
});
