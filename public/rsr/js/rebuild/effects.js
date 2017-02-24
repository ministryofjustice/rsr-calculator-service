/*jslint browser: true, evil: false, plusplus: true, white: true, indent: 2 */
/*global moj, $ */


moj.Modules.effects = (function() {
  "use strict";

  var init,
      highlight,
      highlights;

  /*
    USAGE
    =====
    
    trigger fade effect on single element with default colour and duration: 
    moj.Modules.effects.highlight($('#alert'));

    trigger fade effect on single element with custom colour and duration:
    moj.Modules.effects.highlight($('#alert'), {colour: '#0f0', duration: 5000});

    trigger fade effect on multiple elements with common className:
    moj.Modules.effects.highlights({class: 'newRow'});

    trigger fade effect on multiple elements with common className with custom colour and/or duration:
    moj.Modules.effects.highlights({class: 'newRow', colour: '#0f0', duration: 5000});
  */

  init = function() {
    // do nothing
    // must be present for moj module loader
    // unfortunately causes JSLint to error, but hey, what you gonna do?
  };

  highlights = function( options ) {
    var elclass = ( options && options.class ? options.class : 'highlight' ),
        els = $( '.' + elclass );
    
    $( els ).each( function() {
      highlight( $( this ), options );
    } );
  };

  highlight = function( $el, options ) {
    var elclass = ( options && options.class ? options.class : 'highlight' ),
        col = ( options && options.colour ? options.colour : '#ff9' ),
        duration = ( options && options.duration ? options.duration : 1500 ),
        obg = $el.css( 'background-color' );

    $el.css( 'background-color', col ).animate( {
      backgroundColor:  obg
    }, duration, function() {
      $el.removeClass( elclass );
    } );
  };

  // public

  return {
    init: init,
    highlight: highlight,
    highlights: highlights
  };
}());
