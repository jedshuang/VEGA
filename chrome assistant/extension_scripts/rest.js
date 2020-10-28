function setup() {
    // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyA8aJBihn8XnY_bk5jVivFELgAZUyRUV2A",
    authDomain: "vega-b1d4a.firebaseapp.com",
    databaseURL: "https://vega-b1d4a.firebaseio.com",
    projectId: "vega-b1d4a",
    storageBucket: "vega-b1d4a.appspot.com",
    messagingSenderId: "269754897817",
    appId: "1:269754897817:web:c9875c8ac0ea32a79f6f08",
    measurementId: "G-QZQTMB3WHB"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
//   firebase.analytics();
  console.log(firebase)

  var database = firebase.database();
  return database;
}
var database = setup()
function postToDatabase(data) {
    
    // var database = setup();
    var ref = database.ref("tutorials");
    

    // var data = {
    //     name: "Test",
    //     DAG: "notadag"
    // }
    ref.child(Object.keys(data)[0]).set(data[Object.keys(data)[0]]);
}

function getFromDatabase(callback) {
    // var database = setup();
    var ref = database.ref("tutorials");

    ref.on('value', callback, function(err) {console.log(err)});
}