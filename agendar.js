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



const logingoogle = document.getElementById("logingoogle");
logingoogle.addEventListener("click" , async() =>{
    try {
        const result = await signInWithPopup(auth, provider)
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
        usuarioAtual = user;
        spanUsuario.textContent = user.displayName
        logingoogle.style.display = "none"
        btnlogout.style.display = "inline-block"
        carregaragendamentos(); 
    } else {
        usuarioAtual = null;
        spanUsuario.textContent = ""
        logingoogle.style.display = "inline-block"
        btnlogout.style.display = "none"
         document.getElementById("listaagendamentos").innerHTML = "";
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
    const conf = document.getElementById("confirmacao");

    if (!servico || !data || !horario){
        conf.textContent = "Dados insuficientes - Preencha todos os campos. ⚠️"
        conf.style.color = "#f0db80"
        return;
    }

    try {
        const verificacao = query(
            collection(db, "agendamentos") ,
            where("data" , "==" , data),
            where("horario" , "==" , horario)
        );
        const resultado = await getDocs(verificacao);
        if (!resultado.empty) {
            conf.textContent = "Horário Reservado - Favor escolha outro. ❌";
            conf.style.color = "#ff9999";
            return;
        }

        await addDoc(collection(db, "agendamentos"), {
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
    document.getElementById("horariosel").value=""
    carregaragendamentos();
    } catch (error) {
        conf.textContent = "❌ Erro ao agendar. Tente novamente.";
        console.error(error);
    }
})

async function carregaragendamentos() {
    const lista = document.getElementById("listaagendamentos");
    lista.innerHTML = "Carregando..."
    try {
        const q = query(
            collection(db, "agendamentos"),
            where("uid" , "==" , usuarioAtual.uid)
        );
        const snapshot = await getDocs(q)
        if (snapshot.empty) {
            lista.innerHTML = "<h6>Nenhum agendamento encontrado. </h6>";
            return;
        }
        lista.innerHTML = "";
        snapshot.forEach((documento => {
            const d = documento.data();
            const card = document.createElement("div");
            card.className = "card-agendamento"
            card.innerHTML = `
            <p>📅 <strong>${d.data}</strong> ás <strong>${d.horario}</strong></p>
            <button class="btncancelar" data-id="${documento.id}">Cancelar</button>
            `;
            lista.appendChild(card);
        }));
        document.querySelectorAll(".btncancelar").forEach((btn) => {
            btn.addEventListener("click" , async () => {
                await deleteDoc(doc(db , "agendamentos" , btn.dataset.id));
                carregaragendamentos();
            });
        });

    } catch (error) {
        lista.innerHTML = "<p>Erro ao carregar agendamentos.</p>";
        console.error(error);
    }

    }


