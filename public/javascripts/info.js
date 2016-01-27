// var search = document.getElementById('searchButton');
// var loadBar = document.getElementById('loadBar');
// var loader = document.getElementById('loader');
//
// search.addEventListener("click", show)
//
// function show() {
//   loadBar.style.display = "block"
//   loader.style.display = "block"
// }


  google.load('visualization', '1.0', {'packages':['corechart']});

  //google.setOnLoadCallback(drawAgeChart);
  $(function () {
    var age= 0
    var results = document.getElementById('results').innerHTML;
    resulted = JSON.parse(results);

    $("#race").click(function(){
      var asian = 0
      var black = 0
      var white = 0
      for (var i = 0; i < 3; i++) {
      if(resulted["Person"+i][0] !== undefined ) {
        var race = resulted["Person"+i][2]["race"]["value"]
        if(race == "White") {
          white +=1
        }
        else if(race == "Black") {
          black +=1
        }
        else if(race == "Asian") {
          asian +=1
        }
      }
    }
    drawRaceChart(asian,black,white)
    })

    $("#gender").click(function(){
      var male = 0;
      var female = 0;
      for (var i = 0; i < 3; i++) {
      if(resulted["Person"+i][0] !== undefined ) {
        var gender = resulted["Person"+i][1]["gender"]["value"]
        if(gender == "Male") {
          male +=1
        }
        else if(gender == "Female") {
          female +=1
        }
      }
    }
    console.log(male,female)
    drawGenderChart(female, male)
    })

    $("#age").click(function(){
      var teen = 0
      var twenty = 0
      var thirty = 0
      var fourty = 0
      var fifty = 0
      for (var i = 0; i < 3; i++) {
      if(resulted["Person"+i][0] !== undefined ) {
        var age = resulted["Person"+i][0]["age"]["value"]
        var aged = parseInt(age)
        if(aged >= 50 && aged < 60) {
          fifty +=1
        }
        else if(aged >= 40) {
          fourty +=1
        }
        else if(aged >= 30) {
          thirty +=1
        }
        else if(aged >=20) {
          twenty +=1
        }
        else if(aged >=10) {
          teen +=1
        }
    }
  }
  drawAgeChart(teen, twenty, thirty, fourty, fifty)
    })

  })

  function drawAgeChart(teen, twenty, thirty, fourty, fifty) {


    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Age');
    data.addColumn('number', 'Number of People');
    data.addRows([
      ["Teen", teen],
      ["Twenties", twenty],
      ['Thirties', thirty],
      ['Fourties', fourty],
      ['Fifties', fifty]

    ]);

    var options = {'title':'Consumer Ages',
    'width':400,
    'height':300};

    var chart = new google.visualization.PieChart(document.getElementById('infoPic'));
    chart.draw(data, options);
  }

  function drawRaceChart(asian, black, white) {


    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Age');
    data.addColumn('number', 'Number of People');
    data.addRows([
      ["White", white],
      ['Asian', asian],
      ['African-American', black],

    ]);

    var options = {'title':'Consumer Ages',
    'width':400,
    'height':300};

    var chart = new google.visualization.PieChart(document.getElementById('infoPic'));
    chart.draw(data, options);
  }

  function drawGenderChart(female,male) {


    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Age');
    data.addColumn('number', 'Number of People');
    data.addRows([
      ["Female", female],
      ['Male', male],

    ]);

    var options = {'title':'Consumer Ages',
    'width':400,
    'height':300};

    var chart = new google.visualization.PieChart(document.getElementById('infoPic'));
    chart.draw(data, options);
  }
