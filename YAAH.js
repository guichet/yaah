// =========================================================================
// YAAH - Yet Another AJAX Helper - v0.4.2
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
        eventslist : {
            xhr_submit       : 'yaah-js_xhr_submit',
            xhr_manualTrigger: 'yaah-js_xhr_manualTrigger',
            xhr_beforeSend   : 'yaah-js_xhr_beforeSend',
            xhr_success      : 'yaah-js_xhr_success',
            xhr_fail         : 'yaah-js_xhr_fail',
            xhr_complete     : 'yaah-js_xhr_complete',
            xhr_beforeInsert : 'yaah-js_xhr_beforeInsert',
            xhr_afterInsert  : 'yaah-js_xhr_afterInsert'
        },
        _init : function(){
            var _this         = this;
            this.bindingClass = this.defaults.bindingClass,
            this.loaderClass  = this.defaults.loaderClass,
            this.allItems     = $(this.defaults.bindingClass);
            this.uniqId       = 0;

            this._ya_init(this.allItems);
        },
        _ya_init : function(allItems){ // Init Data needed from each item
            var _this = this;

            $(allItems).each(function(key,item){
                var $item      = $(item),
                href           = $item.data('ya-href') || $item.attr('href') || $item.attr('action'),
                trigger        = $item.data('ya-trigger') || _this.defaults.trigger,
                redirect       = $item.data('ya-redirect') || null,
                target         = $item.data('ya-target') || null,
                location       = $item.data('ya-location') || _this.defaults.location,
                confirm        = $item.data('ya-confirm') || null,
                pushstate      = $item.data('ya-pushstate') || null,
                pushstatetitle = $item.data('ya-pushstatetitle') || '',
                post           = $item.data('ya-post') || null,
                timer          = $item.data('ya-timer') || null,
                scroll         = $item.data('ya-scroll') || null,
                xhr2           = $item.data('ya-xhr2') || true,
                nopropagation  = $item.data('ya-nopropagation') || false,
                uniqId         = ++_this.uniqId;

                switch(trigger){
                    case "once":
                        $item.one('click' ,function(event) {
                            if(nopropagation){
                                event.stopPropagation();
                            }
                            event.preventDefault();
                            _this._ya_ajax($item, post, href, target, location, confirm, redirect, pushstate, pushstatetitle, timer, uniqId, xhr2);
                        });
                    break;

                    case "always":
                        $item.on('click', function(event) {
                            if(nopropagation){
                                event.stopPropagation();
                            }
                            event.preventDefault();
                            _this._ya_ajax($item, post, href, target, location, confirm, redirect, pushstate, pushstatetitle, timer, uniqId, xhr2);
                        });
                    break;

                    case "autoload":
                        if ( trigger == 'autoload' && timer!=null ){
                            var realTimer = timer * 1000;
                            window.setInterval( function(){
                                _this._ya_ajax($item, post, href, target, location, confirm, redirect, pushstate, pushstatetitle, timer, uniqId, xhr2);
                            }, realTimer);
                        } else {
                            _this._ya_ajax($item, post, href, target, location, confirm, redirect, pushstate, pushstatetitle, timer, uniqId, xhr2);
                        }
                    break;

                   case "submit":
                        $item.on('submit', function(event) {
                            if(nopropagation){
                                event.stopPropagation();
                            }
                            event.preventDefault();

                            $item.trigger(_this.eventslist.xhr_submit); // Trigger a "submit" event, before fetching data

                            if ( xhr2 ){ // By default xhr2 for modern browsers
                                var formData = new FormData(this);

                                if ( post != null ){ // EXTRA DATA TREATMENT
                                    var json = $.parseJSON(post) ;

                                    for (var key in json) {
                                      if (json.hasOwnProperty(key)) {
                                        formData.append( key, json[key]);
                                      }
                                    }
                                }
                                var newpost = formData;
                            } else {
                                var newpost = post==null ? $item.serialize() : $item.serialize()+'&'+$.param(post);
                            }

                            _this._ya_ajax($item, newpost, href, target, location, confirm, redirect, pushstate, pushstatetitle, timer, uniqId, xhr2);
                        });
                    break;

                    case "scroll":
                        scroll.on('scroll', function(event) {
                            if(nopropagation){
                                event.stopPropagation();
                            }
                            event.preventDefault();
                            // TO DO => SetTimeout() + requestAnimationFrame() to have fewer triggers
                            // _this._ya_ajax($item, post, href, target, location, confirm, redirect, pushstate, pushstatetitle, timer, uniqId, xhr2);
                        });
                    break;

                    case "manual":
                        $item.on(_this.eventslist.xhr_manualTrigger, function(event) {
                            _this._ya_ajax($item, post, href, target, location, confirm, redirect, pushstate, pushstatetitle, timer, uniqId, xhr2);
                        });
                    break;
                }
            });
            return $(this);
        },

        _ya_loading : function($item,target,location){
            var _this = this;

            var loader = $('<span>', {'class': _this.loaderClass});

            switch(location){
                case 'replace':
                    target ? $(target).hide().before(loader) : $item.hide().before(loader);
                    return $(this);
                break;

                case 'before':
                    target ? $(target).before(loader) : $item.before(loader);
                    return $(this);
                break;

                case 'after':
                    target ? $(target).after(loader) : $item.after(loader);
                    return $(this);
                break;

                case 'top':
                    target ? $(target).prepend(loader) : $item.prepend(loader);
                    return $(this);
                break;

                case 'inner':
                    if (target){
                        $(target).children().hide();
                        $(target).prepend(loader);
                    } else {
                        $(item).children().hide();
                        $(item).prepend(loader);
                    }
                    return $(this);
                break;

                case 'bottom':
                    target ? $(target).append(loader) : $(item).append(loader);
                    return $(this);
                break;

                case 'remove':
                    target ? $(target).remove() : $(item).remove();
                    return $(this);
                break;

                case 'none':
                    target ? $(target).after(loader) : $(item).after(loader);
                    return $(this);
                break;
            }
        },

        _ya_ajax : function($item, post, href, target, location, confirm, redirect, pushstate, pushstatetitle, timer, uniqId, xhr2){
            var _this = this;

            if ( !$item.hasClass('yaah-running') ){

                var requestType = "POST";
                if ( post ){
                    requestType = "POST";
                }

                // Running AJAX
                $.ajax({
                    type: requestType,
                    data: post,
                    url: href,
                    mimeType    : "multipart/form-data",
                    contentType : false,
                    cache       : false,
                    processData : false,
                    beforeSend: function(){

                        $item.addClass('yaah-running'); // Show loader and disable new requests

                        if( confirm ){ // If need confirmation => Show confirmation box
                            var confirmation = _this._ya_confirm(confirm);
                            if ( confirmation ){
                                _this._ya_loading($item,target,location); // Show loader
                                return $(this);
                            } else {
                                $item.removeClass('yaah-running');
                                return false;
                            }
                        } else {
                            _this._ya_loading($item,target,location); // Show loader
                        }
                        $item.trigger(_this.eventslist.xhr_beforeSend, [target, $item]);
                    },
                    success: function(data){
                        var afterInsertEventId = _this.eventslist.xhr_afterInsert + '.' + uniqId;

                        $item.removeClass('yaah-running');
                        $('.'+_this.loaderClass).remove(); // Remove loader
                        $item.trigger(_this.eventslist.xhr_beforeInsert, [afterInsertEventId, target, $item, data]); // Trigger "beforeInsert" event
                        _this._ya_insert_to_location($item, target, location, data); // Insert response
                        _this._ya_pushstate(pushstatetitle, pushstate); // Update url
                        $item.trigger(_this.eventslist.xhr_success, [target, $item, data]); // Trigger "success" event
                        $(document).trigger(afterInsertEventId, [target, $item, data]); // Trigger "afterInsert" event

                        if (redirect){ window.location.replace(redirect); } // Redirect
                    },
                    error: function(xhr, textStatus, errorThrown){
                        $item.trigger(_this.eventslist.xhr_fail, [target, $item]);
                    },
                    complete: function(){
                        $item.removeClass('yaah-running'); // Enable new requests
                        _this._ya_reload();
                        $item.trigger(_this.eventslist.xhr_complete, [target, $item]);
                    }
                });
            }

            return $(this);
        },
        _ya_insert_to_location : function($item, target, location, html){
            switch(location){
                case 'replace':
                    target ? $(target).replaceWith(html) : $item.replaceWith(html);
                    return $(this);
                break;

                case 'before':
                    target ? $(target).before(html) : $item.before(html);
                    return $(this);
                break;

                case 'after':
                    target ? $(target).after(html) : $item.after(html);
                    return $(this);
                break;

                case 'top':
                    target ? $(target).prepend(html) : $item.prepend(html);
                    return $(this);
                break;

                case 'inner':
                    target ? $(target).html(html) : $item.html(html);
                    return $(this);
                break;

                case 'bottom':
                    target ? $(target).append(html) : $item.append(html);
                    return $(this);
                break;

                case 'remove':
                    target ? $(target).remove() : $item.remove();
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
    };

    $(document).ready(function(){
        window.Yaah = new Yaah();
    });

})(window.jQuery, window, document);