Meteor.publish('tax_categories', function(search) {
  check(search, Match.OneOf(String, null, undefined));

  let query = {},
    projection = {
      limit: 25,
      sort: {
        starred: -1
      }
    };

  if (search) {
    let regex = new RegExp(search, 'i');
    if (search == 'starred') {
      query = {
        starred: true
      }
    } else {
      query = {
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

    projection.limit = 100;
  }

  return TaxCategory.find(query, projection);
});
