Template.mainLayout.rendered = function() {
  Meteor.call('getSessionId', function(err, id) {
    Session.set('userSessionId', id);
    Meteor.call('createSessionEvent',id,'New session started with Session ID: ' + id);
  });
};

Template.mainLayout.helpers({
  toggleDebug: function() {
    if (Session.get('toggleDebug')) {
      return true
    }
  }
});
