import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';

import {
  $
} from 'meteor/jquery'

import {
  Tracker
} from 'meteor/tracker'

Template.manageProducts.onCreated(function() {
  Meteor.subscribe('products');

  let template = Template.instance();

  template.autorun(() => {
    var sessionId = Session.get('userSessionId');

    var products = Product.find({
      'sessionId': sessionId
    }, {
      sort: {
        'lastUpdated': -1
      }
    }).fetch();

    var results = Meteor.call('getProducts', sessionId, function(err, res) {
      if (err) {
        Bert.alert('An unexpected error occurred.', 'danger');
      } else {
        Session.set('products', res)
      }
    });
    return products
  });
})

Template.manageProducts.helpers({
  products: function() {
    return Session.get('products');
  },

  isEditable: function() {
    var id = '.'+String(this._id+'-toggle');
    console.log(id);
    if ($(id).hasClass('enabled')) {
      console.log("I'm editable");
      return true
    } else {
      console.log("I'm not editable.");
      return false
    };
  }

});

Template.manageProducts.events({
  'click .seed-products': function(event) {
    event.preventDefault();
    var sessionId = Session.get('userSessionId');

    if ($('#seedSoftware').is(':checked')) {
      Meteor.call('seedSoftware', sessionId, function(err, res) {
        if (err) {
          Bert.alert('An unexpected error occurred.', 'danger');
        } else {
          Meteor.call('createSessionEvent', sessionId, 'Seeded software product data.');
        }
      });
    }

    if ($('#seedFoodBeverage').is(':checked')) {
      Meteor.call('seedFoodBeverage', sessionId, function(err, res) {
        if (err) {
          Bert.alert('An unexpected error occurred.', 'danger');
        } else {
          Meteor.call('createSessionEvent', sessionId, 'Seeded food and beverage product data.');
        }
      });
    }

    if ($('#seedServices').is(':checked')) {
      Meteor.call('seedServices', sessionId, function(err, res) {
        if (err) {
          Bert.alert('An unexpected error occurred.', 'danger');
        } else {
          Meteor.call('createSessionEvent', sessionId, 'Seeded services product data.');
        }
      });
    }

    Bert.alert('Successfully seeded product data.', 'success');
  },

  'click .create-product': function(event) {
    event.preventDefault();
    var sessionId = Session.get('userSessionId');

    var product = {
      'productName': $.trim($('#newProductName').val()),
      'productDescription': $.trim($('#newProductDescription').val()),
      'productIdentifier': $.trim($('#newProductId').val()),
      'productUnitPrice': $.trim($('#newProductUnitPrice').val()),
      'productTaxCode': $.trim($('#newProductTaxCode').val())
    };

    if (product.productName.length == 0 || product.productUnitPrice.length == 0) {
      $('.missingRequired').show();
      return false
    } else {
      Meteor.call('createProduct', sessionId, product, function(err, res) {
        if (err) {
          Bert.alert('An unexpected error has occurred.', 'danger');
          console.log(err);
        } else {
          Bert.alert('Product created successfully.', 'success');
          $('.missingRequired').hide();
          $('#newProductName').val('');
          $('#newProductDescription').val('');
          $('#newProductId').val('');
          $('#newProductUnitPrice').val('');
          $('#newProductTaxCode').val('');
        }
      })
    }
  },

  'click .delete-product': function(event) {
    event.preventDefault();
    var sessionId = Session.get('userSessionId');
    
    Meteor.call('deleteProduct', sessionId, this, function(err,res){
      if (err) {
        Bert.alert('An unexpected error has occurred.', 'danger');
        console.log(err);
      } else {
        Bert.alert('Product deleted successfully.', 'success');
      }
    });
  },

  'click .edit-product': function(event) {
    event.preventDefault();
    var sessionId = Session.get('userSessionId');

    var id = String(this._id);
    var idClass='.'+id;
    var idEnable = idClass+'-toggle';
    var idIcon = idEnable+'-icon';
    var isEditable = '.isEditable-'+String(this._id);
    var notEditable = '.notEditable-'+String(this._id);

    if ($(idEnable).hasClass('enabled')) {
      let product = {
        'productId': id,
        'productIdentifier': $.trim($('.productIdentifier, '+id).val()),
        'productName': $.trim($('.productName, '+id).val()),
        'productDescription': $.trim($('.productDescription, '+id).val()),
        'productUnitPrice': $.trim($('.productUnitPrice, '+id).val()),
        'productTaxCode': $.trim($('.productTaxCode, '+id).val())
      };
      Meteor.call('editProduct', sessionId, product, function(err,res){
        if (err) {
          Bert.alert('Product could not be updated: '+err, 'danger');
          return
        } else {
          Bert.alert('Product updated successfully.', 'success');
          $(notEditable).show();
          $(isEditable).hide();
          $(idEnable).removeClass('enabled');
          $(idEnable).addClass('btn-info');
          $(idEnable).removeClass('btn-success');
          $(idIcon).text('edit');
        }
      });
    } else {
      $(notEditable).hide();
      $(isEditable).show();
      $(idEnable).addClass('enabled');
      $(idEnable).removeClass('btn-info');
      $(idEnable).addClass('btn-success');
      $(idIcon).text('done');
    }
  }
});
