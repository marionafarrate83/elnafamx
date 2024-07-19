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

var searchTargetPx1 = document.getElementById("searchTargetPx");
searchTargetPx1.addEventListener("keyup",buscaPx) 

function buscaPx(){
  var searchTargetPx = document.getElementById("searchTargetPx");
      
  const tableReg = document.getElementById('datos');
            const searchText = document.getElementById('searchTargetPx').value.toLowerCase();
            let total = 0;
 
            // Recorremos todas las filas con contenido de la tabla
            for (let i = 1; i < tableReg.rows.length; i++) {
                // Si el td tiene la clase "noSearch" no se busca en su cntenido
                if (tableReg.rows[i].classList.contains("noSearch")) {
                    continue;
                }
 
                let found = false;
                const cellsOfRow = tableReg.rows[i].getElementsByTagName('td');
                // Recorremos todas las celdas
                for (let j = 0; j < cellsOfRow.length && !found; j++) {
                    const compareWith = cellsOfRow[j].innerHTML.toLowerCase();
                    // Buscamos el texto en el contenido de la celda
                    if (searchText.length == 0 || compareWith.indexOf(searchText) > -1) {
                        found = true;
                        total++;
                    }
                }
                if (found) {
                    tableReg.rows[i].style.display = '';
                } else {
                    // si no ha encontrado ninguna coincidencia, esconde la
                    // fila de la tabla
                    tableReg.rows[i].style.display = 'none';
                }
            }
}

function readDoctorPatients() {
  const dbRef = ref(database, "patient");

  onValue(
    dbRef,
    (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        
        if (childData.doctorId == varUid) {
          var newRow = document.createElement("tr");
          var nombre = document.createElement("td");
          var apellido = document.createElement("td");
          var fechaNacimiento = document.createElement("td");
          var sexo = document.createElement("td");
          var edad = document.createElement("td");
          var newButton = document.createElement("button");
          newButton.innerHTML = '<i class="fa fa-edit"></i> Ver/Editar Paciente';   
          newButton.setAttribute("value", childKey);
          newButton.setAttribute("class","btn btn-primary")
          newButton.addEventListener("click", function () {
            window.location.href = "newPx.html" + "?px=" + newButton.value;
          });
          var newButton2 = document.createElement("button");
          newButton2.innerHTML = '<i class="fa fa-trash"></i> Eliminar';
          newButton2.setAttribute("value", childKey);
          newButton2.setAttribute("class", "btn btn-danger");
          newButton2.addEventListener("click", function () {
            var res = confirm("estas seguro que deseas eliminar a este paciente?")
            //TODO: Revisar validación de integridad referecnial con consultas o expediente
            if (res) {
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
          var newButtonConsulta = document.createElement("button");
          newButtonConsulta.innerHTML = '<i class="fa fa-plus"></i> Nueva consulta';
          newButtonConsulta.setAttribute("value", childKey);
          newButtonConsulta.setAttribute("class", "btn btn-success");


          nombre.innerHTML = childData.nombre;
          apellido.innerHTML = childData.apellido;
          fechaNacimiento.innerHTML = childData.fechaNacimiento;
          sexo.innerHTML = childData.sexo;
          edad.innerHTML = childData.edad;
          newRow.append(nombre);
          newRow.append(apellido);
          newRow.append(sexo);
          newRow.append(edad);
          newRow.append(newButton);
          newRow.append(newButtonConsulta);
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