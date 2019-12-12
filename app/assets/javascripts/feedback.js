function deleteFeedback(pathnamefeed, feedbackfeed, list){
    let jwt = window.localStorage.getItem("jwt")
    let name = window.localStorage.getItem("username")

    let del = axios.delete('http://localhost:3000/private/'+name,
      {headers: { Authorization: "Bearer " + jwt }})
    // console.log(list)
    let left = list.filter(function(obj){
        return obj["pathname"] != pathnamefeed || obj["feedback"] != feedbackfeed;
    })
    // console.log(left)
    let q = axios.post('http://localhost:3000/private/'+name,
    {data: left, type: "merge"}, 
    {headers: { Authorization: "Bearer " + jwt }})
        // console.log(read)
        // console.log(del)
        // console.log(update)
    
    $("#feedback-table-body").empty()
    updateFeedback()
};
function editFeedback(pathnamefeed, feedbackfeed, list){
    let jwt = window.localStorage.getItem("jwt")
    let name = window.localStorage.getItem("username")

    let del = axios.delete('http://localhost:3000/private/'+name,
      {headers: { Authorization: "Bearer " + jwt }})
    // console.log(list)
    let left = list.filter(function(obj){
        if(obj["pathname"] == pathnamefeed && obj["feedback"] == feedbackfeed){
            console.log("HIIII")
            obj["feedback"] = prompt("Please leave feedback on the "+pathnamefeed+" path!", feedbackfeed)
        }
        return obj;
    })
    // console.log(left)
    let q = axios.post('http://localhost:3000/private/'+name,
    {data: left}, 
    {headers: { Authorization: "Bearer " + jwt }})
        // console.log(read)
        // console.log(del)
        // console.log(update)
    
    $("#feedback-table-body").empty()
    updateFeedback()
};
    



async function updateFeedback(){
    let jwt = window.localStorage.getItem("jwt")
    let name = window.localStorage.getItem("username")
    let r = axios.get('http://localhost:3000/private/'+name,
      {headers: { Authorization: "Bearer " + jwt }})

    r.then(response => {
        // console.log(response);

        for (let i=0;i<response.data.result.length;i++) {
            let buttonid = "delete-feedback-button-"+i;
            let buttonidedit = "edit-feedback-button-"+i;
            // console.log(response.data.result[i])
            
            let feedback = response.data.result;
            // console.log(i)

            $("#feedback-table-body").append(`
                <tr>
                    <td>`+feedback[i].pathname+`</td> 
                    <td>`+feedback[i].feedback+`</td> 
                    <td><a href="#"><button class="feedback-button" id="`+buttonid+`">delete</button></a>
                    <a href="#"><button class="feedback-button" id="`+buttonidedit+`">edit</button></a></td>
                </tr>`
            )
            
            $("#" + buttonid).on('click',function(){
                deleteFeedback(feedback[i].pathname, feedback[i].feedback, response.data.result)
            });
            $("#" + buttonidedit).on('click',function(){
                editFeedback(feedback[i].pathname, feedback[i].feedback, response.data.result)
            });
        }
    }).catch(error=>{
        // console.log(error.response);
    });
    
}

updateFeedback()