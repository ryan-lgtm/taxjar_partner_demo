import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';

import {
  $
} from 'meteor/jquery';

Template.editProduct.onCreated(function() {

  let template = Template.instance();

  let productId = FlowRouter.getParam('id');
  Session.set('productId', productId);

  template.autorun(function() {
    let currentProduct = Product.findOne({
      _id: Session.get('productId')
    });


    if (currentProduct) {
      Session.set('currentProduct', currentProduct);
      Session.set('productId', currentProduct.productIdentifier);
      Session.set('productName', currentProduct.productName);
      Session.set('productDescription', currentProduct.productDescription);
      Session.set('productUnitPrice', currentProduct.productUnitPrice);
      Session.set('productTaxCode', currentProduct.productTaxCode);
    }
  });
});

Template.editProduct.helpers({
  currentProduct: function() {
    return Session.get('currentProduct');
  },

  starred: function() {
    var sessionId = Session.get('userSessionId');
    var starred = TaxCategory.find({
      sessionId: sessionId,
      starred: true
    }).fetch()

    if (starred) {
      return starred
    }
  }
});

Template.editProduct.events({
  'click .save-product': function(event) {
    event.preventDefault();
    var sessionId = Session.get('userSessionId');
    let productId = FlowRouter.getParam('id');
    var product = {
      'productId': productId,
      'productName': $.trim($('#productName').val()),
      'productDescription': $.trim($('#productDescription').val()),
      'productIdentifier': $.trim($('#productIdentifier').val()),
      'productUnitPrice': $.trim($('#productUnitPrice').val()),
    };

    if ($('.toggle-input').hasClass('hidden')) {
      product['productTaxCode'] = $('#starredPtcs option:selected').attr('value');
    } else {
      product['productTaxCode'] = $.trim($('#productTaxCode').val());
    }

    if (product.productName.length == 0 || product.productUnitPrice.length == 0) {
      $('.missingRequired').show();
      return false
    } else {
      Meteor.call('editProduct', sessionId, product, function(err, res) {
        if (err) {
          Bert.alert('An unexpected error has occurred.', 'danger');
          console.log(err);
        } else {
          Bert.alert('Product updated successfully.', 'success');
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

  'click #enterInstead': function(event) {
    event.preventDefault();

    if ($('.toggle-input').hasClass('hidden')) {
      $('#starredPtcs').hide();
      $('.toggle-input').removeClass('hidden');
      $('.toggle-input').show();
    } else {
      $('#starredPtcs').show();
      $('.toggle-input').addClass('hidden');
      $('.toggle-input').hide();
    }
  }
});

Template.editProduct.destroyed = function() {
  Session.set('currentProduct', null);
  Session.set('productId', null);
  Session.set('productName', null);
  Session.set('productDescription', null);
  Session.set('productUnitPrice', null);
  Session.set('productTaxCode', null);
}
