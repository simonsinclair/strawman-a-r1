// main.js
//

(function(w, $, undefined) {
  "use strict";

  var A = {

    // INITIALIZE
    //

    init: function() {
      A.bindEvts();

      A.following = Cookies.getJSON('following') || [];

      A.updateBodyRegisteredOrNot();
      A.updateBodyLoggedInOrNot();
      A.updateBodyFollowedTopics();

      // A.coldStart();
      // A.testAll();
    },

    testAll: function() {
      A.register();
      A.login();
      A.follow('mars-rover');
      A.follow('sepp-blatter');
      A.follow('film');
      A.unFollow('mars-rover');
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

      $('a[data-disable]').on('click', false);
      $('#js-sections').on('click', A.toggleMenu);
      $('#js-menu .menu__item--with-children > a').on('click', A.toggleMenuChildren);
      $('a[data-follow-topic]').on('click', A.toggleFollowDataTopic);
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

    toggleFollowDataTopic: function(e) {
      e.preventDefault();
      var topic       = $(this).data('follow-topic');
      var isFollowing = ( $.inArray( topic, A.following ) > -1 );

      if( isFollowing ) {
        A.unFollow( topic );
      } else {
        A.follow( topic );
      }
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

      // If there is a topic to remove, that's all we need to do.
      if(topicToRemove) {

        // Remove unfollowed topic.
        $('body').removeClass( topicToRemove );

      } else {

        // Add followed topics using cookie array.
        $.each(A.following, function(i, topic) {
          $('body').addClass( topic );
        });

      }

      A.updateBodyFollowingOrNot();
    },


    // The below method updates the body classes with 'following' or 'not-following'
    //

    updateBodyFollowingOrNot: function() {
      var isFollowing = A.following.length > 0 ? true : false;

      // First remove both following and not-following classes, so we can...
      $('body').removeClass('following not-following');

      // ...add either or, below.
      if(isFollowing) {
        $('body').addClass('following');
      } else {
        $('body').addClass('not-following');
      }
    },

    // GENERIC
    //

    toggleMenu: function(e) {
      e.preventDefault();
      $(this).toggleClass('masthead__sections--active');
      $('#js-menu').toggleClass('menu--active');
    },

    toggleMenuChildren: function() {
      var $allMenuItems    = $('#js-menu .menu__item--with-children');
      var $clickedMenuItem = $(this).parent();

      if( $clickedMenuItem.hasClass('expanded') ) {

        $clickedMenuItem.toggleClass('expanded');

      } else {

        $allMenuItems.removeClass('expanded');
        $clickedMenuItem.toggleClass('expanded');

      }
    },

    getParameterByName: function(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

  };

  // Expose
  w.A = A;

  // Initialise
  $(A.init);

})(this, jQuery);
