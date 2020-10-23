Meteor.methods({

  validateReq: function(taxesReq) {
    var addressDetails = {};
    var shippingDetails = {};
    var lineItemDetails = {};

    if (taxesReq.from_street && taxesReq.from_city && taxesReq.from_state && taxesReq.from_zip && taxesReq.from_country) {
      addressDetails.from_valid = true;
    } else {
      addressDetails.from_valid = false;
    };
    if (taxesReq.to_street && taxesReq.to_city && taxesReq.to_state && taxesReq.to_zip && taxesReq.to_country) {
      addressDetails.to_valid = true;
    } else {
      addressDetails.to_valid = false;
    };

    if (!taxesReq.to_street) {
      addressDetails.to_street_missing = true;
    } else {
      addressDetails.to_street_missing = false;
    };

    if (!taxesReq.to_city) {
      addressDetails.to_city_missing = true;
    } else {
      addressDetails.to_city_missing = false;
    };

    if (!taxesReq.to_state) {
      addressDetails.to_state_missing = true;
    } else {
      addressDetails.to_state_missing = false;
    }

    if (!taxesReq.to_zip) {
      addressDetails.to_zip_missing = true;
    } else {
      addressDetails.to_zip_missing = false;
    }

    if (!taxesReq.to_country) {
      addressDetails.to_country_missing = true;
    } else {
      addressDetails.to_country_missing = false;
    };

    var shippingDetails = {};
    if (!taxesReq.shipping) {
      shippingDetails.shipping_missing = true;
    } else {
      shippingDetails.shipping_missing = false;
    }

    var lineItems = taxesReq.line_items;
    var amount = parseFloat(taxesReq.amount);
    var total = 0;

    lineItems.forEach((lineItem) => {
      var liTotal = lineItem.unit_price * lineItem.quantity - lineItem.discount;
      total += liTotal
    });

    if (amount && amount !== null) {
      if (total !== amount) {
        lineItemDetails.lineItemsEqualsAmount = false;
      } else {
        lineItemDetails.lineItemsEqualsAmount = true;
      }
    } else {
      lineItemDetails.noAmount = true;
    }

    lineItemDetails.lineItemsTotal = total;
    lineItemDetails.amount = amount;

    var data = {
      addressDetails: addressDetails,
      shippingDetails: shippingDetails,
      lineItemDetails: lineItemDetails
    };

    return data
  },

  insightMessages: function(insights) {
    // Address validation details
    var validations = [];
    //Both are valid
    if (insights.addressDetails.from_valid == true && insights.addressDetails.to_valid == true) {
      data = {
        message: "Both 'from_' and 'to_' params are complete.",
        icon: 'check_circle',
        color: 'card-header-success'
      };
      validations.push(data);
    }

    //No from params but to params valid
    if (insights.addressDetails.from_valid == false && insights.addressDetails.to_valid == true) {
      data = {
        message: "No 'from_' parameters, assuming account Business Profile address. 'to_' parameters are complete.",
        icon: 'check_circle',
        color: 'card-header-success'
      };

      validations.push(data);
    }

    if (insights.addressDetails.to_state_missing == true) {
      data = {
        message: "'to_state' is missing. This is a required parameters.",
        icon: 'cancel',
        color: 'card-header-danger'
      };
      validations.push(data);
    }

    if (insights.addressDetails.to_zip_missing == true) {
      data = {
        message: "'to_zip' is missing. This is a required parameters.",
        icon: 'cancel',
        color: 'card-header-danger'
      };
      validations.push(data);
    }

    if (insights.shippingDetails.shipping_missing == true) {
      data = {
        message: "'shipping' is missing. This is a required parameters.",
        icon: 'cancel',
        color: 'card-header-danger'
      };
      validations.push(data);
    } else {
      data = {
        message: "'shipping' is present.",
        icon: 'check_circle',
        color: 'card-header-success'
      };
      validations.push(data);
    }

    if (insights.lineItemDetails.lineItemsEqualsAmount == true) {
      data = {
        message: "Sum of 'line_items' (" + insights.lineItemDetails.lineItemsTotal + ") equals 'amount'.",
        icon: 'check_circle',
        color: 'card-header-success'
      };
      validations.push(data);
    } else {
      data = {
        message: "Sum of 'line_items' (" + insights.lineItemDetails.lineItemsTotal + ") does not equal 'amount' (" + insights.lineItemDetails.amount + "). Calculation would still be accepted.",
        icon: 'warning',
        color: 'card-header-warning'
      };
      validations.push(data);
    }

    return validations
  }
});
