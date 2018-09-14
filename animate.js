$(function() {

    var header_end = $('#top').offset().top + $('#header-top').height();
    var modal_display = false;

    $(window).on('scroll', function() {
        var stop = $(this).scrollTop();
        if (stop + 50 > header_end) {
            $('.nav').addClass('past-header');
        } else {
            $('.nav').removeClass('past-header');
        }
    });

    $('.page-scroll').on('click', function() {
        $('html, body').stop().animate({
            scrollTop: ($($(this).attr('href')).offset().top)
        }, 500);
    });

    var img_index = 0;
    $('.gallery img').on('click', function() {
        img_index = $(this).index();
        $('#myModal')[0].style.display = "block";
        $('#modal-img')[0].src = $(this)[0].src;
        $('.bg-history').css('z-index', 2);
    });
    $('.close').on('click', function() {
        $('#myModal')[0].style.display = "none";
        $('.bg-history').css('z-index', 0);
    });
    $('.prev').on('click', function() {
        if (img_index == 0) {
            img_index = 9;
        } else {
            img_index -= 1;
        }
        $('#modal-img')[0].src = $('.gallery img')[img_index].src;
    });
    $('.next').on('click', function() {
        if (img_index == 9) {
            img_index = 0;
        } else {
            img_index += 1;
        }
        $('#modal-img')[0].src = $('.gallery img')[img_index].src;
    });
    $(window).on('keydown', function(event) {
        if (event.which == 37) {
            if (img_index == 0) {
                img_index = 9;
            } else {
                img_index -= 1;
            }
            $('#modal-img')[0].src = $('.gallery img')[img_index].src;
        } else if (event.which == 39) {
            if (img_index == 9) {
                img_index = 0;
            } else {
                img_index += 1;
            }
            $('#modal-img')[0].src = $('.gallery img')[img_index].src;
        } else if (event.which == 27) {
            $('#myModal')[0].style.display = "none";
            $('.bg-history').css('z-index', 0);
        }
    });

    $('#contact_button').on('click', function() {
        $('#contact_me')[0].style.display = "block";
    });
    $('.contact-close').on('click', function() {
        $('#contact_me')[0].style.display = "none";
    });
    $(window).on('click', function(event) {
        if (event.target == $('#contact_me')[0]) {
            $('#contact_me')[0].style.display = "none";
        }
    });

});