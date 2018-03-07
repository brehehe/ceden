( function( $ ) {
  "use strict";
  // Plugin definition.
  $.fn.osetin_infinite_scroll = function( options ) {

      // Extend our default options with those provided.
      // Note that the first argument to extend is an empty
      // object – this is to keep from overriding our "defaults" object.
      var opts = $.extend( {}, $.fn.osetin_infinite_scroll.defaults, options );

      // Our plugin implementation code goes here.

  };
  // Plugin defaults – added as a property on our plugin function.
  $.fn.osetin_infinite_scroll.defaults = {
      foreground: "red",
      background: "yellow"
  };



  $.fn.osetin_infinite_scroll.init_infinite_scroll = function() {
    // Infinite scroll init
    if($('body').hasClass('with-infinite-scroll') && $('.isotope-next-params').length){
      $('.pagination-w.hide-for-isotope').hide().after('<div class="infinite-scroll-trigger"></div>');
      $(window).scroll($.debounce( 50, function(){ $.fn.osetin_infinite_scroll.loadNextPageIsotope(false); }));
      $('.load-more-posts-button-w a').on('click', function(){ $.fn.osetin_infinite_scroll.loadNextPageIsotope(false); return false; });
    }
    // Infinite button init
    if($('body').hasClass('with-infinite-button') && $('.isotope-next-params').length){
      $('.pagination-w.hide-for-isotope').hide();
      $('.load-more-posts-button-w a').on('click', function(){ $.fn.osetin_infinite_scroll.loadNextPageIsotope(false); return false; });
    }
  }

  $.fn.osetin_infinite_scroll.is_display_type = function(display_type){
    return ( ($('.display-type').css('content') == display_type) || ($('.display-type').css('content') == '"'+display_type+'"'));
  }
  $.fn.osetin_infinite_scroll.not_display_type = function(display_type){
    return ( ($('.display-type').css('content') != display_type) && ($('.display-type').css('content') != '"'+display_type+'"'));
  }

  $.fn.osetin_infinite_scroll.loadNextPageIsotope = function(forse_load){
    if(!$('body').hasClass('infinite-loading-pending')){
      if($('.isotope-next-params').length){
        if($.fn.osetin_infinite_scroll.isScrolledIntoView('.infinite-scroll-trigger') || forse_load){
          // if loading animation is not already on a page - add it
          if(!$('.isotope-loading').length){
            var $loading_block = $('<div class="isotope-loading"></div>');
            $loading_block.insertAfter('.index-isotope');
          }
          var os_layout_type = 'v3';
          if($('.isotope-next-params').data("layout-type") == 'v1'){
            os_layout_type = 'v1';
          }
          if($('.isotope-next-params').data("layout-type") == 'v2'){
            os_layout_type = 'v2';
          }
          if($('.isotope-next-params').data("layout-type") == 'v3'){
            os_layout_type = 'v3';
          }
          if($('.isotope-next-params').data("layout-type") == 'v3-simple'){
            os_layout_type = 'v3-simple';
          }
          var os_template_type = $('.isotope-next-params').data("template-type");

          $.ajax({
            type: "POST",
            url: ajaxurl,
            dataType: 'json',
            data: {
              action: 'load_infinite_content',
              next_params: $('.isotope-next-params').data("params"),
              layout_type: os_layout_type,
              template_type: os_template_type,
              page_id: $('.index-isotope').data("page-id"),
            },
            beforeSend: function(){
              $('body').addClass('infinite-loading-pending');
            },
            success: function(response){
              if(response.success){
                if(response.has_posts){
                  // posts found and returned
                  var $new_posts = $(response.new_posts);
                  if($('.index-isotope').length && ($.fn.osetin_infinite_scroll.not_display_type("tablet") || ($.fn.osetin_infinite_scroll.is_display_type("tablet") && $('body').hasClass('menu-position-top') && $('body').hasClass('no-sidebar'))) && $.fn.osetin_infinite_scroll.not_display_type("phone")){
                    $('.index-isotope').append($new_posts).isotope( 'appended', $new_posts );
                  }else{
                    $('.index-isotope').append($new_posts);
                  }
                  if(response.next_params){
                    $('.isotope-next-params').data("params", response.next_params);
                  }else{
                    $('.isotope-next-params').remove();
                    $('.load-more-posts-button-w').remove();
                    $('.index-isotope').after('<div class="no-more-posts-message"><span>' + response.no_more_posts_message + '</span></div>');
                    $('.no-more-posts-message').hide().fadeIn("slow");
                  }
                  $('body').removeClass('infinite-loading-pending');

                  // INIT NEW FACEBOOK LIKE BUTTONS
                  if($('.item-isotope .meta-like .fb-like').length){
                    try{
                      FB.XFBML.parse(); 
                    }catch(ex){}
                  }
                  // INIT NEW PINTEREST PIN BUTTONS
                  if($('.item-isotope .meta-like a[data-pin-do="buttonPin"]').length){
                    try{
                      window.parsePinBtns();
                    }catch(ex){}
                  }

                  // IF LIGHTBOX POSTS PRESENT and next post is not set yet - RELOAD NEXT POST
                  if($('.lightbox-post-shadow').length && !$('.post-next-lightbox.make-visible').length){
                    var current_post_id = $('.lightbox-post-w').data('post-id');
                    var $next_tile = $('.item-isotope article#post-'+ current_post_id).closest('.item-isotope').nextAll('.item-isotope:not(.magic-item-w):first');
                    if($next_tile.length){


                      var next_tile_post_id = $next_tile.find('article').first().attr('id').replace('post-', '');
                      var next_tile_title = $next_tile.find('.entry-title a').text();
                      if(!next_tile_title){
                        next_tile_title = $next_tile.find('.archive-item-media-thumbnail').data('lightbox-caption');
                      }
                      if(!next_tile_title){
                        next_tile_title = $next_tile.find('.archive-item-content-text').text();
                      }

                      if($next_tile.find('figure.abs-image img').length){
                        var next_tile_featured_image_url = $next_tile.find('figure.abs-image img').attr('src');
                      }else if($next_tile.find('figure.abs-slider li:first img').length){
                        var next_tile_featured_image_url = $next_tile.find('figure.abs-slider li:first img').attr('src');
                      }else if($next_tile.find('.post-video-box').length){
                        var next_tile_featured_image_url = $next_tile.find('.post-video-box').data('featured-image-url');
                      }

                      $('body').append('<a href="#" data-post-id="' + next_tile_post_id + '" class="post-next-lightbox"><div class="post-next-prev-nav-arrow"><i class="os-icon os-icon-angle-right"></i></div><div class="post-next-prev-image" style="background-image: url('+ next_tile_featured_image_url +');"></div><h4>'+ next_tile_title +'</h4></a>');
                      $('.post-next-lightbox').fadeIn(300, function(){ $(this).addClass('make-visible')});
                    }
                  }

                  $('.os-lightbox-activator').magnificPopup({
                    type: 'image',
                    mainClass: 'mfp-with-zoom', // this class is for CSS animation below

                    zoom: {
                      enabled: true, // By default it's false, so don't forget to enable it

                      duration: 300, // duration of the effect, in milliseconds
                      easing: 'ease-in-out', // CSS transition easing function

                      // The "opener" function should return the element from which popup will be zoomed in
                      // and to which popup will be scaled down
                      // By defailt it looks for an image tag:
                      opener: function(openerElement) {
                        // openerElement is the element on which popup was initialized, in this case its <a> tag
                        // you don't need to add "opener" option if this code matches your needs, it's defailt one.
                        return openerElement.is('img') ? openerElement : openerElement.find('img');
                      }
                    }

                  });
                  $('.flexslider').flexslider({
                    animation : "slide"
                  });

                }else{
                  // no more posts
                  $('.isotope-next-params').remove();
                  $('body').removeClass('infinite-loading-pending');
                  $('.index-isotope').append(response.no_more_posts_message);
                }
              }else{
                // error handling
              }
              $('.isotope-loading').remove();
            }
          });
        }
      }
    }
  }

  $.fn.osetin_infinite_scroll.isScrolledIntoView = function(elem)
  {
    if($('body').hasClass('with-infinite-button')){
      // if button was clicked - no need to check if user scrolled into view or not just return true
      return true;
    }else{
      if(elem.length){
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
      }else{
        return false;
      }
    }
  }


} )( jQuery );