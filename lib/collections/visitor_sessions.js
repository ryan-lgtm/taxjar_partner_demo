import SimpleSchema from 'simpl-schema';

VisitorSession = new Mongo.Collection("visitor_sessions");

VisitorSessionSchema = new SimpleSchema({
  "sessionId": {
    type: String,
    label: "Session ID"
  },

  "logEvent": {
    type: String,
    label: "Event Detail"
  },

  "createdOn": {
    type: Date,
    label: "Expense Creation Date",
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      }
    }
  }
});

VisitorSession.allow({
  insert: function() {
    return true
  },

  update: function() {
    return true
  },

  remove: function() {
    return true
  }
});

VisitorSession.attachSchema(VisitorSessionSchema);
