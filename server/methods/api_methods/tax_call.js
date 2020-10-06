const Taxjar = require('taxjar');

Meteor.methods({
  async taxCall(taxReq, sessionId, transactionId, token) {
    const client = new Taxjar({
      apiKey: token
    });

    var requestPayload = {
      from_street: taxReq.fromParams.streetAddress,
      from_city: taxReq.fromParams.city,
      from_state: taxReq.fromParams.state,
      from_zip: taxReq.fromParams.zipCode,
      from_country: taxReq.fromParams.country,
      to_street: taxReq.toParams.toStreetAddress,
      to_city: taxReq.toParams.toCity,
      to_state: taxReq.toParams.toState,
      to_zip: taxReq.toParams.toZipCode,
      to_country: taxReq.toParams.toCountry,
      customer_id: taxReq.customerId,
      amount: parseFloat(taxReq.amount),
      shipping: parseFloat(taxReq.shipping),
      line_items: taxReq.lineItems
    };
    Meteor.call('createSessionEvent', sessionId, 'Called TaxJar for sales tax calculation with the following:\n' + JSON.stringify(requestPayload, null, 4));

    const result = await client.taxForOrder(requestPayload)
    .then(res => {
      Meteor.call('createSessionEvent', sessionId, 'Received from TaxJar the following:\n' + JSON.stringify(res, null, 4));
      Meteor.call('createSessionEvent', sessionId, 'Amount to collect: ' + res.tax.amount_to_collect);
      Calculation.insert({
        sessionId: sessionId,
        forTransaction: transactionId,
        reqBody: JSON.stringify(requestPayload),
        resBody: JSON.stringify(res)
      });
      return res
    }).catch(function(err) {
      Meteor.call('createSessionEvent', sessionId, 'Could not calculate sales tax: ' + err);
    });

    return result;
  }
})
