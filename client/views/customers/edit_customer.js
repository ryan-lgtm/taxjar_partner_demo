import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';

import {
  $
} from 'meteor/jquery';

Template.editCustomer.onCreated(function() {

  let template = Template.instance();

  let customerId = FlowRouter.getParam('id');
  Session.set('customerId', customerId);

  template.autorun(function() {
    let currentCustomer = Customer.findOne({
      _id: Session.get('customerId')
    });


    if (currentCustomer) {
      Session.set('currentCustomer', currentCustomer);
      Session.set('customerId', currentCustomer.customerIdentifier);
      Session.set('customerName', currentCustomer.customerName);
      Session.set('customerStreet', currentCustomer.customerStreet);
      Session.set('customerCity', currentCustomer.customerCity);
      Session.set('customerState', currentCustomer.customerState);
      Session.set('customerZip', currentCustomer.customerZip);
      Session.set('customerCountry', currentCustomer.customerCountry);
      Session.set('customerExemptionType', currentCustomer.customerExemptionType);
    }
  });
});

Template.editCustomer.helpers({
  currentCustomer: function() {
    return Session.get('currentCustomer');
  }
});

Template.editCustomer.events({
  'click .save-customer': function(event) {
    event.preventDefault();
    var sessionId = Session.get('userSessionId');
    var customer = {
      'customerName': $.trim($('#customerName').val()),
      'customerIdentifier': $.trim($('#customerId').val()),
      'customerStreet': $.trim($('#customerStreet').val()),
      'customerCity': $.trim($('#customerCity').val()),
      'customerState': $.trim($('#customerState').val()),
      'customerZip': $.trim($('#customerZip').val()),
      'customerCountry': $.trim($('#customerCountry').val()),
      'customerExemptionType': $('#exemptionTypes option:selected').attr('value')
    }

    if (customer.customerName.length == 0 || customer.customerIdentifier.length == 0) {
      $('.missingRequired').show();
      return false
    } else {
      Meteor.call('editCustomer', sessionId, customer, function(err, res) {
        if (err) {
          Bert.alert('An unexpected error has occurred.', 'danger');
          console.log(err);
        } else {
          Bert.alert('Customer updated successfully.', 'success');
          $('.missingRequired').hide();
          $('customerName').val('');
          $('customerIdentifier').val('');
          $('customerStreet').val('');
          $('customerCity').val('');
          $('customerState').val('');
          $('customerZip').val('');
          $('customerCountry').val('');
        }
      })
    }
  }
});

Template.editCustomer.destroyed = function() {
  Session.set('currentCustomer', null);
  Session.set('customerId', null);
  Session.set('customerName', null);
  Session.set('customerStreet', null);
  Session.set('customerCity', null);
  Session.set('customerState', null);
  Session.set('customerZip', null);
  Session.set('customerCountry', null);
  Session.set('customerExemptionType', null);
}
