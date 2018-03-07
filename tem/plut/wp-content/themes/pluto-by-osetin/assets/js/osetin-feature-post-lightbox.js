( function( $ ) {
  "use strict";
  $( function() {

    $('body').on('click', '.post-next-lightbox, .post-prev-lightbox', function(){
      var post_id = $(this).data('post-id');
      if($('.item-isotope article#post-'+ post_id +' .entry-title a').length){
        $('.item-isotope article#post-'+ post_id +' .entry-title a').first().click();
      }else{
        $('.item-isotope article#post-'+ post_id +' figure').first().click();
      }
      return false;
    });

    $('body').on('click', '.lightbox-post-w .os-lightbox-close-btn', function(){
      $('.lightbox-post-w').remove();
      $('.lightbox-post-shadow').remove();
      $('.close-lightbox-post').remove();
      $('.post-prev-lightbox, .post-next-lightbox').remove();
    });

    $('body').on('click', '.lightbox-post-shadow, .close-lightbox-post', function(){
      $('.lightbox-post-w').remove();
      $('.lightbox-post-shadow').remove();
      $('.close-lightbox-post').remove();
      $('.post-prev-lightbox, .post-next-lightbox').remove();
    });


    $('.lightbox-tiles').on('click', '.post-content-body .post-content, .entry-title a, .figure-link, .read-more-link a', function(){
      if(!$('.lightbox-post-shadow').length){
        $('body').append('<a href="#" class="close-lightbox-post"><i class="os-icon os-icon-cross2"></i></a><div class="lightbox-post-shadow"></div>');
      }
      $('.post-next-lightbox, .post-prev-lightbox, .lightbox-post-w').removeClass('make-visible');
      $('.lightbox-tiles .item-isotope').removeClass('loading-now');
      var $current_tile = $(this).closest('.item-isotope');
      var $next_tile = $current_tile.nextAll('.item-isotope:not(.magic-item-w):first');
      var $prev_tile = $current_tile.prevAll('.item-isotope:not(.magic-item-w):first');
      var post_id = $current_tile.find('article').first().attr('id');
      post_id = post_id.replace('post-', '');

      $current_tile.addClass('loading-now');
      $.ajax({
          type: 'POST',
          url: ajaxurl,
          data: {
            "action": "pluto_post_lightbox_process_request",
            "post_id" : post_id
          },
          dataType: "json",
          success: function(data){
            $('.lightbox-tiles .item-isotope').removeClass('loading-now');
            $('.main-search-form form').removeClass('search-loading');
            $('.lightbox-post-w').remove();
            $('.post-next-lightbox, .post-prev-lightbox').remove();
            if(data.status == 200){
              $('body').append(data.message);
              $('.lightbox-post-i .flexslider').flexslider({
                animation : "slide"
              });
              $('.close-lightbox-post').fadeIn(300);
              // INIT NEW FACEBOOK LIKE BUTTONS
              if($('.lightbox-post-i .meta-like .fb-like').length){
                try{
                  FB.XFBML.parse(); 
                }catch(ex){}
              }
              // INIT NEW PINTEREST PIN BUTTONS
              if($('.lightbox-post-i .meta-like a[data-pin-do="buttonPin"]').length){
                try{
                  window.parsePinBtns();
                }catch(ex){}
              }

              if($prev_tile.length){
                var prev_tile_post_id = $prev_tile.find('article').first().attr('id').replace('post-', '');
                var prev_tile_title = $prev_tile.find('.entry-title a').text();
                if(!prev_tile_title){
                  prev_tile_title = $prev_tile.find('.archive-item-media-thumbnail').data('lightbox-caption');
                }
                if($prev_tile.find('figure.abs-image img').length){
                  var prev_tile_featured_image_url = $prev_tile.find('figure.abs-image img').attr('src');
                }else if($prev_tile.find('figure.abs-slider li:first img').length){
                  var prev_tile_featured_image_url = $prev_tile.find('figure.abs-slider li:first img').attr('src');
                }else if($prev_tile.find('.post-video-box').length){
                  var prev_tile_featured_image_url = $prev_tile.find('.post-video-box').data('featured-image-url');
                }

                $('body').append('<a href="#" data-post-id="' + prev_tile_post_id + '" class="post-prev-lightbox"><div class="post-next-prev-nav-arrow"><i class="os-icon os-icon-angle-left"></i></div><div class="post-next-prev-image" style="background-image: url('+ prev_tile_featured_image_url +');"></div><h4>'+ prev_tile_title +'</h4></a>');
              }else{
                $('.post-prev-lightbox').fadeOut(300, function(){ $(this).remove(); });
              }
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

                $('body').append('<a href="#" data-post-id="' + next_tile_post_id + '" class="post-next-lightbox"><div class="post-next-prev-nav-arrow"><i class="os-icon os-icon-angle-right"></i></div><div class="post-next-prev-image" style="background-image: url('+ next_tile_featured_image_url +');"></div><h4>'+ next_tile_title +'</h4></a>')
              }else{
                // last tile, but we need to check if infinite load exist
                $.fn.osetin_infinite_scroll.loadNextPageIsotope(true);
                $('.post-next-lightbox').fadeOut(300, function(){ $(this).remove(); });
              }
              setTimeout(function(){
                $('.lightbox-post-w, .post-next-lightbox, .post-prev-lightbox').addClass('make-visible');
                $('.lightbox-post-w').perfectScrollbar({
                  includePadding: true,
                  suppressScrollX: true,
                  wheelPropagation: false,
                });
              }, 100);

            }else{
              $('body').append('<div class="autosuggest-items-shadow"></div><h3 class="no-results-augosuggest">'+data.message+'</h3>');
            }
          }
      });
      return false;
    });

  });
} )( jQuery );