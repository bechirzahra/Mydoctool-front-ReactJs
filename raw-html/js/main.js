function resizeInputTitleProtocol() {
  if ($(this).val().length >= 45) {
      $(this).parents('.group-input-custom').addClass('error');
    return false;
  }
  $(this).parents('.group-input-custom').removeClass('error');
  $(this).attr('size', $(this).val().length);
}

$(function() {

  $("#protocole .ongletsMenu li").click(function() {
    var tabTitle = $(this).attr('title');

    $(this).parents('.popinCreateItem').find('.ongletsMenu li').removeClass("active");
    $(this).parents('.popinCreateItem').find(".frequenceWrapper,.alertWrapper").removeClass('active');

    $(this).addClass('active');
    $(this).parents('.popinCreateItem').find("."+tabTitle+"Wrapper").addClass('active');
  });

  /**List Protocoles**/
  $( "#protocoles #popinAddProtocole .select li" ).click(function() {
    $( "#protocoles #popinAddProtocole .select p" ).html( $(this).text() );
  });

  $( "#protocoles #popinAddProtocole .select" ).click(function(e) {
    if ($(e.target).is("li,p,span,.select")) {
      $(this).toggleClass( "open" );
    }
  });
  /**List Protocoles**/

  /***Add/Edit Protocole***/
  $('#protocole .general .colorPicker a').click(function(e){
    if (!$(e.target).is("li,ul")) {
      $(this).parent().find('ul').toggle();
     }
  });
  $('#protocole .general .colorPicker li').click(function(e){
    $(this).parents('.colorPicker').find('.color').css('backgroundColor', $(this).css('backgroundColor') );
    $(this).parents('.colorPicker').find('ul').hide();
  });

  $('#protocole .name input[type="text"]').keyup(resizeInputTitleProtocol).each(resizeInputTitleProtocol);

  var $toolTips = $('.tooltips');
  $toolTips.each(function () {
    var $element = $(this);
    $element.popover({
        html: true,
        placement: 'top',
        container: $('body'),
        title: $element.attr('data-title') + '<a href="#" class="close" data-dismiss="alert">×</a>',
        trigger: 'manual'
    });
    $element.on('shown.bs.popover', function () {
      var popover = $element.data('bs.popover');
      if (typeof popover !== "undefined") {
        var $tip = popover.tip();
        $tip.find('.close').bind('click', function () {
            popover.hide();
        });
      }
    });
  });

  $('#protocole .general .help').click(function(){
    if(!$('.popover').is(':visible')) {
      $('.tooltips').popover('show');
    }
  });
  $( "#protocole .popinCreateItem input[name=duration]" ).change(function(){
    var $element = $(this).parents('li').find('.durationForm');
    if($(this).val()!='period'){
      $element.addClass('disable');
      $element.find('select').attr('disabled',true);
    } else {
      $element.removeClass('disable');
      $element.find('select').attr('disabled',false);
    }
  });
  $( "#protocole #popinLevel .iconTypes li" ).click(function(){
    $(this).toggleClass('active');
  });
  /***Add/Edit Protocole***/


  $('#questionsWrapper .task').click(function(){
    $('#popinTask').modal('show');
  });
  $('#questionsWrapper .notice').click(function(){
    $('#popinNotice').modal('show');
  });
  $('#questionsWrapper .data').click(function(){
    $('#popinData').modal('show');
  });
  $('#questionsWrapper .select').click(function(){
    $('#popinSelect').modal('show');
  });
  $('#questionsWrapper .bool').click(function(){
    $('#popinBool').modal('show');
  });
  $('#questionsWrapper .level').click(function(){
    $('#popinLevel').modal('show');
  });
  $('#questionsWrapper .text').click(function(){
    $('#popinText').modal('show');
  });

  $( "#dashboard .timeline li" ).click(function(e) {
    $(this).toggleClass( "open" );
  });

  $("#dashboard .tabs a").click(function() {
    $(this).parent().find('a').removeClass("open");
    $(this).addClass("open");
    $("#dashboard .contentDash").hide();
    console.log( "#dashboard .contentDash."+ $(this).attr('class').replace("open", "") );
    $("#dashboard .contentDash."+ $(this).attr('class').replace("open", "") ).show();
  });

  var lineChartData = [0, 6, 9, 10, 11, 14, 20],
      overlayDataset = {
        fill: '#DADADA',
        stroke: '#DADADA',
        highlight: '#DADADA',
        highlightStroke: '#DADADA'
      };

  $( ".chart" ).each(function() {
      var canvas = document.getElementById($(this).attr('id')),
          ctx = canvas.getContext('2d')
      var Line = new Chart(ctx).Line({
        labels: new Array(lineChartData.length),
        datasets: [{
          strokeColor: overlayDataset.stroke,
          pointColor: '#B8E986',
          pointStrokeColor: overlayDataset.stroke,
          data: lineChartData
        }]
      }, {
        // responsive: true,
        showScale: false,
        showTooltips: false,
        datasetStrokeWidth: 2,
        datasetFill: false,
        pointDotRadius : 5,
        pointDotStrokeWidth: 2,
        animation: false,
        animationEasing: 'easeInOutQuint',
        onAnimationComplete: function(){
          this.options.animation = true;
        }
      });
  });

 $('#patient .item').popover({
    html: true,
    placement: 'bottom',
    container: '.dash',
    content: function(e) {
      console.log(e);
      return $('#popoverItemPatient').html();
    }
  });

  $("#patient .tabs a").click(function() {
    $(this).parent().find('a').removeClass("open");
    $(this).addClass("open");
    $("#patient .timelineContent,#patient .protocolsContent").hide();
    $("#patient ."+ $(this).attr('data-content') ).show();
  });


});