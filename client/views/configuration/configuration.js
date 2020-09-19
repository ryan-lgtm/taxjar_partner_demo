import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';

import {
  $
} from 'meteor/jquery'

Template.configuration.helpers({
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
      return 'checked'
    } else {
      return ''
    }
  },

  enableSalesTax: function() {
    if (Session.get('enableSalesTax') == 'true') {
      return 'checked'
    } else {
      return ''
    }
  },

  enableTransactionSync: function() {
    if (Session.get('enableTransactionSync') == 'true') {
      return 'checked'
    } else {
      return ''
    }
  }
});

Template.configuration.events({
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
      if (!$('#enableApi').is(':checked')) {
        Bert.alert("API must be enabled for sales tax calculations.", 'danger');
        $('#enableSalesTax').prop("checked", false);
        var enableSalesTax = 'false';
        return enableSalesTax
      }
      var enableSalesTax = 'true';
    } else {
      var enableSalesTax = 'false';
    }

    if ($('#enableTransactionSync').is(':checked')) {
      if (!$('#enableApi').is(':checked')) {
        Bert.alert("API must be enabled for transaction sync.", 'danger');
        $('#enableTransactionSync').prop("checked", false);
        var enableTransactionSync = 'false';
        return enableTransactionSync
      }
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
