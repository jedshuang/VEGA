function deleteFeedback(pathnamefeed, feedbackfeed){
    let jwt = window.localStorage.getItem("jwt")
    let r = axios.delete('http://localhost:3000/private/'+name,
      {params: {pathname: pathnamefeed, feedback: feedbackfeed}},
      {headers: { Authorization: "Bearer " + jwt }})
    
      updateFeedback()
}



async function updateFeedback(){
    let jwt = window.localStorage.getItem("jwt")
    let name = window.localStorage.getItem("username")
    let r = axios.get('http://localhost:3000/private/'+name,
      {headers: { Authorization: "Bearer " + jwt }})

    r.then(response => {
        console.log(response);

        for (let i=0;i<response.data.result.length;i++) {
            let buttonid = "delete-feedback-button-"+i;
            console.log(response.data.result[i])
            
            let feedback = response.data.result;
            console.log(i)

            $("#feedback-table-body").append(`
                <tr>
                    <td>`+feedback[i].pathname+`</td> 
                    <td>`+feedback[i].feedback+`</td> 
                    <td><a href="#"><button class="feedback-button" id="`+buttonid+`">delete</button></a></td>
                </tr>`
            )
            
            $("#" + buttonid).on('click',function(){
                deleteFeedback(feedback[i].pathname, feedback[i].feedback)
        });
        }
    }).catch(error=>{
        // console.log(error.response);
    });
    
}

updateFeedback()