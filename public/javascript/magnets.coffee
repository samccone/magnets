cached = {}
dragging = false

submitWord = (e) ->
  closeModel()
  socket.emit "newWord",
    'word' : $('#add_word_form input').val()
  $('#add_word_form input').val ''

closeModel = () ->
  $('#add_word_form').hide().addClass 'inactive'

setListeners = () ->
  $(window).on 'keydown', (e) ->
    if e.keyCode == 68 && dragging != false
      removeWord dragging
  $('#add_word').on 'click', ->
    $('#add_word_form').show().removeClass 'inactive'
  $('#add_word_form .close').on 'click', closeModel
  $('#add_word_form .add').on 'click', submitWord
  $('#add_word_form input').on 'keydown', (e) ->
    if e.keyCode == 13
      submitWord e
    if e.keyCode == 32
      e.preventDefault()

removeWord = () ->
  socket.emit 'remove_word',
    word: $(dragging).data('word')
  $(dragging).remove()
  dragging = false

createAWord = (word) ->
  $('#hold').append "<div class='magnet no_select' style='left: "+ word.position.left+"px; top: "+word.position.top+"px;' data-word='"+word.word+"'>"+escape(word.word)+"</div>"

socketListeners = () ->
  socket.on 'newWord', (data) ->
    createAWord(data.word)
    setupMagnets()

  socket.on 'pieceRemoved', (data) ->
    $('[data-word="'+data.word+'"]').remove();

  socket.on 'pieceMoved', (data) ->
    selector =  cached[data.word] || ( ->
                                          cached[data.word] = $("[data-word='" + data.word + "']")
                                          return cached[data.word]
                                      )()
    selector.offset(data.offset).css
      "z-index": 999

  socket.on 'peopleOnline', (data) ->
        $('#people_online .count').html(data);

setupMagnets = () ->
  $(".magnet").draggable
      drag: sendUpdate,
      stop: sendStopUpdate

sendUpdate = (e) ->
  dragging = e.target
  params =
            word: $(e.target).data('word'),
            offset: $(e.target).offset(),
            position: $(e.target).position()
  socket.emit 'update', params

sendStopUpdate = (e) ->
  dragging = false
  params =
            word: $(e.target).data('word'),
            offset: $(e.target).offset(),
            position: $(e.target).position()
  socket.emit 'stop_update', params
$ ->
  setListeners()
  socketListeners()
  setupMagnets()