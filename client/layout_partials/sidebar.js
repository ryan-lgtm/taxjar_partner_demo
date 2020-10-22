import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';

Template.sidebar.helpers({
  navTokenValid: function() {
    if (Session.get('apiTokenConfirmedValid') == 'true') {
      return true
    } else {
      return false
    }
  },

  checkToken: function() {
    if (Session.get('apiToken')) {
      $('#check-token').css('color','green');
      return 'true'
    } else {
      $('#check-token').css('color','red');
      return 'false'
    }
  },

  checkTokenValid: function() {
    if (Session.get('apiTokenConfirmedValid')) {
      $('#check-token-valid').css('color','green');
      return 'true'
    } else {
      $('#check-token-valid').css('color','red');
      return 'false'
    }
  },

  checkApi: function() {
    if (Session.get('enableApi') == 'true') {
      $('#check-api').css('color','green');
      return 'true'
    } else {
      $('#check-api').css('color','red');
      return 'false'
    }
  },

  checkSalesTax: function() {
    if (Session.get('enableSalesTax') == 'true') {
      $('#check-sales-tax').css('color','green');
      return 'true'
    } else {
      $('#check-sales-tax').css('color','red');
      return 'false'
    }
  },

  checkTransactionSync: function() {
    if (Session.get('enableTransactionSync') == 'true') {
      $('#check-transaction-sync').css('color','green');
      return 'true'
    } else {
      $('#check-transaction-sync').css('color','red');
      return 'false'
    }
  },

  userSessionId: function() {
    return Session.get('userSessionId');
  },

  customerView: function() {
    if (Session.get('customerView') == true) {
      return true
    } else {
      return false
    }
  }
});

Template.sidebar.events({
  'click .toggle-customer': function(event) {
    event.preventDefault();
    Session.set('customerView', true);
  },

  'click .toggle-admin': function(event) {
    event.preventDefault();
    Session.set('customerView', false);
  },

  'click .to-customer-options': function(event) {
    event.preventDefault();
    $('.nav-item').removeClass('active');
    $('.customer-options-active').addClass('active');
    FlowRouter.go('/customer-options');
  },

  'click .to-shop': function(event) {
    event.preventDefault();
    $('.nav-item').removeClass('active');
    $('.shop-active').addClass('active');
    FlowRouter.go('/shop');
  },

  'click .to-checkout': function(event) {
    event.preventDefault();
    $('.nav-item').removeClass('active');
    $('.checkout-active').addClass('active');
    FlowRouter.go('/checkout');
  },

  'click .to-home': function(event) {
    event.preventDefault();
    $('.nav-item').removeClass('active');
      FlowRouter.go('/');
  },

  'click .to-manage-locations': function(event) {
    event.preventDefault();
    $('.nav-item').removeClass('active');
    $('.manage-locations-active').addClass('active');
    FlowRouter.go('/manage-locations');
  },

  'click .to-manage-products': function(event) {
    event.preventDefault();
    $('.nav-item').removeClass('active');
    $('.manage-products-active').addClass('active');
    FlowRouter.go('/manage-products');
  },

  'click .to-manage-customers': function(event) {
    event.preventDefault();
    $('.nav-item').removeClass('active');
    $('.manage-customers-active').addClass('active');
    FlowRouter.go('/manage-customers');
  },

  'click .to-transactions': function(event) {
    event.preventDefault();
    $('.nav-item').removeClass('active');
    $('.transactions-active').addClass('active');
    FlowRouter.go('/transactions');
  },

  'click .to-configuration': function(event) {
    event.preventDefault();
    $('.nav-item').removeClass('active');
    $('.configuration-active').addClass('active');
    FlowRouter.go('/configuration');
  },

  'click .to-explain-req': function(event) {
    event.preventDefault();
    $('.nav-item').removeClass('active');
    $('.explain-req-active').addClass('active');
    FlowRouter.go('/explain-request');
  },

  'click .open-debugging': function(event) {
    event.preventDefault();
    if (Session.get('toggleDebug') == true) {
      $('.debugging-active').removeClass('btn-primary');
      $('.open-debugging').css('color','');
      Bert.alert('Debugging off.', 'success');
      Session.set('toggleDebug', false);
    } else {
      $('.debugging-active').addClass('btn-primary');
      $('.open-debugging').css('color','white');
      Bert.alert('Debugging on.', 'success');
      Session.set('toggleDebug', true);
    }
  },
});
