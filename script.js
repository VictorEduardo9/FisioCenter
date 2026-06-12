// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyCe2CQPQQ2NUmEnqE9f8TuVlEXU3hx8ydg",
  authDomain: "fisiocenter1.firebaseapp.com",
  projectId: "fisiocenter1",
  storageBucket: "fisiocenter1.firebasestorage.app",
  messagingSenderId: "233911657425",
  appId: "1:233911657425:web:dc0cebb3e6eff89895f6f0",
  measurementId: "G-2GBQCW7G38",
};  


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const spanUsuario = document.getElementById("usuario");

const btnlogin = document.getElementById("logingoogle").addEventListener("click" , async() =>{
    try {
        const result = await signInWithPopup(auth, provider)
        document.getElementById("usuario").textContent = 
            result.user.displayName;
        console.log("Nome:", result.user.displayName);
        console.log("Email:", result.user.email);
    } catch (error) {
        console.error(error);
    }

});

const btnlogout = document.getElementById("logoutgoogle");
btnlogout.addEventListener("click" , async () => {

    try {
        await signOut(auth)
    } catch (error) {
        console.error("Erro no Logout:" , error);
    }
});

onAuthStateChanged(auth, (user)=> {
    if (user) {
        spanUsuario.textContent = user.displayName
        logingoogle.style.display = "none"
        btnlogout.style.display = "inline-block"
    } else {
        spanUsuario.textContent = ""
        logingoogle.style.display = "inline-block"
        btnlogout.style.display = "none"
    }
})





const trocaraba1 = document.getElementById("btntrocar1").addEventListener("click", () => {
    const aba1 = document.getElementById("aba1");
    const aba2 = document.getElementById("aba2");

    if (aba2.style.display === "none") {
        aba1.style.display = "none";
        aba2.style.display = "flex";
    } else {
        aba1.style.display = "flex";
        aba2.style.display = "none";
    }

    
});

const trocaraba2 = document.getElementById("btntrocar2").addEventListener("click", () => {
    const aba1 = document.getElementById("aba1");
    const aba2 = document.getElementById("aba2");

    if (aba2.style.display === "none") {
        aba1.style.display = "none";
        aba2.style.display = "flex";
    } else {
        aba1.style.display = "flex";
        aba2.style.display = "none";
    }

    
});

const btnvoltar = document.getElementById("btnagendar2").addEventListener("click", () => {
    const aba1 = document.getElementById("aba1");
    const aba2 = document.getElementById("aba2");
    aba1.style.display = "none";
    aba2.style.display = "flex";
})

const proximapag = document.getElementById("btnagendar").addEventListener("click" , async() => {
    const user = auth.currentUser;
    if (user) {
        window.location.href = "agendar.html"
    } else {
        document.getElementById("logingoogle").click();
    }

})