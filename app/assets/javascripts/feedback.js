async function updateFeedback(){
    let jwt = window.localStorage.getItem("jwt")
    let name = window.localStorage.getItem("username")
    let r = axios.get('http://localhost:3000/private/'+name+"",
      {headers: { Authorization: "Bearer " + jwt }})

    r.then(response => {
    console.log(response);
    }).catch(error=>{
    console.log(error.response.data.err);
    });
    console.log(r)
      




    for (var path in r.data.result) {
      availableTags.push(r.data.result[path].name)
      
      let buttonid = "delete-feedback-button-"+i;
      i++;
      let name = r.data.result[path].name;
      // console.log(r.data.result[path].name)
      $("#feedback-table-body").append(`
        <tr>
            <td>2019</td> 
            <td><a href="#"><button class="feedback-button" id="`+buttonid+`">delete</button></a></td>
        </tr>`
      )
      
       $("#" + buttonid).on('click',function(){
        deleteFeedback(name)
       });
      //  document.getElementsByClassName("feedback-button").addEventListener('click', leaveFeedback(this))
    }
}

updateFeedback()