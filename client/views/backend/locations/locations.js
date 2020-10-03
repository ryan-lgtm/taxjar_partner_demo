import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';

import {
  $
} from 'meteor/jquery'

import {
  Tracker
} from 'meteor/tracker'

Template.manageLocations.helpers({
  nexusStates: function() {
    return Session.get('nexusStates')
  },

  fetchingResults: function() {
    return Session.get(fetchingResults);
  }
});

Template.manageLocations.events({
  'click .retrieve-nexus': function(event) {
    event.preventDefault();
    if (Session.get('enableApi') == 'true') {
      Meteor.call('retrieveNexus', Session.get('apiToken'), Session.get('userSessionId'), function(err,res){
        if (err) {
          Session.set('fetchingResults', false);
          Bert.alert('An unexpected error occurred.', 'danger');
        } else {
          Session.set('fetchingResults', false);
          Session.set('nexusStates', res.regions);
        }
      });
    } else {
      Meteor.call('createSessionEvent', Session.get('userSessionId'), 'Could not retrieve nexus locations. API is not enabled.');
      Bert.alert('Could not retrieve nexus locations. API is not enabled.', 'danger');
    }
  }
});
