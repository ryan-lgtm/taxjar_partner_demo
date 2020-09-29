import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
// Full list of available classes and instances:
// { FlowRouter, Router, Route, Group, Triggers, BlazeRenderer, RouterHelpers }


//////////////////////////////////////////
// Route Groups                         //
//////////////////////////////////////////

var publicRoutes = FlowRouter.group({
  name: 'public'
});

//////////////////////////////////////////
// Unauthenticated/Not Logged In Routes //
//////////////////////////////////////////

publicRoutes.route('/', {
  action: function() {
    BlazeLayout.render("mainLayout", {
      content: 'home'
    });
  }
});

publicRoutes.route('/manage-locations', {
  action: function() {
    BlazeLayout.render("mainLayout", {
      content: 'manageLocations'
    });
  }
});

publicRoutes.route('/manage-products', {
  action: function() {
    BlazeLayout.render("mainLayout", {
      content: 'manageProducts'
    });
  }
});

publicRoutes.route('/manage-products/edit/:id', {
  action: function() {
    BlazeLayout.render("mainLayout", {
      content: 'editProduct'
    });
  }
});

publicRoutes.route('/manage-customers', {
  action: function() {
    BlazeLayout.render("mainLayout", {
      content: 'manageCustomers'
    });
  }
});

publicRoutes.route('/manage-customers/edit/:id', {
  action: function() {
    BlazeLayout.render("mainLayout", {
      content: 'editCustomer'
    });
  }
});

publicRoutes.route('/transactions', {
  action: function() {
    BlazeLayout.render("mainLayout", {
      content: 'transactions'
    });
  }
});

publicRoutes.route('/configuration', {
  action: function() {
    BlazeLayout.render("mainLayout", {
      content: 'configuration'
    });
  }
});

publicRoutes.route('/customer-options', {
  action: function() {
    BlazeLayout.render("mainLayout", {
      content: 'customerOptions'
    });
  }
});

publicRoutes.route('/shop', {
  action: function() {
    BlazeLayout.render("mainLayout", {
      content: 'shop'
    });
  }
});

publicRoutes.route('/checkout', {
  action: function() {
    BlazeLayout.render("mainLayout", {
      content: 'checkout'
    });
  }
});
