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
      content: 'manage-locations'
    });
  }
});

publicRoutes.route('/manage-products', {
  action: function() {
    BlazeLayout.render("mainLayout", {
      content: 'manage-products'
    });
  }
});

publicRoutes.route('/manage-customers', {
  action: function() {
    BlazeLayout.render("mainLayout", {
      content: 'manage-customers'
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

// authRoutes.route('/edit-expense/:expenseId', {
//   subscriptions: function() {
//     this.register('expense', Meteor.subscribe('expense'));
//   },
//   action: function() {
//     BlazeLayout.render("mainLayout", {
//       content: 'editExpense'
//     });
//   }
// });
//
// authRoutes.route('/delete-expense/:expenseId', {
//   subscriptions: function() {
//     this.register('expense', Meteor.subscribe('expense'));
//   },
//   action: function() {
//     BlazeLayout.render("mainLayout", {
//       content: 'deleteExpense'
//     });
//   }
// });
//
// authRoutes.route('/', {
//   subscriptions: function() {
//     this.register('expense', Meteor.subscribe('expense'));
//   },
//   action: function() {
//     BlazeLayout.render("mainLayout", {
//       content: 'dashboard'
//     });
//   }
// });


// publicRoutes.route('/events', {
//   subscriptions: function() {
//     this.register('eventsLanding', Meteor.subscribe('eventsLanding'));
//   },
//   action: function() {
//     BlazeLayout.render("mainLayout", {
//       content: 'events'
//     });
//   }
// });


//////////////////////////////////////////
// Administrative Routes                //
//////////////////////////////////////////

// authRoutes.route('/dashboard', {
//   name: 'dashboard',
//   title: 'Dashboard',
//   subscriptions: function() {
//     this.register('events', Meteor.subscribe('events'));
//     this.register('contacts', Meteor.subscribe('contacts'));
//   },
//   action: function() {
//     BlazeLayout.render("mainLayout", {
//       content: "dashboard"
//     });
//   }
// });
