import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';

import {
  $
} from 'meteor/jquery'

import {
  Tracker
} from 'meteor/tracker'

Template.manageCustomers.onCreated(function() {
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

Template.manageCustomers.helpers({
  customers: function() {
    return Session.get('customers');
  }
});

Template.manageCustomers.events({
  'click #seed-customers': function(event) {
    event.preventDefault();

    var sessionId = Session.get('userSessionId');

    Meteor.call('seedCustomers', sessionId, function(err, res){
      if (err) {
        Bert.alert('Could not seed customers: ' + err, 'danger');
      } else {
        $('#seed-customers').removeClass('btn-primary');
        $('#seed-customers').addClass('btn-default');
        $('#seed-customers').attr("id","disabled");
        $('#disabled').attr("disabled","disabled");
        Bert.alert('Seeded customer data successfully.','success');
        Meteor.call('createSessionEvent', sessionId, 'Seeded customer data.');
      }
    })
  },

  'click #disabled': function(event) {
    event.preventDefault();
    Bert.alert("Can't seed data, it's already been created.",'danger');
  },

  'click .sync-customers': function(event) {
    event.preventDefault();

    Meteor.call('syncCustomers', Session.get('userSessionId'), Session.get('apiToken'), function(err, res) {
      if (err) {
        Bert.alert('Error: ' + err, 'danger');
      } else {
        Bert.alert('Successfully synced customer data.', 'success');
      }
    });
  },

  'click .create-customer': function(event) {
    event.preventDefault();
    var sessionId = Session.get('userSessionId');

    var customer = {
      'customerName': $.trim($('#newCustomerName').val()),
      'customerIdentifier': $.trim($('#newCustomerId').val()),
      'customerStreet': $.trim($('#newCustomerStreet').val()),
      'customerCity': $.trim($('#newCustomerCity').val()),
      'customerState': $.trim($('#newCustomerState').val()),
      'customerZip': $.trim($('#newCustomerZip').val()),
      'customerCountry': $.trim($('#newCustomerCountry').val()),
      'customerExemptionType': $('#exemptionTypes option:selected').attr('value')
    };
    if (customer.customerName.length == 0 || customer.customerIdentifier.length == 0) {
      $('.missingRequired').show();
      return false
    } else {
      Meteor.call('createCustomer', sessionId, customer, function(err, res) {
        if (err) {
          Bert.alert('An unexpected error has occurred.', 'danger');
          console.log(err);
        } else {
          Bert.alert('Customer created successfully.', 'success');
          $('.missingRequired').hide();
          $('#newCustomerName').val('');
          $('#newCustomerIdentifier').val('');
          $('#newCustomerStreet').val('');
          $('#newCustomerCity').val('');
          $('#newCustomerState').val('');
          $('#newCustomerZip').val('');
          $('#newCustomerCountry').val('');
        }
      })
    }
  },

  'click .delete-customer': function(event) {
    event.preventDefault();
    var sessionId = Session.get('userSessionId');

    Meteor.call('deleteCustomer', sessionId, Session.get('apiToken'), this, function(err, res) {
      if (err) {
        Bert.alert('An unexpected error has occurred.', 'danger');
        console.log(err);
      } else {
        Bert.alert('Customer deleted successfully.', 'success');
      }
    });
  },

  'click .edit-customer': function(event) {
    event.preventDefault();

    FlowRouter.go('/manage-customers/edit/' + this._id);
  }
});
