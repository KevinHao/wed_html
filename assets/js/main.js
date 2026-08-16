(function ($)
  { "use strict"
  
/* 1. Proloder */
    $(window).on('load', function () {
      $('#preloader-active').delay(450).fadeOut('slow');
      $('body').delay(450).css({
        'overflow': 'visible'
      });
    });


/* 2. slick Nav */
// mobile_menu
    var menu = $('ul#navigation');
    if(menu.length){
      menu.slicknav({
        prependTo: ".mobile_menu",
        closedSymbol: '+',
        openedSymbol:'-'
      });
    };


/* 3. MainSlider-1 */
    function mainSlider() {
      var BasicSlider = $('.slider-active');
      BasicSlider.on('init', function (e, slick) {
        var $firstAnimatingElements = $('.single-slider:first-child').find('[data-animation]');
        doAnimations($firstAnimatingElements);
      });
      BasicSlider.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
        var $animatingElements = $('.single-slider[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
        doAnimations($animatingElements);
      });
      BasicSlider.slick({
        autoplay: true,
        autoplaySpeed: 6000,
        dots: false,
        fade: true,
        arrows: false,
        prevArrow: '<button type="button" class="slick-prev"><i class="ti-shift-left"></i></button>',
        nextArrow: '<button type="button" class="slick-next"><i class="ti-shift-right"></i></button>',
        responsive: [{
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
            }
          },
          {
            breakpoint: 991,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows: false
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows: false
            }
          }
        ]
      });

      function doAnimations(elements) {
        var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        elements.each(function () {
          var $this = $(this);
          var $animationDelay = $this.data('delay');
          var $animationType = 'animated ' + $this.data('animation');
          $this.css({
            'animation-delay': $animationDelay,
            '-webkit-animation-delay': $animationDelay
          });
          $this.addClass($animationType).one(animationEndEvents, function () {
            $this.removeClass($animationType);
          });
        });
      }
    }
    mainSlider();



/* 4. Testimonial Active*/
  var testimonial = $('.h1-testimonial-active');
    if(testimonial.length){
    testimonial.slick({
        dots: false,
        infinite: true,
        speed: 1000,
        autoplay:true,
        loop:true,
        arrows: false,
        prevArrow: '<button type="button" class="slick-prev"><i class="ti-angle-left"></i></button>',
        nextArrow: '<button type="button" class="slick-next"><i class="ti-angle-right"></i></button>',
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
              dots: false,
              arrow:false
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows:false
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows:false,
            }
          }
        ]
      });
    }


/* 5. Gallery Active */
    var client_list = $('.gallery-active');
    if(client_list.length){
      client_list.owlCarousel({
        items: 1,
        slidesToScroll: 1,
        loop: true,
        autoplay:true,
        speed: 3000,
        smartSpeed:2000,
        nav: false,
        dots: true,
        margin: 0,

        autoplayHoverPause: true,
        responsive : {
          0 : {
            nav: false,
            items: 1,
          },
          768 : {
            nav: false,
            items: 1,
          }
        }
      });
    }

/* 6. Nice Selectorp  */
  var nice_Select = $('select');
    if(nice_Select.length){
      nice_Select.niceSelect();
    }

/* 7.  Custom Sticky Menu  */
    $(window).on('scroll', function () {
      var scroll = $(window).scrollTop();
      if (scroll < 245) {
        $(".header-sticky").removeClass("sticky-bar");
      } else {
        $(".header-sticky").addClass("sticky-bar");
      }
    });

    $(window).on('scroll', function () {
      var scroll = $(window).scrollTop();
      if (scroll < 245) {
          $(".header-sticky").removeClass("sticky");
      } else {
          $(".header-sticky").addClass("sticky");
      }
    });



/* 8. sildeBar scroll */
    $.scrollUp({
      scrollName: 'scrollUp', // Element ID
      topDistance: '300', // Distance from top before showing element (px)
      topSpeed: 300, // Speed back to top (ms)
      animation: 'fade', // Fade, slide, none
      animationInSpeed: 200, // Animation in speed (ms)
      animationOutSpeed: 200, // Animation out speed (ms)
      scrollText: '<i class="ti-arrow-up"></i>', // Text for element
      activeOverlay: false, // Set CSS color to display scrollUp active point, e.g '#00FFFF'
    });


/* 9. data-background */
    $("[data-background]").each(function () {
      $(this).css("background-image", "url(" + $(this).attr("data-background") + ")")
      });


/* 10. WOW active */
    new WOW().init();

/* 10.1 Venue animation on every scroll entry */
    function venueScrollAnimation() {
      var venueDetails = document.querySelector('.venue-details');
      if (!venueDetails) return;

      venueDetails.classList.add('venue-scroll-target');

      if (!('IntersectionObserver' in window)) {
        venueDetails.classList.add('is-visible');
        return;
      }

      var venueObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            venueDetails.classList.remove('is-visible');
            void entry.target.offsetWidth;
            venueDetails.classList.add('is-visible');
          } else {
            venueDetails.classList.remove('is-visible');
          }
        });
      }, { threshold: 0.2 });

      venueObserver.observe(venueDetails);
    }
    venueScrollAnimation();

/* 11. Datepicker */
    
// 11. ---- Mailchimp js --------//  
    function mailChimp() {
      $('#mc_embed_signup').find('form').ajaxChimp();
    }
    mailChimp();


// 12 Pop Up Img
    var popUp = $('.single_gallery_part, .img-pop-up, .gallery-lightbox');
      if(popUp.length){
        popUp.magnificPopup({
          type: 'image',
          gallery:{
            enabled:true
          }
        });
      }

    var dressColors = $('.dress-color-lightbox');
    if (dressColors.length) {
      dressColors.magnificPopup({
        type: 'image',
        gallery: {
          enabled: true
        }
      });
    }
      
/* 14. Wedding countdown */
    // 請將日期改成你的婚禮日期，格式為 YYYY-MM-DDTHH:mm:ss+08:00。
    var weddingDate = new Date('2026-10-18T10:30:00+08:00').getTime();
    var countdown = $('.count-down-wrapper');

    if (countdown.length) {
      var counters = countdown.find('.counter');
      var countdownTimer;

      function updateCountdown() {
        var remaining = weddingDate - new Date().getTime();

        if (remaining <= 0) {
          counters.text('0');
          clearInterval(countdownTimer);
          return;
        }

        var days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        var hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
        var minutes = Math.floor((remaining / (1000 * 60)) % 60);
        var seconds = Math.floor((remaining / 1000) % 60);

        counters.eq(0).text(days);
        counters.eq(1).text(hours);
        counters.eq(2).text(minutes);
        counters.eq(3).text(seconds);
      }

      countdownTimer = setInterval(updateCountdown, 1000);
      updateCountdown();
    }

  //Another popUp     
        var popUp = $('.menorie-icon');
        if(popUp.length){
          popUp.magnificPopup({
            type: 'image',
            gallery:{
              enabled:true
            }
          });
        }
  // 

//Brand Active
  $('.brand-active').slick({
    dots: false,
    infinite: true,
    speed: 300,
    autoplay:true,
    speed: 1000,
    arrows: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
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



})(jQuery);
