import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, query, 
         where, getDocs, deleteDoc, doc, Timestamp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const db = getFirestore(app);
let usuarioAtual = null;
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

document.getElementById("h1fisio2").addEventListener("click" , () =>{
    window.location.href = "index.html"
})


const btnExpandir = document.getElementById("expandiragenda");
const opcoesAgenda = document.querySelector(".opcoesagenda");
const btnFechar = document.getElementById("btnfechar");

btnExpandir.addEventListener("click", () => {
    opcoesAgenda.classList.toggle("ativo");
});
btnFechar.addEventListener("click" , () => {
    opcoesAgenda.classList.remove("ativo");
})



document.getElementById("btnconfirmar").addEventListener("click" , async() => {
    if (!usuarioAtual) return;
    const servico = document.getElementById("servico").value;
    const data = document.getElementById("data").value;
    const horario = document.getElementById("horariosel").value;
    const conf = document.getElementById("btnconfirmar");

    if (!servico || !data || !horario){
        conf.textContent = "Dados insuficientes - Preencha todos os campos. ⚠️"
        conf.style.color = "#f0db80"
        return;
    }

    try {
        const verificacao = query(
            collection(db, "Agendamentos") ,
            where("data" , "==" , data),
            where("horario" , "==" , horario)
        );
        const resultado = await getDocs(verificacao);
        if (!resultado.empty) {
            conf.textContent = "Horário Reservado - Favor escolha outro. ❌";
            conf.style.color = "#ff9999";
            return;
        }

        await addDoc(collection(db, "Agendamentos"), {
            uid: usuarioAtual.uid,
            nome: usuarioAtual.displayName,
            email: usuarioAtual.email,
            servico,
            data,
            horario,
            criado_em: Timestamp.now()
        });
    conf.innerHTML = `${servico}, ${data} ás ${horario} <br> Agendado com sucesso! ✅`
    conf.style.color = "#d8f7db";

    document.getElementById("servico").value=""
    document.getElementById("data").value=""
    document.getElementById("selhorario").value=""
    carregaragendamentos();
    } catch (error) {
        conf.textContent = "❌ Erro ao agendar. Tente novamente.";
        console.error(error);
    }
})

