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
    

    var tutorialName = Object.keys(data)[0];
    ref.child(tutorialName).set(data[Object.keys(data)[0]]);
    console.log(tutorialName);

    
    var ref = database.ref("users");
    // add ref child with new tutorial name under uid 
    ref.child(data[Object.keys(data)[0]].maker).push(tutorialName)
}

function getFromDatabase(callback) {
    // var database = setup();
    var ref = database.ref("tutorials");

    ref.on('value', callback, function(err) {console.log(err)});
}
/***
 * iteraction_data: 
 * {
 *    interaction_type: interaction_type,
 *    time: time,
 *    website_from: 'website'
 * }
 */
function postInteractionEvent(tutorial_name, interaction_type, time, website_from, data) {
    var interaction_ref = database.ref("interaction_log");
    interaction_ref.child(tutorial_name).push({interaction_type: interaction_type, time: time, website_from: website_from, data: data});
}