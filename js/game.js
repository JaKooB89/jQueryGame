/**
 * @author Jakub Czaja <jakoob89@gmail.com>
 * Copyright (c) 2018 Jakub Czaja
 **/

// Declaring Global Variables
var pointsTracker = 0
var levelTracker = 0
var count = 10
var sound = true
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
    'audio/click2.mp3', 'audio/swoosh.mp3',
    'audio/trombone.mp3', 'audio/tada.mp3',
    'audio/error.mp3', 'audio/shutter.mp3'
  ])

  // Difficulty Level Choice
  $('.btnDif').click(function () {
    btnId = $(this).attr('data-dif-id')
    count = btnId
    $('.btnDif').addClass('disabled')
    $(this).removeClass('disabled')
    $('#btnStart').removeAttr('disabled')
    $('#btnTime span').html(count)
  })

  // Button Sounds
  $('#gameContainer button').click(function () {
    if (sound) {
      $.playSound('audio/click.mp3')
    }
  })
  $('.btnDif').click(function () {
    if (sound) {
      $.stopSound()
      $.playSound('audio/click2.mp3')
    }
  })
  $('.btnSlide').click(function () {
    if (sound) {
      $.playSound('audio/swoosh.mp3')
    }
  })

  // Mute Function
  $('#btnMute').click(function () {
    if (sound) {
      $.stopSound()
      sound = false
      $('#btnMute svg').addClass('fa-volume-off')
    } else {
      $.playSound('audio/click.mp3')
      sound = true
      $('#btnMute svg').addClass('fa-volume-up')
    };
  })

  // Screen Changer
  $('.scrChange').on('click', function () {
    scrId = $(this).attr('data-scr-id')
    $('.screen').fadeOut(300, function () {
      setTimeout(function () {
        $('#screen' + scrId).fadeIn()
      }, 301)
    })
  })

  // Background Changer
  $('.backThumb').on('click', function () {
    var bgId = $(this).attr('data-bg-id')
    $('#gameContainer').css('background-image', 'url(images/bg' + bgId + '.jpg)')
    if (sound) {
      $.playSound('audio/shutter.mp3')
    }
  })

  // Making pictures draggable
  $('.gameItem').draggable({
    cursor: 'move',
    helper: 'clone',
    revert: 'invalid',
    hoverClass: 'hovered',
    revertDuration: 300
  })

  // Making dropzones
  $('.gameDrop').droppable({
    accept: '.gameItem',
    tolerance: 'intersect',
    drop: handleDrop
  })

  // Start Game
  $('#btnStart').click(function () {
    $('.btnDif').attr('disabled', true)
    $('.btnDif').hide()
  })

  // Win function (all levels completed)
  function win () {
    if (levelTracker === 3) {
      $('.pyro').css('display', 'block')
      if (sound) {
        $.playSound('audio/tada.mp3')
      }
      $('.screen').fadeOut(300, function () {
        // setTimeout(function () {
        //   $('#winScreen').fadeIn()
        // }, 301)
      })
    }
  }

  // Level completed
  function lvlup () {
    if (pointsTracker === 4) {
      pointsTracker = 0
      levelTracker += 1
      gemUp()
      setTimeout(gemUp, 500)
      $('#btnPoints span').html(pointsTracker)
      $('#btnLevel span').html(levelTracker)
      $('.screen').fadeOut(300, function () {
        setTimeout(function () {
          $('#screen2').fadeIn()
        }, 301)
      })
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
      $(".gameItem[data-drop-id='" + gameDropId + "']").remove()
      $(".gameDrop[data-drop-id='" + gameDropId + "']").append(ui.draggable)
      pointsTracker += 1
      $('#btnPoints span').html(pointsTracker)
      addPoint()
      setTimeout(addPoint, 500)
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
