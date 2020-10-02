Meteor.publish('tax_categories', function(search) {
  check(search, Match.OneOf(String, null, undefined));

  var sessionId = this.connection.id;
  let query = {},
    projection = {
      sort: {
        starred: -1
      }
    };

  if (search) {
    let regex = new RegExp(search, 'i');
    if (search == 'starred') {
      query = {
        sessionId: sessionId,
        starred: true
      }
    } else {
      query = {
        sessionId: sessionId,
        $or: [{
            name: regex
          },
          {
            description: regex
          },
          {
            productTaxCode: regex
          }
        ]
      };
    }
  }
  return TaxCategory.find(query, projection);
});
