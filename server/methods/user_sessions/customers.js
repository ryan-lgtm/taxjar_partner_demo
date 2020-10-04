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
      'customerName': 'Other Oliver',
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
      var unsyncedFromApp = customerIds.filter(function(obj) {
        return customerIdsRemote.indexOf(obj) == -1;
      });
      // Identify which remote customers do not exist locally.
      var unsyncedFromTaxJar = customerIdsRemote.filter(function(obj) {
        return customerIds.indexOf(obj) == -1;
      })

      var unsynced = {
        'unsyncedFromApp': unsyncedFromApp,
        'unsyncedFromTaxJar': unsyncedFromTaxJar
      }
      return unsynced
    }).then(function(unsynced) {
      // 3.) For each customer record that exists in-app and not in TaxJar, create it in TaxJar.
      unsynced.unsyncedFromApp.forEach((record) => {
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

      // 4.) For each customer record that exists in TaxJar but not in-app, create it in the database.
      if (unsynced.unsyncedFromTaxJar.length > 101) {
        Meteor.call('createSessionEvent', sessionId, 'Cannot sync customers from TaxJar. Too many customer records: ' + unsynced.unsyncedFromTaxJar.length);
      } else {
        unsynced.unsyncedFromTaxJar.forEach((record) => {
          client.showCustomer(record).then(res => {
            data = {
              'sessionId': sessionId,
              'customerIdentifier': res.customer.customer_id,
              'customerExemptionType': res.customer.exemption_type,
              'customerName': res.customer.name,
              'customerStreet': res.customer.street,
              'customerCity': res.customer.city,
              'customerState': res.customer.state,
              'customerZip': res.customer.zip,
              'customerCountry': res.customer.country
            }
            Customer.insert(data);
            Meteor.call('createSessionEvent', sessionId, 'Synced data from TaxJar to database:' + JSON.stringify(res, null, 4));
          });
        });
      }
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
    }, function(err, res) {
      if (err) {
        console.log(err);
        return err
      } else {
        Meteor.call('createSessionEvent', sessionId, 'Updated customer.\nCustomer ID: ' + customer.customerIdentifier + '\nCustomer Name: ' + customer.customerName + '\nCustomer Street: ' + customer.customerStreet + '\nCustomer City: ' + customer.customerCity + '\nCustomer State: ' + customer.customerState + '\nCustomer Zip Code: ' + customer.customerZip + '\nCustomer Country Code: ' + customer.customerCountry + '\nCustomer Exemption Type: ' + customer.customerExemptionType);
      }
    })
  }

});
