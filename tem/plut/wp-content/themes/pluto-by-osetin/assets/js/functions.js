/**
 * Theme functions file
 *
 * Contains handlers for navigation, accessibility, header sizing
 * footer widgets and Featured Content slider
 *
 */
( function( $ ) {

  function is_display_type(display_type){
    return ( ($('.display-type').css('content') == display_type) || ($('.display-type').css('content') == '"'+display_type+'"'));
  }
  function not_display_type(display_type){
    return ( ($('.display-type').css('content') != display_type) && ($('.display-type').css('content') != '"'+display_type+'"'));
  }


  // Initialize isotope layout only if there is a index-isotope container element on a page and the device in use is not a phone or a tablet
  function initiate_isotope() {
    var is_origin_left = true;
    if($('body').hasClass('rtl')){
      is_origin_left = false;
    }
    $isotope_elem = $('.index-isotope');
    if($isotope_elem.length && (not_display_type("tablet") || (is_display_type("tablet") && $('body').hasClass('menu-position-top') && $('body').hasClass('no-sidebar'))) && not_display_type("phone")){
      var layout_mode = $isotope_elem.data('layout-mode');
      var $isotope_container = $isotope_elem.isotope({
        'itemSelector': '.item-isotope',
        'layoutMode': layout_mode,
        'isOriginLeft': is_origin_left,
        'sortAscending': false,
        'transitionDuration': '0.5s',
        'getSortData': {
          views: '[data-total-views] parseInt',
          likes: '[data-total-likes] parseInt',
        },
      });
      $isotope_elem.addClass('isotope-active');
      // init isotope
      $isotope_container.isotope('layout');
      var $items = $isotope_container.find('.item-isotope');
      $isotope_container.removeClass('hidden-on-load').isotope( 'revealItemElements', $items );
    }else{
      $isotope_elem.removeClass('hidden-on-load');
      if($isotope_elem.length && $isotope_elem.hasClass('isotope-active')){
        $isotope_elem.isotope('destroy').removeClass('isotope-active');
      }
    }
  }

  // timed scroll event
  var uniqueCntr = 0;
  $.fn.scrolled = function (waitTime, fn) {
      if (typeof waitTime === "function") {
          fn = waitTime;
          waitTime = 100;
      }
      var tag = "scrollTimer" + uniqueCntr++;
      this.scroll(function () {
          var self = $(this);
          var timer = self.data(tag);
          if (timer) {
              clearTimeout(timer);
          }
          timer = setTimeout(function () {
              self.removeData(tag);
              fn.call(self[0]);
          }, waitTime);
          self.data(tag, timer);
      });
  }

  $(window).scrolled(function(){
      if($('.menu-position-top').length  && $('.fixed-header-w').length){
        var offset = $('.all-wrapper > .menu-block').offset();
        var trigger_point = offset.top + $('.all-wrapper > .menu-block').outerHeight();
        if($(document).scrollTop() >= trigger_point){
          $('body').addClass('fix-top-menu');
        }else{
          $('body').removeClass('fix-top-menu');
        }
      }
  });

  // Smarter window resize which allows to disregard continious resizing in favor of action on resize complete
  // $(window).resize(function() {
    // if(this.resizeTO) clearTimeout(this.resizeTO);
    // this.resizeTO = setTimeout(function() {
    //   $(this).trigger('resizeEnd');
    // }, 500);
  // });


  // Re-init isotope on window resize
  // $(window).bind('resizeEnd', function() {
    // initiate_isotope();
  // });

  function os_filter_posts(){
    var filter_string = '';

    // FORMATS FILTER
    var format_filter_string = '';
    if($('.index-filter-formats .index-filter-format.active').length){
      format_filter_string = '.format-' + $('.index-filter-format.active').data('filter-value');
    }

    // CATEGORIES SELECT BOX
    var $cat_filters = $('.index-filter-select-selected .index-filter-option');
    if($cat_filters.length){
      $cat_filters.each(function(){
        filter_string += format_filter_string + '.'+$(this).data('filter-value') + ',';
      });
      // remove last comma
      filter_string = filter_string.replace(/,\s*$/, "");
    }

    // CATEGORIES BUTTONS
    var $cat_filter_buttons = $('.index-filter-categories button.active');
    if($cat_filter_buttons.length){
      $cat_filter_buttons.each(function(){
        filter_string += format_filter_string + '.'+$(this).data('filter-value') + ',';
      });
      // remove last comma
      filter_string = filter_string.replace(/,\s*$/, "");
    }

    if(filter_string == '') filter_string = format_filter_string;

    if(filter_string == '') filter_string = '*';

    console.log(filter_string);

    $('.index-isotope').isotope({ filter : filter_string });
    if(filter_string == '*'){
      $('.masonry-grid .archive-posts').removeClass('filtering-now');
      $('.index-clear-filter-w').addClass('inactive');
    }else{
      $('.masonry-grid .archive-posts').addClass('filtering-now');
      $('.index-clear-filter-w').removeClass('inactive');
    }
    return false;
  }

  // Document Ready functions
  $( function() {

    $.fn.osetin_infinite_scroll.init_infinite_scroll();

    // If there is a qr-code generator button - init it
    if($('.single-post-top-qr').length){
      $('.single-post-top-qr').on("click", function(){
        $('#qrcode').html("");
        var qrcode = new QRCode("qrcode");
        qrcode.makeCode(window.location.href);
        $('#qrcode-modal').modal();
      });
    }

    // Initiate isotope layout on document ready
    initiate_isotope();



    $('.index-filter-categories-select').hover(function(){
      $(this).addClass('active');
    }, function(){
      $(this).removeClass('active');
    });

    $('.index-filter-categories-select .index-filter-options .index-filter-option').on('click', function(){
      $(this).addClass('selected');
      var $selected = $(this);
      $(this).closest('.index-filter-categories-select').removeClass('active').find('.index-filter-select-selected').addClass('has-items').append($selected.prop('outerHTML'));
      os_filter_posts();
      return false;
    });

    $('.index-filter-categories-select .index-filter-select-selected').on('click', '.index-filter-option', function(){
      var $selected_wrapper = $(this).closest('.index-filter-categories-select').find('.index-filter-select-selected');

      var filter_value = $(this).data('filter-value');
      $(this).closest('.index-filter-categories-select').find('.index-filter-options .index-filter-option[data-filter-value="'+ filter_value +'"]').removeClass('selected');
      $(this).remove();
      if(!$selected_wrapper.find('.index-filter-option').length){
        $selected_wrapper.removeClass('has-items');
      }
      os_filter_posts();
      return false;
    });



    // --------------------------------------------

    // ACTIVATE TOP MENU

    // --------------------------------------------

    // MAIN TOP MENU HOVER DELAY LOGIC
    var menu_timer;
    $('.menu-activated-on-hover .os_menu > ul > li.menu-item-has-children').mouseenter(function(){
      var $elem = $(this);
      clearTimeout(menu_timer);
      $elem.closest('ul').addClass('has-active').find('> li').removeClass('active');
      $elem.addClass('active');
    });
    $('.menu-activated-on-hover .os_menu > ul > li.menu-item-has-children').mouseleave(function(){
      var $elem = $(this);
      menu_timer = setTimeout(function(){
        $elem.removeClass('active').closest('ul').removeClass('has-active');

      }, 200);
    });

    // SUB MENU HOVER DELAY LOGIC
    var sub_menu_timer;
    $('.menu-activated-on-hover .os_menu > ul > li.menu-item-has-children > ul > li.menu-item-has-children').mouseenter(function(){
      var $elem = $(this);
      clearTimeout(sub_menu_timer);
      $elem.closest('ul').addClass('has-active').find('> li').removeClass('active');
      $elem.addClass('active');
      if($elem.length){
        var sub_menu_right_offset = $elem.offset().left + ($elem.outerWidth() * 2);
        if(sub_menu_right_offset >= $('body').width()){
          $elem.addClass('active-left');
        }
      }
    });
    $('.menu-activated-on-hover .os_menu > ul > li.menu-item-has-children > ul > li.menu-item-has-children').mouseleave(function(){
      var $elem = $(this);
      sub_menu_timer = setTimeout(function(){
        $elem.removeClass('active').removeClass('active-left').closest('ul').removeClass('has-active');

      }, 200);
    });


    $('.menu-activated-on-click li.menu-item-has-children > a').on('click', function(event){
      var $elem = $(this).closest('li');

      if($elem.hasClass('active')){
        $elem.closest('ul').removeClass('inactive');
        $elem.removeClass('active').find('.sub-menu').first().slideUp(200);
      }else{
        $elem.closest('ul').addClass('inactive');
        $elem.addClass('active').find('.sub-menu').first().slideDown(200);
      }
      return false;
    });



    // SEARHC AJAX FORM
    $('.search-trigger, .mobile-menu-search-toggler').on('click', function(){
      $('body').addClass('active-search-form');
      $('.main-search-form-overlay').fadeIn(300);
      $('.main-search-form .search-field').focus();
      return false;
    });

    $('.main-search-form-overlay').on('click', function(){
      $('body').removeClass('active-search-form');
      $('.main-search-form-overlay').fadeOut(300);
    });

    // END SEARCH AJAX FORM




    // Initiate perfect scrollbar for the fixed side menu
    $('.menu-position-left .menu-block, .menu-position-right .menu-block, .primary-sidebar-wrapper, .mobile-menu-w').perfectScrollbar({
      suppressScrollX: true,
      wheelPropagation: false,
      includePadding: true
    });

    $('.menu-toggler').on("click", function(){
      $("body").toggleClass('side-menu-active');
      $("body").removeClass('sidebar-active');
      return false;
    });

    $('.sidebar-toggler, .sidebar-main-toggler').on("click", function(){
      $("body").toggleClass('sidebar-active');
      $("body").removeClass('side-menu-active');
      return false;
    });



    // Flexslider init
    $('.slick-gallery').slick({
      slidesToShow : 1,
      slidesToScroll : 1,
      autoplay: false,
      infinite: false,
      speed: 200
    });

    if($('.featured-carousel').length){

      var number_of_columns = $('.featured-carousel').data('number-of-columns');
      $('.featured-carousel').slick({
        slidesToShow : number_of_columns,
        slidesToScroll : 1,
        autoplay: true,
        swipeToSlide: true,
        speed: 200,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 375,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
          // You can unslick at a given breakpoint now by adding:
          // settings: "unslick"
          // instead of a settings object
        ]
      });
    }

    // Toggle reading mode on link click
    $('body').on("click", '.single-post-top-reading-mode', function(){
      if($('body').hasClass('reading-mode')){
        $('body').removeClass("reading-mode");
        $('.single-post-top-reading-mode i').removeClass('os-icon-eye-slash').addClass('os-icon-eye');
        $('.single-post-top-reading-mode span').text($(this).data('message-on'));
      }else{
        $('body').addClass("reading-mode");
        $('.single-post-top-reading-mode i').removeClass('os-icon-eye').addClass('os-icon-eye-slash');
        $('.single-post-top-reading-mode span').text($(this).data('message-off'));
      }
      return false;
    });

    // Disable reading mode when ESC key is pressed
    $(document).keyup(function(e) {
      if (e.keyCode == 27) { 
        $('body').removeClass('reading-mode'); 
        $('body').removeClass('active-search-form');
        $('.main-search-form-overlay').fadeOut(300);
        $('.lightbox-post-shadow').click();
      }
    });

    // featured posts slider
    $('.featured-post-control-up').on("click", function(){
      var step_px = 95;
      var total_height = $('.featured-posts-slider-contents').height();
      var current_margin = Math.abs($('.featured-posts-slider-contents').css('margin-top').replace('px', ''));
      if((current_margin - step_px - 40) >= 0){
        var new_margin = (current_margin - step_px) * -1;
        $('.featured-posts-slider-contents').animate({ 'marginTop': new_margin + "px"}, 200);
      }else{
        $('.featured-posts-slider-contents').animate({ 'marginTop': '0px'}, 200);
      }
    });
    // featured posts slider
    $('.featured-post-control-down').on("click", function(){
      var step_px = 95;
      var total_height = $('.featured-posts-slider-contents').height();
      var current_margin = Math.abs($('.featured-posts-slider-contents').css('margin-top').replace('px', ''));
      if((current_margin + step_px + 40) <= total_height){
        var new_margin = (current_margin + step_px) * -1;
        $('.featured-posts-slider-contents').animate({ 'marginTop': new_margin + "px"}, 200);
      }else{
        $('.featured-posts-slider-contents').animate({ 'marginTop': '0px'}, 200);
      }
    });



    /// ------------------
    /// FILTER BUTTONS LOGIN
    /// ------------------

    if($('.index-isotope').length){
      var $os_masonry_grid = $('.index-isotope');
      $('.index-sort-options').on( 'click', 'button', function() {
        if($(this).hasClass('active')){
          $('.index-sort-options button').removeClass('inactive');
          $(this).removeClass('active');
          $os_masonry_grid.isotope({ sortBy : 'original-order', sortAscending: true });
          $('.masonry-grid .archive-posts').removeClass('sorting-now');
        }else{
          $('.index-sort-options button').removeClass('active').addClass('inactive');
          $(this).removeClass('inactive').addClass('active');
          var sortValue = $(this).data('sort-value');
          $os_masonry_grid.isotope({ sortBy: sortValue, sortAscending: false });
          $('.masonry-grid .archive-posts').addClass('sorting-now');
        }
        return false;
      });


      $('.index-filter-categories').on( 'click', 'button', function() {
        $(this).toggleClass('active');
        $(this).toggleClass('inactive');
        $('.index-filter-categories button:not(.active)').addClass('inactive');
        if(!$('.index-filter-categories button.active').length) $('.index-filter-categories button.inactive').removeClass('inactive');

        os_filter_posts();
        return false;
      });



      $('.index-filter-formats').on( 'click', '.index-filter-format', function() {
        if($(this).hasClass('active')){
          $(this).removeClass('active');
          $('.index-filter-formats .index-filter-format').removeClass('inactive');
        }else{
          $('.index-filter-formats .index-filter-format').removeClass('active').addClass('inactive');
          $(this).removeClass('inactive').addClass('active');
        }
        os_filter_posts();
        return false;
      });



      $('.index-clear-filter-btn').on( 'click', function() {
        $('.index-filter-categories button').removeClass('inactive').removeClass('active');
        $('.index-filter-select-selected .index-filter-option').remove();
        $('.index-filter-select-selected').removeClass('has-items');
        $('.index-filter-categories-select .index-filter-options').removeClass('selected');
        $('.index-filter-formats .index-filter-format').removeClass('inactive').removeClass('active');
        $('.masonry-grid .archive-posts').removeClass('filtering-now');
        $('.index-clear-filter-w').addClass('inactive');
        $os_masonry_grid.isotope({ filter : '*' });
        return false;
      });
    }


  } );
} )( jQuery );
