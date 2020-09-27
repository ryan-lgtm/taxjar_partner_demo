const Taxjar = require('taxjar');

Meteor.methods({

  getCustomers: function(sessionId) {
    return Customer.find({
      'sessionId': sessionId
    }).fetch();
  },

  seedCustomers: function(sessionId) {
    Customer.insert({
      'sessionId': sessionId,
      'customerIdentifier': 'CUST-001',
      'customerName': 'Non-exempt Nate',
      'customerStreet': '919 W 34th St',
      'customerCity': 'Baltimore',
      'customerState': 'MD',
      'customerZip': '21211',
      'customerCountry': 'US',
      'customerExemptionType': 'non_exempt'
    }, function(err, res) {
      if (err) {
        console.log(err);
        return err
      }
    });

    Customer.insert({
      'sessionId': sessionId,
      'customerIdentifier': 'CUST-002',
      'customerName': 'Wholesale Holly',
      'customerStreet': '9663 Santa Monica Blvd',
      'customerCity': 'Beverly Hills',
      'customerState': 'CA',
      'customerZip': '90210',
      'customerCountry': 'US',
      'customerExemptionType': 'wholesale'
    }, function(err, res) {
      if (err) {
        console.log(err);
        return err
      }
    });

    Customer.insert({
      'sessionId': sessionId,
      'customerIdentifier': 'CUST-003',
      'customerName': 'Government Gary',
      'customerStreet': '705 Oak Cir Dr W',
      'customerCity': 'Mobile',
      'customerState': 'AL',
      'customerZip': '36609',
      'customerCountry': 'US',
      'customerExemptionType': 'government'
    }, function(err, res) {
      if (err) {
        console.log(err);
        return err
      }
    });

    Customer.insert({
      'sessionId': sessionId,
      'customerIdentifier': 'CUST-004',
      'customerName': 'Other Olaf',
      'customerStreet': '1500 Hadley St',
      'customerCity': 'Houston',
      'customerState': 'TX',
      'customerZip': '77002',
      'customerCountry': 'US',
      'customerExemptionType': 'other'
    }, function(err, res) {
      if (err) {
        console.log(err);
        return err
      }
    });
  },

  async syncCustomers(sessionId, token) {
    const client = new Taxjar({
      apiKey: token
    });

    // 1.) Retrieve local customerId's
    var customerIds = [];
    var customers = Customer.find({
      'sessionId': sessionId
    }).fetch();

    customers.forEach((customer) => {
      customerIds.push(customer.customerIdentifier);
    });

    // 2.) Get remote customer ID's
    const result = await client.listCustomers().then(res => {
      // Capture the remote customer ID's
      var customerIdsRemote = res.customers;
      // Identify which local customer ID's do not exist remotely.
      var unsynced = customerIds.filter(function(obj) {
        return customerIdsRemote.indexOf(obj) == -1;
      });

      return unsynced
    }).then(function(unsynced) {
      // 3.) For each customer record that exists in-app and not in TaxJar, create it in TaxJar.
      unsynced.forEach((record) => {
        var customer = Customer.findOne({
          'sessionId': sessionId,
          'customerIdentifier': record
        });
        data = {
          'customer_id': customer.customerIdentifier,
          'exemption_type': customer.customerExemptionType,
          'name': customer.customerName,
          'country': customer.customerCountry,
          'state': customer.customerState,
          'zip': customer.customerZip,
          'city': customer.customerCity,
          'street': customer.customerStreet
        };
        client.createCustomer(data).then(res => {
          Meteor.call('createSessionEvent', sessionId, 'Synced customer data to TaxJar: ' + JSON.stringify(res, null, 4));
        })
      });
    }).catch(function(err) {
      console.log(err);
    });
    return result
  },

  createCustomer: function(sessionId, customer) {
    Customer.insert({
      'sessionId': sessionId,
      'customerIdentifier': customer.customerIdentifier,
      'customerName': customer.customerName,
      'customerStreet': customer.customerStreet,
      'customerCity': customer.customerCity,
      'customerState': customer.customerState,
      'customerZip': customer.customerZip,
      'customerCountry': customer.customerCountry,
      'customerExemptionType': customer.customerExemptionType
    }, function(err, res) {
      if (err) {
        console.log(err);
      } else {
        Meteor.call('createSessionEvent', sessionId, 'Created new customer.\nCustomer ID: ' + customer.customerIdentifier + '\nCustomer Name: ' + customer.customerName + '\nCustomer Street: ' + customer.customerStreet + '\nCustomer City: ' + customer.customerCity + '\nCustomer State: ' + customer.customerState + '\nCustomer Zip Code: ' + customer.customerZip + '\nCustomer Country Code: ' + customer.customerCountry + '\nCustomer Exemption Type: ' + customer.customerExemptionType);
      }
    })
  },

  deleteCustomer: function(sessionId, token, customer) {
    const client = new Taxjar({
      apiKey: token
    });
    client.deleteCustomer(customer.customerIdentifier).then(res => {
      Customer.remove({
        _id: customer._id
      }, function(err, res) {
        if (err) {
          console.log(err);
        } else {
          Meteor.call('createSessionEvent', sessionId, 'Deleted customer from app and TaxJar.\nCustomer ID: ' + customer.customerIdentifier + '\nCustomer Name: ' + customer.customerName + '\nCustomer Street: ' + customer.customerStreet + '\nCustomer City: ' + customer.customerCity + '\nCustomer State: ' + customer.customerState + '\nCustomer Zip Code: ' + customer.customerZip + '\nCustomer Country Code: ' + customer.customerCountry + '\nCustomer Exemption Type: ' + customer.customerExemptionType)
          return res
        }
      })
    });
  },

  editCustomer: function(sessionId, customer) {
    Customer.update({
      _id: customer.customerId
    }, {
      $set: {
        'customerName': customer.customerName,
        'customerIdentifier': customer.customerIdentifier,
        'customerStreet': customer.customerStreet,
        'customerCity': customer.customerCity,
        'customerState': customer.customerState,
        'customerZip': customer.customerZip,
        'customerCountry': customer.customerCountry,
        'customerExemptionType': customer.customerExemptionType
      }
    }, function(err,res){
      if (err) {
        console.log(err);
        return err
      } else {
        Meteor.call('createSessionEvent', sessionId, 'Updated customer.\nCustomer ID: ' + customer.customerIdentifier + '\nCustomer Name: ' + customer.customerName + '\nCustomer Street: ' + customer.customerStreet + '\nCustomer City: ' + customer.customerCity + '\nCustomer State: ' + customer.customerState + '\nCustomer Zip Code: ' + customer.customerZip + '\nCustomer Country Code: ' + customer.customerCountry + '\nCustomer Exemption Type: ' + customer.customerExemptionType);
      }
    })
  }

});
