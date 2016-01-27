$(document).ready(function(){
  $('#home').click(function(){
    $(window).attr('location','http://www.example.com')
  });
  $('#about').click(function(){
    $(window).attr('location','http://www.example.com')
  })
  $("#searchButton").click(function(){
    $("#loadBar").css("display", "block")
    $("#loader").css("display", "block")
  })

})
