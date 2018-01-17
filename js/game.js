/**
 * @author Jakub Czaja <jakoob89@gmail.com>
 * Copyright (c) 2018 Jakub Czaja
 **/

// Initial Variables
var pointsTracker = 0
var count = 10
var sound = true

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
    var btnId = $(this).attr('data-dif-id')
    count = btnId
    $('.btnDif').addClass('disabled')
    $(this).removeClass('disabled')
    $('#btnStart').removeAttr('disabled')
  })

  // Button Sounds
  $('#gameContainer button').click(function () {
    if (sound === true) {
      $.playSound('audio/click.mp3')
    }
  })
  $('.btnDif').click(function () {
    if (sound === true) {
      $.stopSound()
      $.playSound('audio/click2.mp3')
    }
  })
  $('.btnSlide').click(function () {
    if (sound === true) {
      $.playSound('audio/swoosh.mp3')
    }
  })

  // Mute Function
  $('#btnMute').click(function () {
    if (sound === true) {
      sound = false
      $('#btnMute svg').addClass('fa-volume-off')
    } else {
      sound = true
      $('#btnMute svg').addClass('fa-volume-up')
    };
  })

  // Screen Changer
  $('.scrChange').on('click', function () {
    var scrId = $(this).attr('data-scr-id')
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
    if (sound === true) {
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

  // Making pictures droppable
  $('.gameDrop').droppable({
    accept: '.gameItem',
    tolerance: 'intersect',
    drop: handleDrop
  })

  // Function handling drop
  function handleDrop (event, ui) {
    var gameDropId = $(this).attr('data-drop-id')
    var gameDragId = ui.draggable.attr('data-drag-id')
    if (gameDropId === gameDragId) {
      $(".gameItem[data-drop-id='" + gameDropId + "']").remove()
      $(".gameDrop[data-drop-id='" + gameDropId + "']").append(ui.draggable)
      if (sound === true) {
        $.playSound('audio/ding.mp3')
      }
      pointsTracker += 1
      if (pointsTracker > 11) {
        $('.pyro').css('display', 'block')
        if (sound === true) {
          $.playSound('audio/tada.mp3')
        }
      }
    } else {
      if (sound === true) {
        $.playSound('audio/error.mp3')
      }
    }
  }
})
