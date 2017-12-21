
/* Google event tracking interface */

/*jshint -W030 */
!(function ( $, undefined ) {

    'use strict';


 /* TRACK EVENT PUBLIC CLASS DEFINITION
  * =================================== */

    var EventTracker = function ( element, options ) {
        this.$element = $(element);
        this.options = options;

        this.$trackingElement = this.$element.is('[data-track]') ? this.$element : this.$element.parents('[data-track]').first();
    };

    // private methods




    // Tracking helpers

    function sendTrackedEvent( category, action, label, value, cb ) {
        if (cb) window.setTimeout( cb, 50 );

        if ( window.dataLayer && typeof window.dataLayer.push === 'function' ) {
            return sendDataLayerEvent( category, action, label, value, cb );
        }
    }

    function sendDataLayerEvent( category, action, label, value ) {
      var data = {
        event: 'GAevent',
        eventCategory: category,
        eventAction: action,
        eventLabel: label
      };

      if ( value ) {
        data.eventValue = value;
      }

      window.dataLayer.push( data );
    }

    function determineActualCategory( tracker, c ) {
        var category = c || tracker.options.track
          , alternative = tracker.options[ category ];

        return alternative ? alternative : category;
    }

    function determineAppropriateLabel( tracker ) {
        var page = window.location.href
          , rel = tracker.$element.attr('rel')
          , title = tracker.$element.attr('title')
          , attr = tracker.$element.is('form') ? 'action' : 'href'
          , href = tracker.$element.attr( attr );

        if ( rel ) {
            return rel;
        }
        if ( title ) {
            return title;
        }
        if ( href ) {
            return href;
        }

        return page;
    }

    // public interface

    EventTracker.prototype = {
        constructor: EventTracker

        // data attributes will overide all but the category parameter
      , track: function( c, a, l, v ) {
            var $el = this.$element;

            var ev = $.Event( 'track', {
                category: determineActualCategory( this, c )
              , action: this.options.action || a || (this.$trackingElement.is('form') ? 'submitted' : this.$element.attr('rel') || 'clicked')
              , label: this.options.label || l || determineAppropriateLabel( this )
              , value: this.options.value || v || undefined
            });

            $(document).trigger( ev );
        }

    };

    var old = $.fn.trackevent;

    $.fn.trackevent = function ( type, opt ) {
        return this.each(function () {
          var $this = $(this)
            , $parent = $this.parents('[data-track]').first()
            , data = $this.data('eventtracker')
            , options = $.extend({}, $.fn.trackevent.defaults, typeof type === 'object' && type, typeof opt === 'object' && opt, $parent.data() || {}, $this.data())
            , method = typeof type === 'string' ? type : options.track;

          if (!options.label && $parent.is('form') && typeof $this.attr('href') !== 'string') {
              options.label = $parent.attr('action');
          }

          if (!data) {
              $this.data('eventtracker', (data = new EventTracker(this, options)));
          }

          if ( method && $.fn.trackevent.handlers[ method ] ) {
              return $.fn.trackevent.handlers[ method ].call( data );
          }

          data.track( method );
        });
    };

    $.fn.trackevent.defaults = {
      /*
        searchresult: 'search link'
      , glossary:     'a-z link'
      , navigation:   'navigation link'
      , subsection:   'navigation expandable'
      */
    };

    $.fn.trackevent.handlers = {

        ajax: function( url ) {
            var remote = (url || this.options.label).toLowerCase()
              , isSearch = ~remote.indexOf('/search?') && ~remote.indexOf('q=')
              , category = isSearch ? 'search results' : 'ajax request'
              , action = 'loaded'
              , label = url;

            this.track( category, action, label );
        }

    };


   /* LOGGER NO CONFLICT
    * ================== */

    $.fn.trackevent.noConflict = function () {
        $.fn.trackevent = old;

        return this;
    };

    // events

    $(document)
        .on('click.data-api.bs', 'a[data-track], button[data-track], [type="submit"][data-track], [type="reset"][data-track], [type="image"][data-track], [data-track] a, [data-track] button, [data-track] [type="submit"], [data-track] [type="reset"]', function ( e ) {
            var $link = $(this);

            $link.trackevent();
        })
        .on('submit.data-api.bs', '[data-track]', function ( e ) {
            var $form = $(this);

            $form.trackevent();
        })
        .on('track.data-api.bs', function( e ) {
            sendTrackedEvent( e.category, e.action, e.label, e.value );
        })
        .ajaxSuccess(function( e, xhr, settings ) {
            $(e.target).trackevent( 'ajax', { label: settings.url });
        });

})( window.jQuery );
