
// let r = axios.get('http://localhost:3000/private/DAG');
// console.log(r);

var availableTags = [
    "Making a youtube playlist",
    "How to beat tetris",
    "How to find memes on reddit",
    "Waiting for the backend to be ready",
    "Learning to how to use the extension"
];



$("#searchbar").autocomplete({
    source: availableTags
  });

    

