import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';

Template.sidebar.helpers({
  checkToken: function() {
    if (Session.get('apiToken')) {
      $('#check-token').css('color','green');
      return 'true'
    } else {
      $('#check-token').css('color','red');
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
  }
});

Template.sidebar.events({
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

  'click .open-debugging': function(event) {
    event.preventDefault();
    if (Session.get('toggleDebug') == true) {
      Session.set('toggleDebug', false);
    } else {
      Session.set('toggleDebug', true);
    }
  },
});
