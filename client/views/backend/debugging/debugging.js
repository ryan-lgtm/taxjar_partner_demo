Template.debugging.onCreated(function() {
  Meteor.subscribe('visitor_sessions');

  let template = Template.instance();

  //template.sessionEvents = new ReactiveVar();

  template.autorun(() => {
    var sessionId = Session.get('userSessionId');
    var logData = VisitorSession.find({'sessionId': sessionId}).count();

    var results = Meteor.call('getEvents',sessionId, function(err,res){
      if (err) {
        Bert.alert('An unexpected error occurred.', 'danger');
      } else {
        Session.set('logResults',res)
      }
    });
    return logData
  });
})

Template.debugging.helpers({
  sessionEvents: function() {
    return Session.get('logResults');
  }

});
