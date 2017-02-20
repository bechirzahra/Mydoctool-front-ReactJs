$(function() {

  $('.rating-tooltip').rating();

  $('.rating-symbol').click(function () {
    console.warn($('.rating-tooltip').rating('rate'));
  });

  $('.bloc.done .overflow').click(function(){
    $(this).parent().toggleClass('open');
  });

  $('#menuMobile a').click(function(){
    $('#menuMobile a').removeClass('active');
    $('#wrapper .main,#wrapper .leftSidebar,#wrapper .rightSidebar').hide();
    if($(this).attr('data-page')!="main"){
      $('#filtresMobile').hide();
    } else { $('#filtresMobile').show(); }
    $('#wrapper .'+$(this).attr('data-page')).show();
    $(this).addClass('active');
  });

});
