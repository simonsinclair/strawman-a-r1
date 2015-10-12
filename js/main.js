// main.js
//

(function(w, $, undefined) {
  "use strict";

  var A = {

    following:  [],

    // INITIALIZE
    //

    init: function() {
      A.coldStart();
      A.bindEvts();
      A.updateBodyClasses();

      // Test
      //

      A.register();
      A.login();
      A.follow('mars');
      A.follow('david-beckham');
    },

    coldStart: function() {
      A.following  = [];

      Cookies.remove('logged_in');
      Cookies.remove('registered');
      Cookies.remove('following', []);
    },

    bindEvts: function() {
      $.subscribe('followed', A.onFollow);
      $.subscribe('registered', A.onRegistered);
      $.subscribe('loggedIn', A.onLoggedIn);

      $.subscribe('unFollowed', A.onUnFollowed);
    },

    // STATES
    // - Register

    register: function() {
      Cookies.set('registered', true);
      $.publish('registered');
    },

    onRegistered: function() {
      A.updateBodyClasses();
    },

    // - login

    login: function() {
      Cookies.set('logged_in', true);
      $.publish('loggedIn');
    },

    onLoggedIn: function() {
      A.updateBodyClasses();
    },

    // FOLLOWING
    //

    follow: function(topic) {
      $.publish('followed', topic);
    },

    onFollow: function(e, topic) {
      A.following.push( topic );
      Cookies.set('following', A.following);
      A.updateBodyClasses();
    },

    unFollow: function(topic) {
      $.publish('unFollowed', topic);
    },

    onUnFollowed: function(e, topic) {
      // Remove 'topic' from following array
      // Update 'following' cookie value
    },

    // UPDATE
    //

    updateBodyClasses: function() {
      var bodyClasses = '';

      // Registered?
      if( Cookies.get('registered') ) {
        bodyClasses += ' registered';
      }

      // Logged-in?
      if( Cookies.get('logged_in') ) {
        bodyClasses += ' logged-in';
      }

      // What/Who're you following?
      $.each(A.following, function(i, topic) {
        bodyClasses += ' '+topic;
      });

      $('body').addClass( bodyClasses );
    }

  };

  $(A.init);
})(this, jQuery);
