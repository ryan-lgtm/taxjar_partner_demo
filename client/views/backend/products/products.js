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

    Product.find({
      'sessionId': sessionId
    }).count();

    var results = Meteor.call('getProducts', sessionId, function(err, res) {
      if (err) {
        Bert.alert('An unexpected error occurred.', 'danger');
      } else {
        Session.set('products', res)
      }
    });
    return results
  });
})

Template.manageProducts.helpers({
  products: function() {
    return Session.get('products');
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

    if ($('#seedFullyTaxable').is(':checked')) {
      Meteor.call('seedFullyTaxable', sessionId, function(err, res) {
        if (err) {
          Bert.alert('An unexpected error occurred.', 'danger');
        } else {
          Meteor.call('createSessionEvent', sessionId, 'Seeded fully taxable product data.');
        }
      });
    }

    Bert.alert('Successfully seeded product data.', 'success');
  },

  'click .retrieve-ptcs': function(event) {
    event.preventDefault();
    $('.retrieve-ptcs').attr('disabled',true);
    $('.retrieve-ptcs').removeClass('btn-warning');
    $('.retrieve-ptcs').addClass('btn-default');

    Meteor.call('syncProductTaxCodes', Session.get('userSessionId'), Session.get('apiToken'), function(err, res) {
      if (err) {
        Bert.alert('Error: ' + err, 'danger');
      } else {
        Bert.alert('Successfully synced ' + res + ' product tax categories.', 'success');
      }
    });
  },

  'click .create-product': function(event) {
    event.preventDefault();
    var sessionId = Session.get('userSessionId');

    var product = {
      'productName': $.trim($('#newProductName').val()),
      'productDescription': $.trim($('#newProductDescription').val()),
      'productIdentifier': $.trim($('#newProductId').val()),
      'productUnitPrice': $.trim($('#newProductUnitPrice').val()),
    };

    if ($('.toggle-input').hasClass('hidden')) {
      product['productTaxCode'] = $('#starredPtcs option:selected').attr('value');
    } else {
      product['productTaxCode'] = $.trim($('#newProductTaxCode').val());
    }

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

    Meteor.call('deleteProduct', sessionId, this, function(err, res) {
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
    FlowRouter.go('/manage-products/edit/' + this._id);
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
