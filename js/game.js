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
  // Preloads Game Assets
  $.preload([
    'images/bg1.jpg', 'images/bg2.jpg',
    'images/bg3.jpg', 'images/bg4.jpg',
    'images/bg5.jpg', 'images/bg6.jpg',
    'images/bg7.jpg', 'images/bg8.jpg',
    'audio/ding.mp3', 'audio/click.mp3',
    'audio/error.mp3', 'audio/shutter.mp3',
    'audio/click2.mp3', 'audio/swoosh.mp3',
    'audio/trombone.mp3', 'audio/tada.mp3',
    'audio/magicwand.mp3'
  ])

  // Difficulty Level Choice
  $('.btnDif').on('click', function () {
    btnId = $(this).attr('data-dif-id')
    count = btnId
    $('.btnDif').addClass('disabled')
    $(this).removeClass('disabled')
    $('#btnStart').attr('disabled', false)
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
  $('#btnFull').on('click', function () {
    $('nav, #infoSection, footer').toggle()
    $('#container').toggleClass('container')
    $('#gameContainer').toggleClass('mt-4 mb-3 rounded')
    $('#innerGame').toggleClass('innerGameHight')
    $('#btnFull svg').toggleClass('fa-compress')
    $('#btnFull svg').toggleClass('fa-expand')
  })

  // Screen Changer
  $('.scrChange').on('click', function () {
    scrId = $(this).attr('data-scr-id')
    timerRes()
    $('.screen').fadeOut(300, function () {
      setTimeout(function () {
        $('#screen' + scrId).fadeIn()
      }, 301)
    })
    // Set and Show timers
    if (scrId >= 10) {
      counter = setInterval(timer, 1000)
      $('#btnTime').show()
      $('#btnTime').addClass('btn-outline-light')
      $('#btnTime').removeClass('btn-outline-danger')
      $('#btnTime').removeClass('btn-outline-warning')
    }
  })

  // Timer
  function timer () {
    count--
    $('#btnTime span').html(count)
    if (count === 0) {
      $('.screen').fadeOut(300, function () {
        setTimeout(function () {
          $('#screen8').fadeIn()
        }, 301)
      })
      $.playSound('audio/trombone.mp3')
      levelRes()
      timerRes()
    } else if (count <= 3) {
      $('#btnTime').removeClass('btn-outline-warning')
      $('#btnTime').addClass('btn-outline-danger')
    } else if (count <= 6) {
      $('#btnTime').removeClass('btn-outline-light')
      $('#btnTime').addClass('btn-outline-warning')
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
    $('#btnTime').hide()
    clearInterval(counter)
    count = btnId
    $('#btnTime span').html(count)
  }

  // Level Unlocking
  function lvlUnlock () {
    var nextLvl = levelTracker + 1
    if (levelTracker >= 1) {
      $('#lvl' + levelTracker).html('Level Completed<br><i class="fas fa-check"></i>')
      $('#lvl' + levelTracker).attr('disabled', true)
      $('#lvl' + levelTracker + ' ~ span').addClass('hideItem')
      $('#lvl' + nextLvl).html('PLAY')
      $('#lvl' + nextLvl).attr('disabled', false)
    }
  }

  // Background Changer
  $('.backThumb').on('click', function () {
    var bgId = $(this).attr('data-bg-id')
    $('#gameContainer').css('background-image', 'url(images/bg' + bgId + '.jpg)')
    if (sound) {
      $.playSound('audio/shutter.mp3')
    }
  })

  // Setting draggables
  $('.gameItem').draggable({
    cursor: 'move',
    helper: 'clone',
    revert: 'invalid',
    hoverClass: 'hovered',
    revertDuration: 300
  })

  // Setting dropzones
  $('.gameDrop').droppable({
    accept: '.gameItem',
    tolerance: 'intersect',
    drop: handleDrop
  })

  // Start Game
  $('#btnStart').on('click', function () {
    $('.btnDif').attr('disabled', true)
    $('.btnDif').hide()
  })

  // Win function (all levels completed)
  function win () {
    if (levelTracker === 4) {
      $('.pyro').css('display', 'block')
      if (sound) {
        $.stopSound()
        $.playSound('audio/tada.mp3')
      }
      $('.screen').fadeOut(300, function () {
        setTimeout(function () {
          $('#screen7').fadeIn()
        }, 301)
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
    window.location.reload()
  })

  // Level completed
  function lvlup () {
    if (pointsTracker === 4) {
      $.stopSound()
      $.playSound('audio/magicwand.mp3')
      pointsTracker = 0
      levelTracker += 1
      gemUp()
      setTimeout(gemUp, 500)
      $('#btnPoints span').html(pointsTracker)
      $('#btnLevel span').html(levelTracker)
      if (levelTracker !== 4) {
        $('.screen').fadeOut(300, function () {
          setTimeout(function () {
            $('#screen2').fadeIn()
          }, 301)
        })
      }
      timerRes()
      lvlUnlock()
      win()
    }
  }

  // Addpoint animation
  function addPoint () {
    $('#btnPoints').toggleClass('btn-outline-light')
    $('#btnPoints').toggleClass('btn-light')
  }

  // Lvlup animation
  function gemUp () {
    $('#btnLevel').toggleClass('btn-outline-light')
    $('#btnLevel').toggleClass('btn-light')
  }

  // Handling drop
  function handleDrop (event, ui) {
    var gameDropId = $(this).attr('data-drop-id')
    var gameDragId = ui.draggable.attr('data-drag-id')
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
