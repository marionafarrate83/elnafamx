import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  child,
  push,
  onValue,
  update
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDQoZbH0OUE1kJu3azZwScz6N_RZMsTQMo",
  authDomain: "medicapp-98dda.firebaseapp.com",
  projectId: "medicapp-98dda",
  storageBucket: "medicapp-98dda.appspot.com",
  messagingSenderId: "751923081656",
  appId: "1:751923081656:web:aa8a19079d5ba9739e1f4d",
  measurementId: "G-TE3C24Q5VT",
  databaseURL: "https://medicapp-98dda-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
console.log(database);

onAuthStateChanged(auth, (user) => {
  if (user) {
    getUserInfo(user);
    console.log("oauth " + user.uid);
    return user.uid;
  } else {
    window.location.href = "index.html";
  }
});

function getUserInfo(user) {
  let userId = user.uid;
  let uidField = document.getElementById("userIdFld");
  uidField.setAttribute("value", userId);
  console.log("getUserInfo " + userId);
}



function addPatient() {
  console.log("entra a write ");

  let insertUID = document.getElementById("userIdFld").value;
  console.log("value del campo " + insertUID);

  const postListRef = ref(database, "patient");
  const newPostRef = push(postListRef);

  const insertNombre = document.getElementById("nombrePx").value;
  const insertEdad = document.getElementById("edadPx").value;

  set(newPostRef, {
    doctorId: insertUID,
    nombrePx: insertNombre,
    edadPx: insertEdad,
  })
    .then(() => {
      alert("Paciente Creado Exitosamente");
      window.location.href = "logged.html";
    })
    .catch((error) => {
      console.log("Error");
      console.log(error);
    });
}

document.addEventListener("load", leerUrlParams());

function leerUrlParams() {
  var url = window.location.href;
  const urlParams = new URL(url).searchParams;
  const px = urlParams.get("px");
  console.log(px);
  console.log(url);
  if (px) {
    console.log("si hay paciente");
    var fldPx = document.getElementById("pxId");
    fldPx.setAttribute("value",px);
    loadPxInfo(px);
  } else {
    console.log("paciente nuevo");
  }
}

function loadPxInfo(px) {
  console.log("paciente " + px);

  const dbRef = ref(database, "patient");

  onValue(
    dbRef,
    (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        if (childKey == px){
            console.log("childKey "+childKey);
            console.log(childData.nombrePx);
            console.log(childData.edadPx);
            document.getElementById("nombrePx").value=childData.nombrePx;
            document.getElementById("edadPx").value=childData.edadPx;
        }        
      });
    },
    {
      onlyOnce: true,
    }
  );
  
}

let existPx = document.getElementById("pxId");
let valExPx = existPx.getAttribute("value");
console.log("px existente "+ valExPx);

let botonGuardar = document.getElementById("btnGuardarPx");
if (valExPx){
    botonGuardar.addEventListener("click", updatePatient);
} else {
    botonGuardar.addEventListener("click", addPatient);
}

function updatePatient(){
    console.log("actualizar paciente")
    
    let insertUID = document.getElementById("userIdFld").value;
    console.log("value del campo " + insertUID);

    const insertPx = document.getElementById("pxId").getAttribute("value");
    const insertNombre = document.getElementById("nombrePx").value;
    const insertEdad = document.getElementById("edadPx").value;
  
    const postData = {
        doctorId: insertUID,
        nombrePx: insertNombre,
        edadPx: insertEdad,
    }

    const updates = {};
    updates['/patient/' + insertPx] = postData;

    update(ref(database), updates)
    .then(() => {
        alert("Paciente Actualizado Exitosamente");
        window.location.href = "logged.html";
      })
    .catch((error) => {
        console.log("Error");
        console.log(error);
      });
}
