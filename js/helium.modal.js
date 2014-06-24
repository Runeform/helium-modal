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

        $('*[data-mid="' + $(this.element).attr('id') + '"]').click( function(){
          orig.openModal();
          return false;
        });

        $(this.element).click( function(event){ 
          orig.closeModal();
          return false;
        }).children().click( function(event){
          event.stopPropagation();
        });
        $(this.element).find('.close').click( function(event){ 
          orig.closeModal();
          return false;
        })

        $(this.element).find('.modal').mutate('height width', function(el,info) { 
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
          orig.vars.onOpen();
        $(orig.element).stop().fadeIn('fast');
        $(orig.element).css('height',$(document).height() + 'px');
        orig.vars.vertcalc = ((orig.vars.vert / 100) * $(window).height()) + ($(document).scrollTop());
        if(orig.vars.vertcalc < $(this.element).find('.modal').outerHeight() / 2){
          orig.vars.vertcalc = $(this.element).find('.modal').outerHeight() / 2;
        }
        $(this.element).find('.modal').stop().css('top', orig.vars.vertcalc - 10 +'px');
        $(this.element).find('.modal').stop().animate({
                top: orig.vars.vertcalc + 'px'
            }, this.vars.speed, this.vars.easing);
        this.calcMargin();
          $(this.element).find('.modal').css('left','50%');
          $(this.element).find('.modal').css('margin-top', '-' + this.vars.mh + 'px');
          $(this.element).find('.modal').css('margin-left', '-' + this.vars.mw + 'px');
      },

//============================================================================
// closeModal function.  
//============================================================================
      closeModal: function () {               
        var orig = this;  
          $(orig.element).stop().fadeOut('fast');
          $(this.element).find('.modal').stop().animate({
              top: orig.vars.vertcalc + 10 + 'px'
          }, this.vars.speed, this.vars.easing);
          orig.vars.onClose();
      },

//============================================================================
// centerModal function.  
// (animates margins to recenter modal)
//============================================================================
      centerModal: function () {        
              $(this.element).find('.modal').stop().css('margin-top', '-' + this.vars.mh.toFixed() + 'px');
              $(this.element).find('.modal').stop().css('margin-left', '-' + this.vars.mw.toFixed() + 'px');
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