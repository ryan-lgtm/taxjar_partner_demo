Template.taxCategorySearch.onCreated( () => {

  let template = Template.instance();

  template.searchQuery = new ReactiveVar();
  template.searching   = new ReactiveVar( false );

  template.autorun( () => {
    template.subscribe( 'tax_categories', template.searchQuery.get(), () => {
      setTimeout( () => {
        template.searching.set( false );
      }, 300 );
    });
  });
});

Template.taxCategorySearch.helpers({
  ptcsSynced() {
    let sessionId = Session.get('userSessionId');

    let ptcCount = TaxCategory.find({
      sessionId: sessionId
    }).count();

    if (ptcCount == 0) {
      return false
    } else {
      return true
    }
  },

  searching() {
    return Template.instance().searching.get();
  },

  query() {
    return Template.instance().searchQuery.get();
  },

  taxCodes() {
    let sessionId = Session.get('userSessionId');
    let taxCodes = TaxCategory.find({sessionId: sessionId});

    if (taxCodes) {
      return taxCodes;
    }
  },

  starred() {
    if (this.starred) {
      return true
    }
  }
});

Template.taxCategorySearch.events({
  'keyup [name="search"]' (event, template) {
    let value = event.target.value.trim();

    if (value !== '' && event.keyCode === 13) {
      template.searchQuery.set(value);
      template.searching.set(true);
    }

    if (value == '') {
      template.searchQuery.set(value);
      template.searching.set(true);
    }
  },

  'click .star-ptc' (event, template) {
    event.preventDefault();

    Meteor.call('updateStarred', this, function(err,res){
      if (err) {
        Bert.alert('Could not update starred PTC.', 'danger');
      } else {
        return
      }
    });
  },

  'click .view-starred' (event, template) {
    event.preventDefault();
    template.searchQuery.set('starred');
    template.searching.set(true);
  }
})
