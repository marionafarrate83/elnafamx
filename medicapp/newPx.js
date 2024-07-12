import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getDatabase, ref, set, child, push } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDQoZbH0OUE1kJu3azZwScz6N_RZMsTQMo",
  authDomain: "medicapp-98dda.firebaseapp.com",
  projectId: "medicapp-98dda",
  storageBucket: "medicapp-98dda.appspot.com",
  messagingSenderId: "751923081656",
  appId: "1:751923081656:web:aa8a19079d5ba9739e1f4d",
  measurementId: "G-TE3C24Q5VT",
  databaseURL: "https://medicapp-98dda-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
console.log(database)


onAuthStateChanged(auth, (user) => {
    if(user){
        getUserInfo(user);
        console.log("oauth " + user.uid)
        return user.uid;
    } else {
        window.location.href = "index.html";
    }
})

function getUserInfo(user){
    let userId = user.uid;
    let uidField = document.getElementById("userIdFld");
    uidField.setAttribute("value",userId);
    console.log("getUserInfo " + userId);
}



let boton = document.getElementById("btnGuardarPx")
boton.addEventListener("click",addPatient);

function addPatient() {
    console.log("entra a write ")

    let insertUID = document.getElementById("userIdFld").value
    console.log("value del campo " + insertUID);

    const postListRef = ref(database,'patient');
    const newPostRef = push(postListRef);

    const insertNombre = document.getElementById("nombrePx").value
    const insertEdad = document.getElementById("edadPx").value

    set(newPostRef,{
        doctorId: insertUID,
        nombrePx: insertNombre,
        edadPx: insertEdad
    })
    .then(()=>{
        alert("Paciente Creado Exitosamente");
        window.location.href = "logged.html";
    })
    .catch((error)=>{
        console.log("Error");
        console.log(error);
    })  

}