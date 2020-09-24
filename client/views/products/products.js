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

  //template.sessionEvents = new ReactiveVar();

  template.autorun(() => {
    var sessionId = Session.get('userSessionId');
    var products = Product.find({
      'sessionId': sessionId
    }).count();

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

    Meteor.call('deleteProduct', this._id, function(err,res){
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
    var id = '.'+String(this._id);
    var idIcon = id+'-icon';
    if ($(id).hasClass('enabled')) {
      $(id).removeClass('enabled');
      $(id).addClass('btn-info');
      $(id).removeClass('btn-success');
      $(idIcon).text('edit');
    } else {
      $(id).addClass('enabled');
      $(id).removeClass('btn-info');
      $(id).addClass('btn-success');
      $(idIcon).text('done');
    }
  }
  // 'click .retrieve-nexus': function(event) {
  //   event.preventDefault();
  //   if (Session.get('enableApi') == 'true') {
  //     Meteor.call('retrieveNexus', Session.get('apiToken'), Session.get('userSessionId'), function(err,res){
  //       if (err) {
  //         Session.set('fetchingResults', false);
  //         Bert.alert('An unexpected error occurred.', 'danger');
  //       } else {
  //         Session.set('fetchingResults', false);
  //         Session.set('nexusStates', res.regions);
  //         console.log(Session.get('nexusStates'));
  //       }
  //     });
  //   } else {
  //     Meteor.call('createSessionEvent', Session.get('userSessionId'), 'Could not retrieve nexus locations. API is not enabled.');
  //     Bert.alert('Could not retrieve nexus locations. API is not enabled.', 'danger');
  //   }
  // }
});
