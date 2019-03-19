$(window).on("load", function () {
  $(".loader-wrapper").fadeOut("slow");
});
// scrollTop
$('#scrollTop ').click(function (e) {

  $('html, body').animate({
    scrollTop: 0
  }, 1000);
  e.preventDefault();
});
// // slider
// $('.owl-carousel').owlCarousel({
//   loop: true,
//   margin: 10,
//   nav: false,
//   autoplay: true,
//   autoplayTimeout: 3000,
//   autoplayHoverPause: true,
//   responsive: {
//     0: {
//       items: 1
//     },
//     600: {
//       items: 1
//     },
//     1000: {
//       items: 1
//     }
//   }
// });
// // animate.css
// // $(".offer-wrap").hover(function () {
// //   $(this).addClass('animated ' + 'zoomIn');
// // });
// // $(".offer-wrap").bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
// //   $(this).removeClass('animated ' + 'zoomIn');
// // });


