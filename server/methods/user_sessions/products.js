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
    }, function(err,res){
      if (err) {
        console.log(err);
      } else {
        Meteor.call('createSessionEvent',sessionId,'Created new product.\nProduct Name: '+product.productName+`\n`+'Product Description: '+product.productDescription+`\n`+'Product ID: '+product.productIdentifier+`\n`+'Product Unit Price: '+product.productUnitPrice+`\n`+'Product Tax Code: '+product.productTaxCode);
      }
    })
  },

  deleteProduct: function(productId) {
    Product.remove({
      _id: productId
    }, function(err,res){
      if (err) {
        console.log(err);
      } else {
        return res
      }
    })
  }

});
