import SimpleSchema from 'simpl-schema';

Transaction = new Mongo.Collection("transactions");

if (Meteor.isServer) {
  Transaction._ensureIndex( { sessionid: 1, transactionStatus: 1} );
}

TransactionSchema = new SimpleSchema({
  "sessionId": {
    type: String,
    label: "Session ID"
  },

  "transactionStatus": {
    type: String,
    label: "Transaction status"
  },

  "lineItems": {
    type: Array
  },

  "lineItems.$": Object,
  "lineItems.$.productId": String,
  "lineItems.$.quantity": Number,

  "customerId": {
    type: String,
    label: "Customer ID",
    optional: true
  },

  "exemptionStatus": {
    type: String,
    label: "Exemption status",
    optional: true
  },

  "salesTax": {
    type: Number,
    label: "Sales tax total",
    optional: true
  },

  "shipping": {
    type: Number,
    label: "Shipping total",
    optional: true
  },

  "total": {
    type: Number,
    label: "Order total",
    optional: true
  },

  "discount": {
    type: Number,
    label: "Discount amount",
    optional: true
  },

  "shippingAddress": {
    type: Array,
    optional: true
  },

  "shippingAddress.$": Object,
  "shippingAddress.$.streetAddress": String,
  "shippingAddress.$.city": String,
  "shippingAddress.$.state": String,
  "shippingAddress.$.zipCode": String,
  "shippingAddress.$.country": String,

  "createdOn": {
    type: Date,
    label: "Transaction Created On",
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

Transaction.allow({
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

Transaction.attachSchema(TransactionSchema);
