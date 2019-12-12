export let myStorage = window.localStorage;

$(function() {

    console.log(myStorage.getItem("jwt"));

    grabDagTree();


});

export async function grabDagTree() {

    let r =  axios.get('http://localhost:3000/public/DAGs/')

    r.then(response => {
        let a = response.data
        console.log(a);
    }).catch(error => {
        console.log(error.response);
    })

}


export async function userDuplicate() {

    let r = axios.post('http://localhost:3000/users/', {})

}


