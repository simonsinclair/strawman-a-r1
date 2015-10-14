// main.js
//

(function(w, $, undefined) {
  "use strict";

  var A = {

    following: [],

    // INITIALIZE
    //

    init: function() {
      A.bindEvts();
      A.updateBodyRegisteredOrNot();
      A.updateBodyLoggedInOrNot();
      A.updateBodyFollowedTopics();
    },

    testAll: function() {
      A.register();
      A.login();
      A.follow('mars');
      A.follow('david-beckham');
      A.unFollow('mars');
    },

    coldStart: function() {
      A.following  = [];

      Cookies.remove('logged-in');
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
      A.updateBodyRegisteredOrNot();
    },

    // - login

    login: function() {
      Cookies.set('logged-in', true);
      $.publish('loggedIn');
    },

    onLoggedIn: function() {
      A.updateBodyLoggedInOrNot();
    },

    // FOLLOWING
    //

    follow: function(topic) {
      $.publish('followed', topic);
    },

    onFollow: function(e, topic) {
      A.following.push( topic );
      Cookies.set('following', A.following);
      A.updateBodyFollowedTopics();
    },

    unFollow: function(topic) {
      $.publish('unFollowed', topic);
    },

    onUnFollowed: function(e, topic) {
      var topicToRemove = topic;
      var index         = A.following.indexOf( topicToRemove );
      if (index > -1) {
        A.following.splice( index, 1 );
      }

      Cookies.set('following', A.following);
      A.updateBodyFollowedTopics( topicToRemove );
    },

    // UPDATE
    //

    updateBodyRegisteredOrNot: function() {
      $('body').removeClass('registered anonymous');

      if( Cookies.get('registered') ) {
        $('body').addClass('registered');
      } else {
        $('body').addClass('anonymous');
      }
    },

    updateBodyLoggedInOrNot: function() {
      $('body').removeClass('logged-in logged-out');

      if( Cookies.get('logged-in') ) {
        $('body').addClass('logged-in');
      } else {
        $('body').addClass('logged-out');
      }
    },


    // The below method puts the names of the topics followed in the body class
    //

    updateBodyFollowedTopics: function(topicToRemove) {
      var following = Cookies.getJSON('following') || [];

      // If there is a topic to remove, that's all we need to do.
      if(topicToRemove) {

        // Remove unfollowed topic.
        $('body').removeClass( topicToRemove );

      } else {

        // Add followed topics using cookie array.
        $.each(following, function(i, topic) {
          $('body').addClass( topic );
        });

      }

      A.updateBodyFollowingOrNot();
    },


    // The below method updates the body classes with 'following' or 'not-following'
    //

    updateBodyFollowingOrNot: function() {
      var following   = Cookies.getJSON('following') || [];
      var isFollowing = following.length > 0 ? true : false;

      // First remove both following and not-following classes, so we can...
      $('body').removeClass('following not-following');

      // ...add either or, below.
      if(isFollowing) {
        $('body').addClass('following');
      } else {
        $('body').addClass('not-following');
      }
    },

  };

  // Expose
  w.A = A;

  // Initialise
  $(A.init);

})(this, jQuery);
