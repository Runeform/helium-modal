/* 
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
      onClose: function(){ }
  },
  priv = {
      mid: false,
      mh: false,
      mw: false,
      vertcalc: 0
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
        this.vars.mid = '#' + this.element.getAttribute("data-mid");

        $(this.element).click( function(){
          orig.openModal();
          return false;
        });

        $(this.vars.mid + ', ' + this.vars.mid + ' .modal a.close').click( function(event){ 
          orig.closeModal();
          return false;
        }).children().click( function(event){
          event.stopPropagation();
        });

        $(this.vars.mid + ' .modal').mutate('height width', function(el,info) { 
          orig.calcMargin();
          orig.centerModal();
        });
      },

//============================================================================
// openModal function.  
//============================================================================
      openModal: function () {         
        var orig = this;
          orig.vars.onOpen();
        $(this.vars.mid).stop().fadeIn('fast');
        $('.modalholder').css('height',$(document).height() + 'px');
        orig.vars.vertcalc = ((orig.vars.vert / 100) * $(window).height()) + ($(document).scrollTop());
        if(orig.vars.vertcalc < $(this.vars.mid + ' .modal').outerHeight() / 2){
          orig.vars.vertcalc = $(this.vars.mid + ' .modal').outerHeight() / 2;
        }
        $(this.vars.mid + ' .modal').stop().css('top', orig.vars.vertcalc - 10 +'px');
        $(this.vars.mid + ' .modal').stop().animate({
                top: orig.vars.vertcalc + 'px'
            }, this.vars.speed, this.vars.easing);
        this.calcMargin();
          $(this.vars.mid + ' .modal').css('left','50%');
          $(this.vars.mid + ' .modal').css('margin-top', '-' + this.vars.mh + 'px');
          $(this.vars.mid + ' .modal').css('margin-left', '-' + this.vars.mw + 'px');
      },

//============================================================================
// closeModal function.  
//============================================================================
      closeModal: function () {               
        var orig = this;  
          orig.vars.onClose();
          $(this.vars.mid).stop().fadeOut('fast');
          $(this.vars.mid + ' .modal').stop().animate({
              top: orig.vars.vertcalc + 10 + 'px'
          }, this.vars.speed, this.vars.easing);
      },

//============================================================================
// centerModal function.  
// (animates margins to recenter modal)
//============================================================================
      centerModal: function () {        
          $(this.vars.mid + ' .modal').stop().animate({
              'margin-top': '-' + this.vars.mh + 'px',
              'margin-left': '-' + this.vars.mw + 'px'
          },300);        
      },

//============================================================================
// calcMargin function.  
// (calculates margin offsets for modal)
//============================================================================
      calcMargin: function () {
        this.vars.mh = $(this.vars.mid + ' .modal').outerHeight() / 2;
        this.vars.mw = $(this.vars.mid + ' .modal').outerWidth() / 2;          
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