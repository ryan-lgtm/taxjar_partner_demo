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
  isApiDisabled: function() {
    if (Session.get('apiTokenValid') == 'true') {
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
    return Session.get('streetAddress');
  },

  city: function() {
    return Session.get('city');
  },

  state: function() {
    return Session.get('state');
  },

  zipCode: function() {
    return Session.get('zipCode');
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
  'click #enableApi': function() {
    console.log('I was fired.');
    if ($('#enableApi').is(':checked')) {
      Session.set('enableApi', 'true');
      $('.enablers').removeAttr('disabled');
    } else {
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

    Session.set("streetAddress", streetAddress);
    Session.set("city", city);
    Session.set("state", state);
    Session.set("zipCode", zipCode);
    Session.set("apiToken", apiToken);
    Session.set("enableApi", enableApi);
    Session.set("enableSalesTax", enableSalesTax);
    Session.set("enableTransactionSync", enableTransactionSync);
  }
});
