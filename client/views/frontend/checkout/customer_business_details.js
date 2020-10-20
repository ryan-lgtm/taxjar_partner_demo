

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

    return businessAddress
  },

  customerAddress: function() {
    var customerAddress = Session.get('customerAddress');

    if (customerAddress) {
      return customerAddress
    } else {
      var toAddress = {
        'toStreetAddress': '',
        'toCity': '',
        'toState': '',
        'toZipCode': '',
        'toCountry': 'US'
      }
      Session.set('customerAddress',toAddress);
    }
  }
});

Template.customerBusinessDetails.events({
  'click .remove-customer': function(event, template) {
    event.preventDefault();

    Session.set('selectedCustomer', undefined);
  },

  'click .remove-froms': function(event, template) {
    event.preventDefault();

    Session.set('businessAddress', undefined);
  },

  'focusout .customerAddressDetails': function(event, template) {
    let streetAddress = $.trim($('#customerStreet').val());
    let city = $.trim($('#customerCity').val());
    let state = $.trim($('#customerState').val());
    let zipCode = $.trim($('#customerZip').val());

    var toAddress = {
      'toStreetAddress': streetAddress,
      'toCity': city,
      'toState': state,
      'toZipCode': zipCode,
      'toCountry': 'US'
    }

    Session.set('customerAddress', toAddress);
  },

  'focusout .businessAddressDetails': function(event, template) {
    let streetAddress = $.trim($('#fromStreet').val());
    let city = $.trim($('#fromCity').val());
    let state = $.trim($('#fromState').val());
    let zipCode = $.trim($('#fromZip').val());

    var businessAddress = {
      'streetAddress': streetAddress,
      'city': city,
      'state': state,
      'zipCode': zipCode,
      'country': 'US'
    }

    Session.set("businessAddress", businessAddress);
  }
});
