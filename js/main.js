// main.js
//

(function(w, $, undefined) {
  "use strict";

  var A = {

    // INITIALIZE
    //

    init: function() {
      // A.coldStart();
      A.bindEvts();

      A.following = Cookies.getJSON('following') || [];

      A.updateBodyLoggedInOrNot();
      A.updateBodySignedInFrom();

      A.setTrackingCookie();

      // Update body class with followed topics if we're following any
      if(A.following.length > 0) {
        A.updateBodyFollowedTopics();
      }

      A.updateBodyFollowingOrNot();

      // A.testStates();
    },

    setTrackingCookie: function() {
      var currentPage = window.location.href;

      if (currentPage.search('/sign-in.html')               === -1 &&
          currentPage.search('/register.html')              === -1 &&
          currentPage.search('/register-confirmation.html') === -1) {
        Cookies.set('last-page', window.location.href);
      }
    },

    testStates: function() {
      // A.login();
      // A.follow('mars');
      // A.follow('sepp');
      // A.follow('film');
      // A.unFollow('mars');
    },

    coldStart: function() {
      A.following = [];

      Cookies.remove('logged-in');
      Cookies.remove('signedInFrom');
      Cookies.remove('following', []);
    },

    bindEvts: function() {
      $.subscribe('followed', A.onFollow);
      $.subscribe('loggedIn', A.onLoggedIn);

      $.subscribe('unFollowed', A.onUnFollowed);

      $('a[data-disable]').on('click', false);
      $('#js-sections').on('click', A.toggleMenu);
      $('#js-menu .menu__item--with-children > a').on('click', A.toggleMenuChildren);
      $('a[data-follow-topic]').on('click', A.toggleFollowDataTopic);
    },

    // STATES
    // - login

    login: function(e) {
      e = e || window.event;

      Cookies.set('logged-in', true);
      $.publish('loggedIn');

      var currPage = window.location.href;
      var lastPage = Cookies.get('last-page');


      // Prevent redirection-loop when triggering login() from testStates()
      //

      if (lastPage !== currPage && lastPage) {
        e.preventDefault();
        window.location = lastPage;
      }
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

      // Get the current class before we add the new one, and remove it
      // This is so we only ever have the current class on the body, otherwise
      // we're going to have difficulty removing classes
      var bodyTopicsString = A.getBodyTopicsString(A.following);
      $('body').removeClass( bodyTopicsString );


      // And remove t-classes
      $.each(A.following, function(i, topic) {
        $('body').removeClass('t-' + topic);
      });

      A.following.push( topic );
      Cookies.set('following', A.following);
      A.updateBodyFollowedTopics();
    },

    unFollow: function(topic) {
      $.publish('unFollowed', topic);
    },

    onUnFollowed: function(e, topic) {

      // Here we want to do the same thing as onFollow -- rather than try to splice
      // a single topic out of the body's class, we're just going to remove the whole
      // thing
      var bodyTopicsString = A.getBodyTopicsString(A.following);
      $('body').removeClass( bodyTopicsString );

      // And remove t-classes
      $.each(A.following, function(i, topic) {
        $('body').removeClass('t-' + topic);
      });

      var topicToRemove = topic;
      var index         = A.following.indexOf( topicToRemove );
      if (index > -1) {
        A.following.splice( index, 1 );
      }

      Cookies.set('following', A.following);
      A.updateBodyFollowedTopics();
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

      if( !Cookies.get('logged-in') ) {
        window.location = "sign-in.html";
      }
    },

    // UPDATE
    //

    updateBodyLoggedInOrNot: function() {
      $('body').removeClass('logged-in logged-out');

      if( Cookies.get('logged-in') ) {
        $('body').addClass('logged-in');
      } else {
        $('body').addClass('logged-out');
      }
    },

    updateBodySignedInFrom: function() {
      var signedInFrom = Cookies.get('signedInFrom');
      $('body').addClass( signedInFrom );
    },


    // The below method puts the names of the topics followed in the body class
    //

    updateBodyFollowedTopics: function() {
      var bodyTopicsString = A.getBodyTopicsString(A.following);
      $('body').addClass( bodyTopicsString );

      // Generate t-classes
      $.each(A.following, function(i, topic) {
        $('body').addClass('t-' + topic)
      });

      A.updateBodyFollowingOrNot();
    },

    getBodyTopicsString: function(topics) {
      return topics.sort().join('-');
    },


    // The below method updates the body classes with 'following' or 'not-following'
    //

    updateBodyFollowingOrNot: function() {
      var isFollowing = (A.following.length > 0);

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
