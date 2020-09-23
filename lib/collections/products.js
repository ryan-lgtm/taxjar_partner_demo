import SimpleSchema from 'simpl-schema';

Product = new Mongo.Collection("products");

ProductSchema = new SimpleSchema({
  "sessionId": {
    type: String,
    label: "Session ID"
  },

  "productIdentifier": {
    type: String,
    label: "Product Identifier",
    optional: true
  },

  "productName": {
    type: String,
    label: "Product Name"
  },

  "productDescription": {
    type: String,
    label: "Product Description",
    optional: true
  },

  "productUnitPrice": {
    type: Number,
    label: "Product Unit Price"
  },

  "productTaxCode": {
    type: String,
    label: "Product Tax Code",
    optional: true
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

Product.allow({
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

Product.attachSchema(ProductSchema);
