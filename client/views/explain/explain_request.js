import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';

import {
  $
} from 'meteor/jquery'

Template.explainRequest.onRendered(function() {

});

Template.explainRequest.helpers({

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

  'click .submit-request': function(event) {
    event.preventDefault();

    let apiTokenValue = Session.get('apiToken');

    let reqBody = $.trim($('#taxesReq').val());
    var sessionId = Session.get('userSessionId');

    console.log(reqBody);
    Meteor.call('taxCall', reqBody, sessionId, 'explain', apiTokenValue, 'explainReq', function(err, res) {
      if (err) {
        Bert.alert('Error: ' + err, 'danger');
      } else {
        var calculation = Calculation.findOne({
          'sessionId': sessionId
        }, {
          sort: {
            createdOn: -1,
            limit: 1
          }
        });
        FlowRouter.go('/explain/' + calculation._id);
      }
    });
  }
});
