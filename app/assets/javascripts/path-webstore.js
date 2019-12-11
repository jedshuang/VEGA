export let myStorage = window.localStorage;

$(function() {

    console.log(myStorage.getItem("jwt"));

    grabDagTree();


});

export async function grabDagTree() {

    let r =  axios.get('http://localhost:3000/public/DAG/')

    r.then(response => {
        
    })

}



