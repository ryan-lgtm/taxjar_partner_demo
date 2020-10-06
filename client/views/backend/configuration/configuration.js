import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';

import {
  $
} from 'meteor/jquery'

import {
  Tracker
} from 'meteor/tracker'

Template.configuration.helpers({
  apiTokenConfirmedValid: function() {
    if (Session.get('apiTokenConfirmedValid') == 'true') {
      return true
    }
  },

  apiTokenConfirmedNotValid: function() {
    if (Session.get('apiTokenConfirmedValid') == 'false') {
      return true
    }
  },

  fetchingResults: function() {
    if (Session.get('fetchingResults') == true) {
      return true
    } else {
      return false
    }
  },

  apiTokenValid: function() {
    if (Session.get('apiTokenValid') == 'true') {
      return true
    } else {
      return false
    }
  },

  isApiDisabled: function() {
    if (Session.get('apiTokenValid') == 'true' && Session.get('apiTokenConfirmedValid') == 'true') {
      return
    } else {
      return 'disabled'
    }
  },

  isApiFeatureDisabled: function() {
    if (Session.get('enableApi') == 'true') {
      return
    } else {
      return 'disabled'
    }
  },

  streetAddress: function() {
    if (Session.get('businessAddressDefault')) {
      return Session.get('businessAddressDefault').streetAddress;
    }
  },

  city: function() {
    if (Session.get('businessAddressDefault')) {
      return Session.get('businessAddressDefault').city;
    }
  },

  state: function() {
    if (Session.get('businessAddressDefault')) {
      return Session.get('businessAddressDefault').state;
    }
  },

  zipCode: function() {
    if (Session.get('businessAddressDefault')) {
      return Session.get('businessAddressDefault').zipCode;
    }
  },

  apiToken: function() {
    return Session.get('apiToken');
  },

  enableApi: function() {
    if (Session.get('enableApi') == 'true') {
      $('.enablers').removeAttr('disabled');
      return 'checked'
    } else {
      $('.enablers').attr('disabled', true);
      return ''
    }
  },

  enableSalesTax: function() {
    if (Session.get('enableSalesTax') == 'true') {
      return 'checked'
    } else {
      $('.enableSaleTax').removeAttr('checked');
      return ''
    }
  },

  enableTransactionSync: function() {
    if (Session.get('enableTransactionSync') == 'true') {
      return 'checked'
    } else {
      $('.enableTransactionSync').removeAttr('checked');
      return ''
    }
  }
});

Template.configuration.events({
  'click .test-api-cred': function(event) {
    event.preventDefault();
    Session.set('fetchingResults', true);
    var token = Session.get('apiToken');

    Meteor.call('testToken', token, Session.get('userSessionId'), function(err, res) {
      if (err) {
        Session.set('fetchingResults', false);
        Bert.alert('An unexpected error occurred.', 'danger');
      } else {
        Session.set('apiTokenConfirmedValid', res);
        Session.set('fetchingResults', false);
      }
    });
  },

  'click #enableApi': function() {
    if ($('#enableApi').is(':checked')) {
      Meteor.call('createSessionEvent', Session.get('userSessionId'), 'TaxJar API was enabled.');
      Session.set('enableApi', 'true');
      $('.enablers').removeAttr('disabled');
    } else {
      Meteor.call('createSessionEvent', Session.get('userSessionId'), 'TaxJar API was disabled.');
      Session.set('enableApi', 'false');
      Session.set('enableSalesTax', 'false');
      Session.set('enableTransactionSync', 'false');
      $('.enablers').removeAttr('checked');
      $('.enablers').attr('disabled', true);
    }
  },

  'input #apiToken': function(event) {
    event.preventDefault();

    let apiTokenValue = $.trim($('#apiToken').val());
    let charCount = $('#apiToken').val().length;
    if (charCount == 32) {
      Session.set('apiTokenValid', 'true');
      Session.set('apiToken', apiTokenValue)
    } else {
      Session.set('apiTokenValid', 'false');
      Session.set('enableApi', 'false');
      Session.set('enableSalesTax', 'false');
      Session.set('enableTransactionSync', 'false');
    }
  },

  'click .save-configuration': function(event) {
    event.preventDefault();

    let streetAddress = $.trim($('#streetAddress').val());
    let city = $.trim($('#city').val());
    let state = $.trim($('#state').val());
    let zipCode = $.trim($('#zipCode').val());

    let apiToken = $.trim($('#apiToken').val());

    if ($('#enableApi').is(':checked')) {
      var enableApi = 'true';
    } else {
      var enableApi = 'false';
    }

    if ($('#enableSalesTax').is(':checked')) {
      var enableSalesTax = 'true';
    } else {
      var enableSalesTax = 'false';
    }

    if ($('#enableTransactionSync').is(':checked')) {
      var enableTransactionSync = 'true';
    } else {
      var enableTransactionSync = 'false';
    }

    var businessAddress = {
      'streetAddress': streetAddress,
      'city': city,
      'state': state,
      'zipCode': zipCode,
      'country': 'US'
    }

    Session.set("businessAddress", businessAddress);
    Session.set("businessAddressDefault", businessAddress);
    Session.set("apiToken", apiToken);
    Session.set("enableApi", enableApi);
    Session.set("enableSalesTax", enableSalesTax);
    Session.set("enableTransactionSync", enableTransactionSync);
    Bert.alert('Configuration updates saved successfully.', 'success');
    Meteor.call('createSessionEvent', Session.get('userSessionId'), 'Configurations saved.\n Primary address:\n' + businessAddress.streetAddress + ' ' + businessAddress.city + ' ' + businessAddress.state + ' ' + businessAddress.zipCode + `\n` + 'API Configurations:\n' + 'API Enabled: ' + Session.get('enableApi') + `\n` + 'Sales Tax Calculations enabled: ' + Session.get('enableSalesTax') + `\n` + 'Transaction Sync enabled: ' + Session.get('enableTransactionSync') + `\n`)
  }
});
