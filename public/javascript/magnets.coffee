words = ["the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "person", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"];

$ ->
  hold        = $("#hold")
  cached      = {}

  ###
  ---    places the magnets in random places across the screen
  ###
  _.each words, (word) ->
    properties =
      left: (Math.floor (Math.random()) * window.innerWidth) + "px"
      top: (Math.floor (Math.random()) * window.innerHeight) + "px"
    elm = $("<div class='magnet' data-word='"+word+"'>"+word+"</div>")
    hold.append elm
    elm
      .css(properties)

  ###
  ---   sends an update to the server to distribute to the clients
  ###
  sendUpdate = (e) ->
    params =
          target: $(e.target).data 'word'
          position: $(e.target).offset()
    socket.emit 'update', params

  ###
  ---    Listen for pieces moving
  ###
  socket.on 'pieceMoved', (data) ->
    selector = cached[data.target] || ( ->
      cached[data.target] = $("[data-word='"+data.target+"']")
      return cached[data.target] )()
    selector
      .offset(data.position)
      .css("z-index": 999)

  $(".magnet").draggable
    drag : sendUpdate
    stop : sendUpdate
