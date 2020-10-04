const Taxjar = require('taxjar');

Meteor.methods({
  seedSoftware: function(sessionId) {
    Product.insert({
      'sessionId': sessionId,
      'productName': 'SaaS Subscription',
      'productIdentifier': '001-software',
      'productDescription': 'A Software as a Service Subscription fee.',
      'productUnitPrice': 99.98,
      'productTaxCode': '81162000A0000'
    }, function(err, res) {
      if (err) {
        console.log(err);
        return err
      }
    });

    Product.insert({
      'sessionId': sessionId,
      'productName': 'Business Desktop Software',
      'productIdentifier': '002-software',
      'productDescription': 'Our electronically downloadable Desktop Software for businesses.',
      'productUnitPrice': 299.98,
      'productTaxCode': '43230000A9200'
    }, function(err, res) {
      if (err) {
        console.log(err);
        return err
      }
    });

    Product.insert({
      'sessionId': sessionId,
      'productName': 'Software Maintenance and Support',
      'productIdentifier': '003-software',
      'productDescription': 'Optional upgrades, add-ons, and product support plan.',
      'productUnitPrice': 299.98,
      'productTaxCode': '81112200A1121'
    }, function(err, res) {
      if (err) {
        console.log(err);
        return err
      }
    });
  },

  seedFoodBeverage: function(sessionId) {
    Product.insert({
      'sessionId': sessionId,
      'productName': 'Critically Acclaimed Cheese (3 lbs)',
      'productIdentifier': '001-fb',
      'productDescription': 'You will have to try it for yourself!',
      'productUnitPrice': 29.99,
      'productTaxCode': '50131800A0000'
    }, function(err, res) {
      if (err) {
        console.log(err);
        return err
      }
    });

    Product.insert({
      'sessionId': sessionId,
      'productName': 'Critically Acclaimed Chocolate (1 bar)',
      'productIdentifier': '002-fb',
      'productDescription': 'Cocoa goodness.',
      'productUnitPrice': 7.99,
      'productTaxCode': '50161511A0000'
    }, function(err, res) {
      if (err) {
        console.log(err);
        return err
      }
    });

    Product.insert({
      'sessionId': sessionId,
      'productName': 'Critically Acclaimed Coffee (48oz)',
      'productIdentifier': '003-fb',
      'productDescription': 'Who can live without it?',
      'productUnitPrice': 17.99,
      'productTaxCode': '50201700A0000'
    }, function(err, res) {
      if (err) {
        console.log(err);
        return err
      }
    });
  },

  seedServices: function(sessionId) {
    Product.insert({
      'sessionId': sessionId,
      'productName': 'Digital Data Processing Services',
      'productIdentifier': '001-services',
      'productDescription': 'We will process your digital data.',
      'productUnitPrice': 399.99,
      'productTaxCode': '81112001A0000'
    }, function(err, res) {
      if (err) {
        console.log(err);
        return err
      }
    });

    Product.insert({
      'sessionId': sessionId,
      'productName': 'Disaster Recovery Services',
      'productIdentifier': '002-services',
      'productDescription': 'Recovery when disaster strikes.',
      'productUnitPrice': 649.99,
      'productTaxCode': '81112004A0000'
    }, function(err, res) {
      if (err) {
        console.log(err);
        return err
      }
    });

    Product.insert({
      'sessionId': sessionId,
      'productName': 'Top Line Quality Assurance',
      'productIdentifier': '003-services',
      'productDescription': 'QA for all your QA needs.',
      'productUnitPrice': 149.99,
      'productTaxCode': '81111819A0000'
    }, function(err, res) {
      if (err) {
        console.log(err);
        return err
      }
    });
  },

  seedFullyTaxable: function(sessionId) {
    Product.insert({
      'sessionId': sessionId,
      'productName': 'Kitchen Gadget',
      'productIdentifier': '001-taxable',
      'productDescription': 'Make kitchen stuff easier.',
      'productUnitPrice': 12.99,
      'productTaxCode': ''
    }, function(err, res) {
      if (err) {
        console.log(err);
        return err
      }
    });

    Product.insert({
      'sessionId': sessionId,
      'productName': 'Fall Decor Kit',
      'productIdentifier': '002-taxable',
      'productDescription': 'Festive and ornamental.',
      'productUnitPrice': 99.99,
      'productTaxCode': ''
    }, function(err, res) {
      if (err) {
        console.log(err);
        return err
      }
    });

    Product.insert({
      'sessionId': sessionId,
      'productName': '5x7 Picture Frame',
      'productIdentifier': '003-taxable',
      'productDescription': 'A picture is worth a thousand words.',
      'productUnitPrice': 6.99,
      'productTaxCode': ''
    }, function(err, res) {
      if (err) {
        console.log(err);
        return err
      }
    });
  },

  async syncProductTaxCodes(sessionId, token) {
    const client = new Taxjar({
      apiKey: token
    });

    const result = await client.categories().then(res => {
      Meteor.call('createSessionEvent', sessionId, 'Calling GET /v2/categories (https://developers.taxjar.com/api/reference/#categories) to retrieve product tax code data.');
      return res
    }).then(function(res) {
      Meteor.call('createSessionEvent', sessionId, 'Product tax code data retrieved. Creating or updating product tax code data to database.');
      var data = res.categories;
      data.forEach((obj) => {
        TaxCategory.insert({
          'sessionId': sessionId,
          'name': obj.name,
          'description': obj.description,
          'productTaxCode': obj.product_tax_code
        });
      });
      return true
    }).then(function() {
      var successCount = TaxCategory.find({
        'sessionId': sessionId
      }).count();
      Meteor.call('createSessionEvent', sessionId, 'Successfully loaded ' + successCount + ' product tax codes.');
      return successCount
    }).catch(function(err) {
      console.log(err);
    });
    return result
  },

  updateStarred: function(taxCategory) {
    if (taxCategory.starred) {
      TaxCategory.update({
        _id: taxCategory._id
      }, {
        $set: {
          starred: false
        }
      });
    } else {
      TaxCategory.update({
        _id: taxCategory._id
      }, {
        $set: {
          starred: true
        }
      })
    }
  },

  getProducts: function(sessionId) {
    return Product.find({
      'sessionId': sessionId
    }).fetch();
  },

  createProduct: function(sessionId, product) {
    Product.insert({
      'sessionId': sessionId,
      'productName': product.productName,
      'productDescription': product.productDescription,
      'productIdentifier': product.productIdentifier,
      'productUnitPrice': product.productUnitPrice,
      'productTaxCode': product.productTaxCode
    }, function(err, res) {
      if (err) {
        console.log(err);
      } else {
        Meteor.call('createSessionEvent', sessionId, 'Created new product.\nProduct Name: ' + 'Product Identifier: ' + product.productIdentifier + '\nProduct Name: ' + product.productName + '\nProduct Description: ' + product.productDescription + '\nProduct Unit Price: ' + product.productUnitPrice + '\nProduct Tax Code: ' + product.productTaxCode);
      }
    })
  },

  deleteProduct: function(sessionId, product) {
    Product.remove({
      _id: product._id
    }, function(err, res) {
      if (err) {
        console.log(err);
      } else {
        Meteor.call('createSessionEvent', sessionId, 'Product deleted:\n' + 'Product Identifier: ' + product.productIdentifier + '\nProduct Name: ' + product.productName + '\nProduct Description: ' + product.productDescription + '\nProduct Unit Price: ' + product.productUnitPrice + '\nProduct Tax Code: ' + product.productTaxCode);
        return res
      }
    })
  },

  // async editProduct(sessionId, product) {
  //
  //   try {
  //     Product.update({
  //       _id: product.productId
  //     }, {
  //       $set: {
  //         'productName': product.productName,
  //         'productDescription': product.productDescription,
  //         'productIdentifier': product.productIdentifier,
  //         'productUnitPrice': product.productUnitPrice,
  //         'productTaxCode': product.productTaxCode
  //       }
  //     }, function(err, res) {
  //       if (err) {
  //         console.log(err);
  //         return err
  //       } else {
  //         console.log(product);
  //         console.log(Product.findOne({_id: product.productId}));
  //         Meteor.call('createSessionEvent', sessionId, 'Product Updated:\n' + 'Product Identifier: ' + product.productIdentifier + '\nProduct Name: ' + product.productName + '\nProduct Description: ' + product.productDescription + '\nProduct Unit Price: ' + product.productUnitPrice + '\nProduct Tax Code: ' + product.productTaxCode);
  //         return res
  //       }
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   };
  // }

  editProduct: function(sessionId, product) {
    Product.update({
      _id: product.productId
    }, {
      $set: {
        'productName': product.productName,
        'productDescription': product.productDescription,
        'productIdentifier': product.productIdentifier,
        'productUnitPrice': product.productUnitPrice,
        'productTaxCode': product.productTaxCode
      }
    }, function(err,res){
      if (err) {
        console.log(err);
        return err
      } else {
        Meteor.call('createSessionEvent', sessionId, 'Product Updated:\n'+'Product Identifier: '+product.productIdentifier+'\nProduct Name: '+product.productName+'\nProduct Description: '+product.productDescription+'\nProduct Unit Price: '+product.productUnitPrice+'\nProduct Tax Code: '+product.productTaxCode);
      }
    })
  }

});
