
//  var availableTags = ["Making a youtube playlist", "How to beat tetris", "How to find memes on reddit", "How to find ebooks", "How to get into bitcoin mining", "How to start a blog", "How to hack a bad website", "How to make and edit wikipedia pages", "How to buy youtube followers", "How to become a multibillionaire", "How to donload all material needed for COMP401"];
let availableTags = [""];

export function leaveFeedback(path){
  let jwt = window.localStorage.getItem("jwt")
  let name = window.localStorage.getItem("username")
  if (jwt){
    let feedbacksentence = prompt("Please leave feedback on the "+path+" path!", "feedback...")
    let q = axios.post('http://localhost:3000/private/'+name,
      {data: {pathname: path, feedback: feedbacksentence}, type: "merge"}, 
      {headers: { Authorization: "Bearer " + jwt }})

      q.then(response => {
        console.log(response);
      }).catch(error=>{
        console.log(error.response.data.err);
      });
  }else{
    alert("You must be signed in to leave feedback on paths.")
  }
}


async function updatePaths(search){
  const r = await axios.get('http://localhost:3000/public/DAGs');
  //console.log(r.data.result)

  let i = 0;

  for (var path in r.data.result) {
    availableTags.push(r.data.result[path].name)
    
    let buttonid = "feedback-button-"+i;
    i++;
    let name = r.data.result[path].name;
    // console.log(r.data.result[path].name)
    $("#webstore-table-body").append(`
      <tr>
          <th>`+r.data.result[path].name+`</th>
          <td>`+r.data.result[path].description+`</td>
          <td>`+Math.round(Math.random(0,1000)*1000)+`</td>
          <td>`+r.data.result[path].maker+`</td>
          <td>2019</td> 
          <td><a href="#"><button class="feedback-button" id="`+buttonid+`">feedback</button></a></td>
      </tr>`
    )
    
     $("#" + buttonid).on('click',function(){
      leaveFeedback(name)
     });
    //  document.getElementsByClassName("feedback-button").addEventListener('click', leaveFeedback(this))
  }

}

async function changePathDisplay(search){
  const r = await axios.get('http://localhost:3000/public/DAGs');
  let i=0;
  // console.log(r.data.result)
  $("#webstore-table-body").empty();
  for (var path in r.data.result) {
    // $("#webstore-table-body").append( ``)
    if(r.data.result[path].name.includes(search)){
      // console.log(path)
      let buttonid = "feedback-button-"+i;
      i++;
      let name = r.data.result[path].name;
      $("#webstore-table-body").append(`
      <tr>
          <th>`+r.data.result[path].name+`</th>
          <td>`+r.data.result[path].description+`</td>
          <td>`+Math.round(Math.random(0,1000)*1000)+`</td>
          <td>`+r.data.result[path].maker+`</td>
          <td>2019</td> 
          <td><a href="#"><button class="feedback-button" id="`+buttonid+`">feedback</button></a></td>
      </tr>`
    )
    $("#" + buttonid).on('click',function(){
      leaveFeedback(name)
     });
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

$("#search-bar").keyup( function(event) {
  console.log(event)
  // Number 13 is the "Enter" key on the keyboard
  if (event.originalEvent.key == "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("search-button").click();
  }
});
