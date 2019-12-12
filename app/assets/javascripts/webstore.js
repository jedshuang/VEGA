
//  var availableTags = ["Making a youtube playlist", "How to beat tetris", "How to find memes on reddit", "How to find ebooks", "How to get into bitcoin mining", "How to start a blog", "How to hack a bad website", "How to make and edit wikipedia pages", "How to buy youtube followers", "How to become a multibillionaire", "How to donload all material needed for COMP401"];
let availableTags = [""];

async function updatePaths(search){
  const r = await axios.get('http://localhost:3000/public/DAGs');
  //console.log(r.data.result)

  for (var path in r.data.result) {
    availableTags.push(r.data.result[path].name)
    $("#webstore-table-body").append(`
      <tr>
          <th>`+r.data.result[path].name+`</th>
          <td>`+r.data.result[path].description+`</td>
          <td>`+Math.round(Math.random(0,100)*100)+`</td>
          <td>`+r.data.result[path].maker+`</td>
          <td>2019</td> 
          <td><a href="#"><button class="explore-button">explore</button></a></td>
      </tr>`
    )
  }

}

async function changePathDisplay(search){
  const r = await axios.get('http://localhost:3000/public/DAGs');
  // console.log(r.data.result)
  $("#webstore-table-body").empty();
  for (var path in r.data.result) {
    // $("#webstore-table-body").append( ``)
    if(r.data.result[path].name.includes(search)){
      console.log(path)
      $("#webstore-table-body").append(`
      <tr>
          <th>`+r.data.result[path].name+`</th>
          <td>`+r.data.result[path].description+`</td>
          <td>`+Math.round(Math.random(0,100)*100)+`</td>
          <td>`+r.data.result[path].maker+`</td>
          <td>2019</td> 
          <td><a href="#"><button class="explore-button">explore</button></a></td>
      </tr>`
    )
    }
  }
}

updatePaths()
// console.log(availableTags);
$("#searchbar").autocomplete({
    source: availableTags
});

$("#search-button").click(function (){
  let inputb = $("#searchbar").val()
  // console.log(inputb)
  changePathDisplay(inputb)
});


    

