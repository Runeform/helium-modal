/*
 * Helium Modal v1.9
 * Developed by Harun eggleton - Under MIT License
 * jquery 1.8.3
 * jQuery-mutate (https://github.com/jqui-dot-net/jQuery-mutate)
 * jQuery Boilerplate - v3.3.1 ( http://jqueryboilerplate.com ) - Made by Zeno Rocha - Under MIT License
 */


;(function ( $, window, document, undefined ) {
  // Create defaults
  var pluginName = "heliumModal",
      defaults = {
      vert: 50,
      speed: 500,
      easing: 'swing',
      onOpen: function(){ },
      afterOpen: function(){ },
      onClose: function(){ },
      afterClose: function(){ },
      trapFocus: true
  },
  priv = {
      mh: false,
      mw: false,
      vertcalc: 0,
      tabbable: 'a[href], area[href], input:not([disabled]), button:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex]:not([tabindex="-1"]), *[contenteditable]',
      originalFocus: false
  };

  function Plugin ( element, options ) {
      this.element = element;
      // use extend to merge contents of defaults, user options, and private variables
      this.vars = $.extend( {}, defaults, options, priv );
      this._defaults = defaults;
      this._priv = priv;
      this._name = pluginName;
      this.init();
  }

  Plugin.prototype = {
//============================================================================
// Init function (All initial logic goes here)
//============================================================================
    init: function () {
        var orig = this;

        $('*[data-mid="' + $(this.element).attr('id') + '"]').click( function(){
            orig.openModal();
            return false;
        });

        $(this.element).click( function(){
            orig.closeModal();
            return false;
        }).children().click( function(event){
            event.stopPropagation();
        });
        $(this.element).find('.close').click( function(){
            orig.closeModal();
            return false;
        });

        $(this.element).find('.modal').mutate('height width', function() {
            orig.calcMargin();
            orig.centerModal();
        });
        $(window).on('resize', function(){
            orig.calcMargin();
            orig.centerModal();
        });
      },

//============================================================================
// openModal function.
//============================================================================
    openModal: function () {
        var orig = this;
        orig.vars.originalFocus =  $(':focus');
        orig.vars.onOpen();
        $(orig.element).stop().fadeIn(400);
        $(orig.element).css('height',$(document).height() + 'px');
        orig.vars.vertcalc = ((orig.vars.vert / 100) * $(window).height()) + ($(document).scrollTop());
        if(orig.vars.vertcalc < ($(this.element).find('.modal').outerHeight() / 2) + $(document).scrollTop()){
            orig.vars.vertcalc = ($(this.element).find('.modal').outerHeight() / 2) + $(document).scrollTop();
        }
        orig.calcMargin();
        $(orig.element).find('.modal').stop().css('top', orig.vars.vertcalc - 10 +'px');
        $(orig.element).find('.modal').css('left','50%');
        $(orig.element).find('.modal').css('opacity','0');
        $(orig.element).find('.modal').css('margin-top', '-' + orig.vars.mh + 'px');
        $(orig.element).find('.modal').css('margin-left', '-' + orig.vars.mw + 'px');
        $(orig.element).find('.modal').animate({
            top: orig.vars.vertcalc + 'px',
            opacity: 1
        }, orig.vars.speed, orig.vars.easing, function(){
            if(orig.vars.trapFocus){orig.focusControl();}
            orig.vars.afterOpen();
        });
    },

//============================================================================
// closeModal function.
//============================================================================
    closeModal: function () {
        var orig = this;
        orig.vars.onClose();
        $(orig.element).find('.modal').stop().animate({
            top: orig.vars.vertcalc + 10 + 'px',
            opacity: 0
        }, orig.vars.speed, orig.vars.easing);
        $(orig.element).stop().delay(orig.vars.speed-400).fadeOut(400, function(){
            if(orig.vars.originalFocus){orig.vars.originalFocus.focus();}
            orig.vars.afterClose();
        });
    },

//============================================================================
// centerModal function.
// (animates margins to recenter modal)
//============================================================================
    centerModal: function () {
        $(this.element).find('.modal').css('margin-top', '-' + this.vars.mh.toFixed() + 'px');
        $(this.element).find('.modal').css('margin-left', '-' + this.vars.mw.toFixed() + 'px');
    },

//============================================================================
// focusControl
// (bring focus to close button and trap focus inside modal while its open)
//============================================================================
    focusControl: function () {
        var orig = this;
        $(orig.element).on('keydown', function (event){
            var firstTabbable = $(orig.element).find(orig.vars.tabbable).filter(':visible').first();
            var lastTabbable = $(orig.element).find(orig.vars.tabbable).filter(':visible').last();
            //If the key pressed is 9 (tab), focus first
            if ((event.which === 9 && !event.shiftKey) && lastTabbable.is(':focus')){
                    firstTabbable.focus();
                    return false;
            }
            //If the key pressed is 9 (tab), focus last
            if ((event.which === 9 && event.shiftKey) && firstTabbable.is(':focus')){
                    lastTabbable.focus();
                    return false;
            }
        });
        $(orig.element).find('.x-button').focus();
    },

//============================================================================
// calcMargin function.
// (calculates margin offsets for modal)
//============================================================================
    calcMargin: function () {
        this.vars.mh = $(this.element).find('.modal').outerHeight() / 2;
        this.vars.mw = $(this.element).find('.modal').outerWidth() / 2;
    }
};

    // A lightweight plugin wrapper around the constructor
    $.fn[pluginName] = function ( options ) {
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            var returns;
            this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);
                if (instance instanceof Plugin && typeof instance[options] === 'function') {
                    returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }
                if (options === 'destroy') {
                  $.data(this, 'plugin_' + pluginName, null);
                }
            });
            return returns !== undefined ? returns : this;
        }
    };
})( jQuery, window, document );
