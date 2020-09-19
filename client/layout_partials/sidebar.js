import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';

Template.sidebar.helpers({
  checkToken: function() {
    if (Session.get('apiToken')) {
      return 'true'
    } else {
      return 'false'
    }
  },

  checkApi: function() {
    if (Session.get('enableApi') == 'true') {
      return 'true'
    } else {
      return 'false'
    }
  },

  checkSalesTax: function() {
    if (Session.get('enableSalesTax') == 'true') {
      return 'true'
    } else {
      return 'false'
    }
  },

  checkTransactionSync: function() {
    if (Session.get('enableTransactionSync') == 'true') {
      return 'true'
    } else {
      return 'false'
    }
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

  'click .to-debugging': function(event) {
    event.preventDefault();
    $('.nav-item').removeClass('active');
    $('.debugging-active').addClass('active');
    FlowRouter.go('/debugging');
  },
});
