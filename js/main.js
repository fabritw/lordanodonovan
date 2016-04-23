/* extend carousel slide to support IE 
** https://github.com/twitter/bootstrap/pull/3052/files
*/

$.fn.carousel.Constructor.prototype.slide = function (type, next) {
  if(!$.support.transition && this.$element.hasClass('slide')) {
    this.$element.find('.item').stop(true, true); //Finish animation and jump to end.
  }
  var $active = this.$element.find('.active')
    , $next = next || $active[type]()
    , isCycling = this.interval
    , direction = type == 'next' ? 'left' : 'right'
    , fallback  = type == 'next' ? 'first' : 'last'
    , that = this
    , e = $.Event('slide')

  this.sliding = true

  isCycling && this.pause()

  $next = $next.length ? $next : this.$element.find('.item')[fallback]()

  if ($next.hasClass('active')) return

  if ($.support.transition && this.$element.hasClass('slide')) {
    this.$element.trigger(e)
    if (e.isDefaultPrevented()) return
    $next.addClass(type)
    $next[0].offsetWidth // force reflow
    $active.addClass(direction)
    $next.addClass(direction)
    this.$element.one($.support.transition.end, function () {
      $next.removeClass([type, direction].join(' ')).addClass('active')
      $active.removeClass(['active', direction].join(' '))
      that.sliding = false
      setTimeout(function () { that.$element.trigger('slid') }, 0)
    })
  }else if(!$.support.transition && this.$element.hasClass('slide')) {
    this.$element.trigger(e)
    if (e.isDefaultPrevented()) return
    $active.animate({left: (direction == 'right' ? '100%' : '-100%')}, 600, function(){
        $active.removeClass('active')
        that.sliding = false
        setTimeout(function () { that.$element.trigger('slid') }, 0)
    })
    $next.addClass(type).css({left: (direction == 'right' ? '-100%' : '100%')}).animate({left: '0'}, 600,  function(){
        $next.removeClass(type).addClass('active')
    })
  } else {
    this.$element.trigger(e)
    if (e.isDefaultPrevented()) return
    $active.removeClass('active')
    $next.addClass('active')
    this.sliding = false
    this.$element.trigger('slid')
  }

  isCycling && this.cycle()

  return this
}


/* Boostrap Modal Gallery updates */

var gallery = $('#modal-gallery');

gallery.on('beforeLoad', function(e) {
  $(this).find('.carousel-caption').text('');
});


gallery.on('load', function(e) {

  /* Boostrap Modal Gallery caption
  ** https://github.com/blueimp/Bootstrap-Image-Gallery/issues/43
  */
  var caption = $('<div class="carousel-caption"></div>')
          .css({
              position: 'absolute',
              opacity: 1,
              top: 'auto',
              'z-index': 1,
              color: '#fff'
          })
          .text($(this).find('.modal-title').text());
  $(this).find('.modal-image').append(caption);

  /* Boostrap Modal Gallery fix for IE7 
  ** https://github.com/blueimp/Bootstrap-Image-Gallery/issues/14
  */
  if ($.browser.msie && $.browser.version == "7.0") {
    var modal = $(this).data('modal');
    modal.$element
      .css('width', modal.img.width + 30)
      .css('margin-left', (modal.img.width / 2) * -1);
  }
});




