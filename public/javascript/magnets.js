// Generated by CoffeeScript 1.3.3
(function() {
  var cached, closeModel, createAWord, dragging, removeWord, sendStopUpdate, sendUpdate, setListeners, setupMagnets, socketListeners, submitWord;

  cached = {};

  dragging = false;

  submitWord = function(e) {
    closeModel();
    socket.emit("newWord", {
      'word': $('#add_word_form input').val()
    });
    return $('#add_word_form input').val('');
  };

  closeModel = function() {
    return $('#add_word_form').hide().addClass('inactive');
  };

  setListeners = function() {
    $(window).on('keydown', function(e) {
      if (e.keyCode === 68 && dragging !== false) {
        return removeWord(dragging);
      }
    });
    $('#add_word').on('click', function() {
      return $('#add_word_form').show().removeClass('inactive');
    });
    $('#add_word_form .close').on('click', closeModel);
    $('#add_word_form .add').on('click', submitWord);
    return $('#add_word_form input').on('keydown', function(e) {
      if (e.keyCode === 13) {
        submitWord(e);
      }
      if (e.keyCode === 32) {
        return e.preventDefault();
      }
    });
  };

  removeWord = function() {
    socket.emit('remove_word', {
      word: $(dragging).data('word')
    });
    $(dragging).remove();
    return dragging = false;
  };

  createAWord = function(word) {
    return $('#hold').append("<div class='magnet no_select' style='left: " + word.position.left + "px; top: " + word.position.top + "px;' data-word='" + word.word + "'>" + escape(word.word) + "</div>");
  };

  socketListeners = function() {
    socket.on('newWord', function(data) {
      createAWord(data.word);
      return setupMagnets();
    });
    socket.on('pieceRemoved', function(data) {
      return $('[data-word="' + data.word + '"]').remove();
    });
    socket.on('pieceMoved', function(data) {
      var selector;
      selector = cached[data.word] || (function() {
        cached[data.word] = $("[data-word='" + data.word + "']");
        return cached[data.word];
      })();
      return selector.offset(data.offset).css({
        "z-index": 999
      });
    });
    return socket.on('peopleOnline', function(data) {
      return $('#people_online .count').html(data);
    });
  };

  setupMagnets = function() {
    return $(".magnet").draggable({
      drag: sendUpdate,
      stop: sendStopUpdate
    });
  };

  sendUpdate = function(e) {
    var params;
    dragging = e.target;
    params = {
      word: $(e.target).data('word'),
      offset: $(e.target).offset(),
      position: $(e.target).position()
    };
    return socket.emit('update', params);
  };

  sendStopUpdate = function(e) {
    var params;
    dragging = false;
    params = {
      word: $(e.target).data('word'),
      offset: $(e.target).offset(),
      position: $(e.target).position()
    };
    return socket.emit('stop_update', params);
  };

  $(function() {
    setListeners();
    socketListeners();
    return setupMagnets();
  });

}).call(this);
