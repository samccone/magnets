hold        = $("#hold")
cached      = {}

###
---   sends an update to the server to distribute to the clients
###
sendUpdate = (e) ->
  params =
        word: $(e.target).data 'word'
        position: $(e.target).postion()
        offset: $(e.target).offset()
  socket.emit 'update', params

###
---    Listen for pieces moving
###
socket.on 'pieceMoved', (data) ->
  selector = cached[data.word] || ( ->
    cached[data.word] = $("[data-word='"+data.word+"']")
    return cached[data.word] )()
  selector
    .offset(data.offset)
    .css("z-index": 999)

$ ->
  $(".magnet").draggable
    drag : sendUpdate
    stop : sendUpdate