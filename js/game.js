/**
 * @author Jakub Czaja <jakoob89@gmail.com>
 * Copyright (c) 2018 Jakub Czaja
 **/

// Declaring Global Variables
var pointsTracker = 0
var levelTracker = 0
var sound = true
var count = 10
var counter
var scrId
var btnId

$(function () {
  // Preload Game Assets
  $.preload(assets).then(function () {
    // Start game when loading finished
    $('#loader').delay(2000).fadeOut(100, function () {
      $('#innerGame, #screen1').fadeIn()
    })
  }, function () {
    $('#loader h4').html('Loading Error, Refresh the Page')
    console.error('Error loading game.')
  }, function (progress) {
    $('#loader span').html(Math.round(progress * 100) + '%')
  })

  // Disable Selection and Right Click
  $('#innerGame').disableSelection().on('contextmenu', false)
  // Disable dragging images (other than draggables)
  $('img').not('.gameItem').on('dragstart', false)
  // Carousel swipe functionality
  $('.carousel').bcSwipe({ threshold: 50 })

  // Difficulty Level Choice
  $('.btnDif').on('click', function () {
    btnId = $(this).attr('data-dif-id')
    count = btnId
    $('.btnDif').addClass('disabled')
    $(this).removeClass('disabled')
    $('#btnStart').attr('disabled', false)
    $('#btnTime').show()
    $('#btnTime span').html(count)
  })

  // Button Sounds
  $('#gameContainer button').on('click', function () {
    if (sound) {
      $.playSound('audio/click.mp3')
    }
  })
  $('.btnDif').on('click', function () {
    if (sound) {
      $.stopSound()
      $.playSound('audio/click2.mp3')
    }
  })
  $('.btnSlide').on('click', function () {
    if (sound) {
      $.playSound('audio/swoosh.mp3')
    }
  })

  // Mute Function
  $('#btnMute').on('click', function () {
    if (sound) {
      $.stopSound()
      sound = false
      $('#btnMute svg').addClass('fa-volume-off')
    } else {
      $.playSound('audio/click.mp3')
      sound = true
      $('#btnMute svg').addClass('fa-volume-up')
    }
  })

  // Fullscreen Function
  function fullscreen () {
    $('nav, #infoSection, footer').toggle()
    $('#container').toggleClass('container')
    $('#gameContainer').toggleClass('mt-4 mb-3 rounded')
    $('#innerGame').toggleClass('innerGameHight')
    $('#btnFull svg').toggleClass('fa-expand fa-compress')
  }
  $('#btnFull').on('click', fullscreen)
  // Auto fulscreen on mobile browsers
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    fullscreen()
  }

  // Background Changer
  $('.backThumb').on('click', function () {
    let bgId = $(this).attr('data-bg-id')
    $('#gameContainer').css('background-image', 'url(images/backgrounds/bg' + bgId + '.jpg)')
    if (sound) {
      $.playSound('audio/shutter.mp3')
    }
  })

  // Screen Changer
  $('.scrChange').on('click', function () {
    scrId = $(this).attr('data-scr-id')
    timerRes()
    levelRes()
    $('.screen').fadeOut(100, function () {
      setTimeout(function () {
        $('#screen' + scrId).fadeIn()
      }, 101)
    })
    // Set Timer
    if (scrId >= 10) {
      counter = setInterval(timer, 1000)
    }
  })

  // Timer
  function timer () {
    count--
    $('#btnTime span').html(count)
    if (count === 0) {
      $('.screen').fadeOut(100, function () {
        setTimeout(function () {
          $('#screen8').fadeIn()
        }, 101)
      })
      if (sound) {
        $.playSound('audio/trombone.mp3')
      }
      levelRes()
      timerRes()
    } else if (count <= 3) {
      if (sound) {
        $.playSound('audio/tictoc.mp3')
      }
      $('#btnTime').removeClass('btn-outline-warning').addClass('btn-danger')
    } else if (count <= 6) {
      $('#btnTime').removeClass('btn-outline-light').addClass('btn-outline-warning')
    }
  }

  // Reset Level
  function levelRes () {
    $('.gameItem').removeClass('hideItem')
    pointsTracker = 0
    $('#btnPoints span').html(pointsTracker)
  }

  // Reset Timer
  function timerRes () {
    clearInterval(counter)
    count = btnId
    $('#btnTime span').html(count)
    $('#btnTime').addClass('btn-outline-light').removeClass('btn-danger btn-outline-warning')
  }

  // Level Unlocking
  function lvlUnlock () {
    let nextLvl = levelTracker + 1
    if (levelTracker >= 1) {
      $('#lvl' + levelTracker).html('Level Completed<br><i class="fas fa-check"></i>').attr('disabled', true)
      $('#lvl' + levelTracker + ' ~ span').addClass('hideItem')
      $('#lvl' + nextLvl).html('PLAY').attr('disabled', false)
    }
  }

  // Setting draggables
  $('.gameItem').draggable({
    helper: 'clone',
    revert: 'invalid',
    hoverClass: 'hovered',
    revertDuration: 100
  })

  // Setting dropzones
  $('.gameDrop').droppable({
    accept: '.gameItem',
    tolerance: 'intersect',
    drop: handleDrop
  })

  // Start Game
  $('#btnStart').on('click', function () {
    $('.btnDif').attr('disabled', true).hide()
  })

  // Win function (all levels completed)
  function win () {
    let highestLvl = Number($('.carousel-indicators-numbers li:last-of-type').html())
    if (levelTracker === highestLvl) {
      $('.pyro').css('display', 'block')
      if (sound) {
        $.stopSound()
        $.playSound('audio/tada.mp3')
      }
      $('.screen').fadeOut(100, function () {
        setTimeout(function () {
          $('#screen7').fadeIn()
        }, 101)
      })
    }
  }

  // Time Up
  $('#timeUp').on('click', function () {
    $('.screen').fadeOut(100, function () {
      setTimeout(function () {
        $('#screen2').fadeIn()
      }, 101)
    })
  })

  // Restart Game
  $('.restart').on('click', function () {
    $('#btnStart').attr('disabled', true)
    $('.carousel-caption button').attr('disabled', true)
    $('#lvl1').attr('disabled', false)
    window.location.reload()
  })

  // Level completed
  function lvlup () {
    if (pointsTracker === 4) {
      if (sound) {
        $.stopSound()
        $.playSound('audio/magicwand.mp3')
      }
      pointsTracker = 0
      levelTracker += 1
      gemUp()
      setTimeout(gemUp, 500)
      $('#btnPoints span').html(pointsTracker)
      $('#btnLevel span').html(levelTracker)
      $('.carousel').carousel('next')
      if (levelTracker !== 4) {
        $('.screen').fadeOut(100, function () {
          setTimeout(function () {
            $('#screen2').fadeIn()
          }, 101)
        })
      }
      timerRes()
      lvlUnlock()
      win()
    }
  }

  // Addpoint animation
  function addPoint () {
    $('#btnPoints').toggleClass('btn-outline-light btn-light')
  }
  // Lvlup animation
  function gemUp () {
    $('#btnLevel').toggleClass('btn-outline-light btn-light')
  }

  // Handling drop
  function handleDrop (event, ui) {
    let gameDropId = $(this).attr('data-drop-id')
    let gameDragId = ui.draggable.attr('data-drag-id')
    if (gameDropId === gameDragId) {
      $(ui.draggable).addClass('hideItem')
      pointsTracker += 1
      $('#btnPoints span').html(pointsTracker)
      addPoint()
      setTimeout(addPoint, 300)
      if (sound) {
        $.playSound('audio/ding.mp3')
      }
    } else {
      if (sound) {
        $.playSound('audio/error.mp3')
      }
    }
    lvlup()
  }
})
