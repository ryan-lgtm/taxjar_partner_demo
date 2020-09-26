import SimpleSchema from 'simpl-schema';

TaxCategory = new Mongo.Collection("tax_categories");

if (Meteor.isServer) {
  TaxCategory._ensureIndex( { name: 1, description: 1, productTaxCode: 1, starred: 1 } );
}

TaxCategorySchema = new SimpleSchema({
  "sessionId": {
    type: String,
    label: "Session ID"
  },

  "description": {
    type: String,
    label: "Tax Code Description",
    optional: true
  },

  "name": {
    type: String,
    label: "Tax Code Name",
    optional: true
  },

  "productTaxCode": {
    type: String,
    label: "Product Tax Code",
    optional: true
  },

  "starred": {
    type: Boolean,
    label: "Starred Tax Category",
    optional: true
  },

  "createdOn": {
    type: Date,
    label: "Product Created On",
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      }
    }
  }
});

TaxCategory.allow({
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

TaxCategory.attachSchema(TaxCategorySchema);
