import SimpleSchema from 'simpl-schema';

Customer = new Mongo.Collection("customers");

CustomerSchema = new SimpleSchema({
  "sessionId": {
    type: String,
    label: "Session ID"
  },

  "customerIdentifier": {
    type: String,
    label: "Customer Identifier"
  },

  "customerName": {
    type: String,
    label: "Customer Name"
  },

  "customerStreet": {
    type: String,
    label: "Customer Street",
    optional: true
  },

  "customerCity": {
    type: String,
    label: "Customer City",
    optional: true
  },

  "customerState": {
    type: String,
    label: "Customer State",
    optional: true
  },

  "customerZip": {
    type: String,
    label: "Customer Zip Code",
    optional: true
  },

  "customerCountry": {
    type: String,
    label: "Customer Country Code",
    optional: true
  },

  "customerExemptionType": {
    type: String,
    label: "Customer Exemption Type"
  },

  "createdOn": {
    type: Date,
    label: "Product Created On",
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      }
    }
  },

  "lastUpdated": {
    type: Date,
    label: "Last Updated",
    optional: true,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date;
      }
    }
  }
});

Customer.allow({
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

Customer.attachSchema(CustomerSchema);
