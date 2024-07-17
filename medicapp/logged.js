import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getDatabase,
  ref,
  onValue,
  child,
  get,
  update,
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
let varUid = "";

onAuthStateChanged(auth, (user) => {
  if (user) {
    updateUserProfile(user);
    varUid = user.uid;
    return varUid;
  } else {
    window.location.href = "index.html";
  }
});

function updateUserProfile(user) {
  const userName = user.displayName;
  const userEmail = user.email;
  const userProfilePicture = user.photoURL;

  document.getElementById("name").textContent = userName;
  document.getElementById("email").textContent = userEmail;
  document.getElementById("profile").src = userProfilePicture;

  console.log(user.uid);
}

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function () {
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      // An error happened.
    });
});

const newPxBtn = document.getElementById("newPxBtn");

newPxBtn.addEventListener("click", function () {
  window.location.href = "newPx.html";
});

const botonLoad = document.getElementById("load");
botonLoad.addEventListener("click", readDoctorPatients());

const divLista = document.getElementById("listaPx");

function readDoctorPatients() {
  const dbRef = ref(database, "patient");

  onValue(
    dbRef,
    (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        console.log("childKey " + childKey);
        console.log(childData);
        console.log(childData.doctorId);
        console.log(childData.nombrePx);
        console.log(childData.edadPx);
        if (childData.doctorId == varUid) {
          var newRow = document.createElement("tr");
          var newCell = document.createElement("td");
          var newCell2 = document.createElement("td");
          var newButton = document.createElement("button");
          var newIcon = document.createElement("i");
          newIcon.setAttribute("class","fa fa-eye");
          var newButton2 = document.createElement("button");
          newButton.innerHTML = '<i class="fa fa-eye"></i>';   
          newButton.setAttribute("value", childKey);
          newButton.setAttribute("id", childKey);
          newButton.addEventListener("click", function () {
            console.log(newButton.value);
            window.location.href = "newPx.html" + "?px=" + newButton.value;
          });
          newButton2.innerHTML = '<i class="fa fa-trash"></i>';
          newButton2.setAttribute("value", childKey);
          newButton2.addEventListener("click", function () {

            var res = confirm("estas seguro que deseas eliminar a este paciente?")

            if (res) {

              console.log(res);
            console.log(newButton2.value);
            const postData = null;
            const updates = {};
            updates["/patient/" + newButton2.value] = postData;
            update(ref(database), updates)
              .then(() => {
                alert("Paciente Eliminado Exitosamente");
                window.location.href = "logged.html";
                })
              .catch((error) => {
                console.log("Error");
                console.log(error);
              });
              
            }  
          });
          newCell.innerHTML = childData.nombrePx;
          newRow.append(newCell);
          newCell2.innerHTML = childData.edadPx;
          newRow.append(newCell2);
          newRow.append(newButton);
          newRow.append(newButton2);
          document.getElementById("rows").appendChild(newRow);
        }
      });
    },
    {
      onlyOnce: true,
    }
  );
}