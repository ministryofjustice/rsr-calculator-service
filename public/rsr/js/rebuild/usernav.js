/*jslint browser: true, evil: false, plusplus: true, white: true, indent: 2 */
/*global moj, $ */


moj.Modules.usernav = (function() {
  "use strict";

  var init,
      cacheEls,
      bindEvents,
      links;

  init = function() {
    cacheEls();
    bindEvents();
  };

  cacheEls = function() {
    links = $( '.dropdown > a' );
  };

  bindEvents = function() {
    $( links ).on( 'click', function() {
      $( this ).parent().toggleClass( 'open' );
    } );
  };

  // public

  return {
    init: init
  };
}());
