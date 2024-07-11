import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyDQoZbH0OUE1kJu3azZwScz6N_RZMsTQMo",
  authDomain: "medicapp-98dda.firebaseapp.com",
  projectId: "medicapp-98dda",
  storageBucket: "medicapp-98dda.appspot.com",
  messagingSenderId: "751923081656",
  appId: "1:751923081656:web:aa8a19079d5ba9739e1f4d",
  measurementId: "G-TE3C24Q5VT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if(user){
        updateUserProfile(user);
        const uid = user.uid;
        return uid;
    } else {
        window.location.href = "index.html";
    }
})

function updateUserProfile(user){
    const userName = user.displayName;
    const userEmail = user.email;
    const userProfilePicture = user.photoURL;

    document.getElementById("name").textContent = userName;
    document.getElementById("email").textContent = userEmail;
    document.getElementById("profile").src = userProfilePicture;

    console.log(user.uid);
    
}

const logoutBtn = document.getElementById("logoutBtn")

logoutBtn.addEventListener("click", function(){
    signOut(auth).then(() => {
        window.location.href = "index.html";
      }).catch((error) => {
        // An error happened.
      });
})

const newPxBtn = document.getElementById("newPxBtn")

newPxBtn.addEventListener("click",function(){
    window.location.href = "newPx.html";
})