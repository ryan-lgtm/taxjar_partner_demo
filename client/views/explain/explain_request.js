import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';

import {
  $
} from 'meteor/jquery'

Template.explainRequest.onCreated(function() {
  let template = Template.instance();

  template.insightDetails = new ReactiveVar();
  template.insightMessages = new ReactiveVar();
  template.autorun(() => {
    console.log('Autorun ran.');
    Meteor.call('insightMessages', template.insightDetails.get(), function(err, res) {
      if (err) {
        console.log(err);
      } else {
        template.insightMessages.set(res);
      }
    });
  })
});

Template.explainRequest.helpers({
  apiToken: function() {
    return Session.get('apiToken');
  },

  insightDetails: function() {
    return Template.instance().insightMessages.get();
  }
});

Template.explainRequest.events({
  'input #apiToken': function(event) {
    event.preventDefault();

    let apiTokenValue = $.trim($('#apiToken').val());
    let charCount = $('#apiToken').val().length;
    if (charCount == 32) {
      Session.set('apiTokenValid', 'true');
      Session.set('apiToken', apiTokenValue)
      Session.set('apiTokenValid', 'true');
      Session.set('enableSalesTax', 'true');
      Session.set('enableApi', 'true');
      Session.set('apiTokenConfirmedValid', 'true');
      Session.set('enableTransactionSync', 'true');
    } else {
      Session.set('apiTokenValid', 'false');
      Session.set('enableApi', 'false');
      Session.set('enableSalesTax', 'false');
      Session.set('enableTransactionSync', 'false');
    }
  },

  'input #taxesReq': function(event, template) {
    event.preventDefault();

    let taxesReq = JSON.parse($.trim($('#taxesReq').val()));

    let insightDetails = {};

    Meteor.call('validateReq', taxesReq, function(err, res) {
      if (err) {
        console.log(err);
      } else {
        template.insightDetails.set(res);
      }
    });
  },

  'click .submit-request': function(event) {
    event.preventDefault();

    let apiTokenValue = Session.get('apiToken');

    let reqBody = $.trim($('#taxesReq').val());
    var sessionId = Session.get('userSessionId');

    Meteor.call('taxCall', reqBody, sessionId, 'explain', apiTokenValue, 'explainReq', function(err, res) {
      if (err) {
        Bert.alert('Error: ' + err, 'danger');
      } else {
        Session.set('insightDetails', null);
        Meteor.call('getCalculation', null, null, sessionId, function(err, res) {
          if (res) {
            FlowRouter.go('/explain/' + res._id);
          }
        })
      }
    });
  }
});
