import { Meteor } from 'meteor/meteor';
import { $ } from 'meteor/jquery'

Meteor.startup(() => {
  $(window).bind('beforeunload', function() {
    closingWindow();
  });
});

var closingWindow = function() {
  Meteor.call('deleteSessionData', Session.get('userSessionId'));
};
