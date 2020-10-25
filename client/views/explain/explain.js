import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';

import {
  $
} from 'meteor/jquery'

import {
  Tracker
} from 'meteor/tracker'

Template.explain.onRendered(function() {


  Meteor.call('getCalculation', FlowRouter.getParam('id'), null, function(err,res){
    if (res) {
      Session.set('reqBody', JSON.parse(res.reqBody));
      Session.set('resBody', JSON.parse(res.resBody));
    }
  });
});

Template.explain.helpers({
  checkRounding: function() {
    var resBody = Session.get('resBody');
    var atc = resBody.tax.amount_to_collect;
    var lineItems = resBody.tax.breakdown.line_items;

    var total = 0;
    var decimalTotal = 0;
    lineItems.forEach((lineItem) => {
      total+= lineItem.tax_collectable;
      decimalTotal += (lineItem.taxable_amount * lineItem.combined_tax_rate);
    });

    if (resBody.tax.breakdown.shipping) {
      total += resBody.tax.breakdown.shipping.tax_collectable;
      decimalTotal += (resBody.tax.breakdown.shipping.taxable_amount * resBody.tax.breakdown.shipping.combined_tax_rate);
    };

    var total = parseFloat((total).toFixed(2));
    var decimalTotalRounded = parseFloat(decimalTotal.toFixed(2));

    if (atc !== total) {
      var pennyRounding = true;
    } else {
      var pennyRounding = false;
    }

    var data = {
      atc: atc,
      total: total,
      decimalTotal: decimalTotal,
      decimalTotalRounded: decimalTotalRounded,
      pennyRounding: pennyRounding
    };

    Session.set('taxableData', data);
    return data
  },

  reqBody: function() {
    parsedJson = JSON.parse(Session.get('reqBody'));
    return JSON.stringify(parsedJson, null, 4)
  },

  resBody: function() {
    parsedJson = JSON.parse(Session.get('resBody'));
    return JSON.stringify(parsedJson, null, 4)
  },

  //////////////////// REQUEST BODY DETAILS ////////////////////
  fromStreet: function() {
    var reqBody = Session.get('reqBody');
    return JSON.stringify(reqBody.from_street, null, 4);
  },

  fromCity: function() {
    var reqBody = Session.get('reqBody');
    return JSON.stringify(reqBody.from_city, null, 4);
  },

  fromState: function() {
    var reqBody = Session.get('reqBody');
    return JSON.stringify(reqBody.from_state, null, 4);
  },

  fromZip: function() {
    var reqBody = Session.get('reqBody');
    return JSON.stringify(reqBody.from_zip, null, 4);
  },

  fromCountry: function() {
    var reqBody = Session.get('reqBody');
    return JSON.stringify(reqBody.from_country, null, 4);
  },

  toStreet: function() {
    var reqBody = Session.get('reqBody');
    return JSON.stringify(reqBody.to_street, null, 4);
  },

  toCity: function() {
    var reqBody = Session.get('reqBody');
    return JSON.stringify(reqBody.to_city, null, 4);
  },

  toState: function() {
    var reqBody = Session.get('reqBody');
    return JSON.stringify(reqBody.to_state, null, 4);
  },

  toZip: function() {
    var reqBody = Session.get('reqBody');
    return JSON.stringify(reqBody.to_zip, null, 4);
  },

  toCountry: function() {
    var reqBody = Session.get('reqBody');
    return JSON.stringify(reqBody.to_country, null, 4);
  },

  reqAmount: function() {
    var reqBody = Session.get('reqBody');
    return reqBody.amount;
  },

  reqShipping: function() {
    var reqBody = Session.get('reqBody');
    return reqBody.shipping;
  },

  reqCustomerId: function() {
    var reqBody = Session.get('reqBody');
    return JSON.stringify(reqBody.customer_id, null, 4);
  },

  reqExemptionType: function() {
    var reqBody = Session.get('reqBody');
    return JSON.stringify(reqBody.exemption_type, null, 4);
  },

  reqLineItems: function() {
    var reqBody = Session.get('reqBody');
    return JSON.stringify(reqBody.line_items, null, 4);
  },

  //////////////////// RESPONSE BODY DETAILS ////////////////////

  /// TAX DETAILS
  orderTotalAmount: function() {
    var resBody = Session.get('resBody');
    return resBody.tax.order_total_amount;
  },

  resShipping: function() {
    var resBody = Session.get('resBody');
    return resBody.tax.shipping;
  },

  taxTaxableAmount: function() {
    var resBody = Session.get('resBody');
    return resBody.tax.taxable_amount;
  },

  amountToCollect: function() {
    var resBody = Session.get('resBody');
    return resBody.tax.amount_to_collect;
  },

  rate: function() {
    var resBody = Session.get('resBody');
    return resBody.tax.rate;
  },

  hasNexus: function() {
    var resBody = Session.get('resBody');
    return JSON.stringify(resBody.tax.has_nexus, null, 4);
  },

  freightTaxable: function() {
    var resBody = Session.get('resBody');
    return JSON.stringify(resBody.tax.freight_taxable, null, 4);
  },

  taxSource: function() {
    var resBody = Session.get('resBody');
    return JSON.stringify(resBody.tax.tax_source, null, 4);
  },

  jurisdictions: function() {
    var resBody = Session.get('resBody');
    return JSON.stringify(resBody.tax.jurisdictions, null, 4);
  },

  /// BREAKDOWN DETAILS
  breakdownTaxableAmount: function() {
    var resBody = Session.get('resBody');
    return resBody.tax.breakdown.taxable_amount;
  },

  breakdownTaxCollectable: function() {
    var resBody = Session.get('resBody');
    return resBody.tax.breakdown.tax_collectable;
  },

  breakdownCombinedTaxRate: function() {
    var resBody = Session.get('resBody');
    return resBody.tax.breakdown.combined_tax_rate;
  },

  breakdownStateTaxableAmount: function() {
    var resBody = Session.get('resBody');
    return resBody.tax.breakdown.state_taxable_amount;
  },

  breakdownStateTaxRate: function() {
    var resBody = Session.get('resBody');
    return resBody.tax.breakdown.state_tax_rate;
  },

  breakdownStateTaxCollectable: function() {
    var resBody = Session.get('resBody');
    return resBody.tax.breakdown.state_tax_collectable;
  },

  breakdownCountyTaxableAmount: function() {
    var resBody = Session.get('resBody');
    return resBody.tax.breakdown.county_taxable_amount;
  },

  breakdownCountyTaxRate: function() {
    var resBody = Session.get('resBody');
    return resBody.tax.breakdown.county_tax_rate;
  },

  breakdownCountyTaxCollectable: function() {
    var resBody = Session.get('resBody');
    return resBody.tax.breakdown.county_tax_collectable;
  },

  breakdownCityTaxableAmount: function() {
    var resBody = Session.get('resBody');
    return resBody.tax.breakdown.city_taxable_amount;
  },

  breakdownCityTaxRate: function() {
    var resBody = Session.get('resBody');
    return resBody.tax.breakdown.city_tax_rate;
  },

  breakdownCityTaxCollectable: function() {
    var resBody = Session.get('resBody');
    return resBody.tax.breakdown.city_tax_collectable;
  },

  breakdownSpecialTaxableAmount: function() {
    var resBody = Session.get('resBody');
    return resBody.tax.breakdown.special_district_taxable_amount;
  },

  breakdownSpecialTaxRate: function() {
    var resBody = Session.get('resBody');
    return resBody.tax.breakdown.special_tax_rate;
  },

  breakdownSpecialTaxCollectable: function() {
    var resBody = Session.get('resBody');
    return resBody.tax.breakdown.special_district_tax_collectable;
  },

  breakdownLineItems: function() {
    var resBody = Session.get('resBody');
    return JSON.stringify(resBody.tax.breakdown.line_items, null, 2);
  },

  breakdownShipping: function() {
    var resBody = Session.get('resBody');
    return JSON.stringify(resBody.tax.breakdown.shipping, null, 2);
  },

  reqLineItemDetails: function() { // This is so fricking dumb. See L145 of template.
    var reqBody = Session.get('reqBody');
    return reqBody
  },

  resLineItemDetails: function() { // This is so fricking dumb. See L387 of template.
    var resBody = Session.get('resBody');
    return resBody
  },

  getTotal: function() {
    return ((this.unit_price * this.quantity) - this.discount).toFixed(2)
  },

  getDecimal: function() {
    return ((this.combined_tax_rate * this.taxable_amount));
  },

  getRounded: function() {
    return ((this.combined_tax_rate * this.taxable_amount)).toFixed(2);
  },

  getTotalDecimal: function() {
    return Session.get('taxableData').decimalTotal
  },

  getTotalDecimalRounded: function() {
    return Session.get('taxableData').decimalTotal.toFixed(2);
  },

  getTotalRounded: function() {
    return Session.get('taxableData').total
  }
});

Template.explain.events({

});
