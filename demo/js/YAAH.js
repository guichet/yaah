// =========================================================================
// YAAH - Yet Another AJAX Helper - v0.1
// =========================================================================
// Needs jQuery and Modernizr

;(function($, window, document) {
    'use strict';

    var Yaah = function(options) {
        this.options = $.extend( this.defaults, options );
        this._init();
    }
    Yaah.prototype = {

        defaults : {
            bindingClass: '.yaah-js',      // The class to put on the element
            loaderClass : 'ya-loading',    // The loader class
            trigger     : 'always',        // The default trigger method
            location    : 'replace',       // The default behavior
            post        : null             // no Ajax post params
        },
        _init : function(){
            var _this         = this;
            this.bindingClass = this.defaults.bindingClass,
            this.loaderClass  = this.defaults.loaderClass,
            this.allItems     = $(this.defaults.bindingClass);

            this._ya_init(this.allItems);
        },
        _ya_init : function(allItems){ // Init Data needed from each item
            var _this = this;

            $(allItems).each(function(key,item){
                var href       = $(item).data('ya-href') || $(item).attr('href') || $(item).attr('action'),
                trigger        = $(item).data('ya-trigger') || _this.defaults.trigger,
                redirect       = $(item).data('ya-redirect') || null,
                target         = $(item).data('ya-target') || null,
                location       = $(item).data('ya-location') || _this.defaults.location,
                confirm        = $(item).data('ya-confirm') || null,
                pushstate      = $(item).data('ya-pushstate') || null,
                pushstatetitle = $(item).data('ya-pushstatetitle') || '',
                post           = $(item).data('ya-post') || null,
                scroll         = $(item).data('ya-scroll') || null;

                switch(trigger){
                    case "once":
                        $(item).one('click' ,function(event) {
                            event.preventDefault();
                            _this._ya_ajax(item, post, href, target, location, confirm, redirect, pushstate, pushstatetitle);
                        });
                    break;

                    case "always":
                        $(item).on('click', function(event) {
                            event.preventDefault();
                            _this._ya_ajax(item, post, href, target, location, confirm, redirect, pushstate, pushstatetitle);
                        });
                    break;

                    case "autoload":
                        _this._ya_ajax(item, post, href, target, location, confirm, redirect, pushstate, pushstatetitle);
                    break;

                    case "submit":
                        $(item).on('submit', function(event) {
                            event.preventDefault();
                            post = $(this).serialize();
                            _this._ya_ajax(item, post, href, target, location, confirm, redirect, pushstate, pushstatetitle);
                        });
                    break;

                    case "scroll":
                        scroll.on('scroll', function(event) {
                            event.preventDefault();
                            // TO DO => SetTimeout() + requestAnimationFrame() to have fewer triggers
                            // _this._ya_ajax(item, post, href, target, location, confirm, redirect, pushstate, pushstatetitle);
                        });
                    break;
                }
            });
            return $(this);
        },

        _ya_ajax : function(item, post, href, target, location, confirm, redirect, pushstate, pushstatetitle){
            var _this = this;

            if ( !$(item).hasClass(_this.loaderClass) ){

                var requestType = "GET";
                if ( post ){
                    requestType = "POST";
                }

                // Running AJAX
                $.ajax({
                    type: requestType,
                    data: post,
                    url: href,
                    cache: false,
                    beforeSend: function(){
                        $(item).addClass(_this.loaderClass); // Show loader and disable new requests

                        if( confirm ){ // Show confirmation box
                            var confirmation = _this._ya_confirm(confirm);
                            if ( confirmation ){
                                return $(this);
                            }else{
                                $(item).removeClass(_this.loaderClass);
                                return false;
                            }
                        }
                        $(item).trigger('yaah-js_xhr_beforeSend', [target, item]);
                    },
                    success: function(data){
                        $(item).removeClass(_this.loaderClass); // Remove loader
                        _this._ya_insert_to_location(item, target, location, data); // Insert response
                        _this._ya_pushstate(pushstatetitle, pushstate); // Update url
                        if (redirect){ window.location.replace(redirect); } // Redirect

                        $(item).trigger('yaah-js_xhr_success', [target, item]);
                    },
                    error: function(xhr, textStatus, errorThrown){
                        $(item).trigger('yaah-js_xhr_fail', [target, item]);
                    },
                    complete: function(){
                        _this._ya_reload();
                        $(item).trigger('yaah-js_xhr_complete', [target, item]);
                    }
                });
            }

            return $(this);
        },
        _ya_insert_to_location : function(item, target, location, html){
            switch(location){
                case 'replace':
                    target ? $(target).replaceWith(html) : $(item).replaceWith(html);
                    return $(this);
                break;

                case 'before':
                    target ? $(target).before(html) : $(item).before(html);
                    return $(this);
                break;

                case 'after':
                    target ? $(target).after(html) : $(item).after(html);
                    return $(this);
                break;

                case 'inner':
                    target ? $(target).append(html) : $(item).append(html);
                    return $(this);
                break;

                case 'remove':
                    target ? $(target).remove() : $(item).remove();
                    return $(this);
                break;

                case 'none':
                    return $(this);
                break;
            }
        },
        _ya_confirm : function(confirm){
            if (!window.confirm(confirm)) {
                return false;
            }
            return  $(this);
        },
        _ya_pushstate : function(title , pushStateHref){
            if ( $('html').hasClass('history') ) {
                history.pushState(title, '', pushStateHref);
            }
            return  $(this);
        },
        _ya_reload : function(){ // Check for brand new items and init them
            var _this = this,
            newItems = []; // Table containing only the new items

            $(this.defaults.bindingClass).each(function(key, item){
                if ( $.inArray(item, _this.allItems) == -1 ){
                    newItems.push(item);
                }
            });
            this._ya_init(newItems); // Init the new items
            this.allItems = $(this.defaults.bindingClass); // Update full list for next init

        },
    },
    window.Yaah = Yaah;

    $(document).ready(function(){
        var Ya = new Yaah();
    });

})(window.jQuery, window, document);