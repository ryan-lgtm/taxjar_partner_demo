import SimpleSchema from 'simpl-schema';

Calculation = new Mongo.Collection("calculations");

if (Meteor.isServer) {
  Calculation._ensureIndex( { sessionId: 1, forTransaction: 1} );
}

CalculationSchema = new SimpleSchema({
  "sessionId": {
    type: String,
    label: "Session ID"
  },

  "forTransaction": {
    type: String,
    label: "Belongs to transaction"
  },

  "reqBody": {
    type: String
  },

  "resBody": {
    type: String
  },

  "createdOn": {
    type: Date,
    label: "Calculation Created On",
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      }
    }
  }
});

Calculation.allow({
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

Calculation.attachSchema(CalculationSchema);
