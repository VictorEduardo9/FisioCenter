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

const inputData = document.getElementById("data");
const hoje = new Date();
const ano = hoje.getFullYear();
const mes = String(hoje.getMonth() + 1).padStart(2, "0");
const dia = String(hoje.getDate()).padStart(2, "0");
const dataHoje = `${ano}-${mes}-${dia}`;
inputData.setAttribute("min", dataHoje);

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


function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
}




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

    const dataSelecionada = new Date(data + "T00:00:00");
    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0);

    if (dataSelecionada < dataAtual) {
        conf.textContent = "Data inválida - Escolha uma data futura. ⚠️";
        conf.style.color = "#f0db80";
        return;
    }

    const dataLimite = new Date(dataAtual);
    dataLimite.setMonth(dataLimite.getMonth() + 2);
    
    if (dataSelecionada > dataLimite) {
        conf.textContent = "Data fora do limite - Agendamentos somente até 2 meses de antecedência. ⚠️"
        conf.style.color = "#f0db80";
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
    conf.innerHTML = `${servico}, ${formatarData(data)} ás ${horario} <br> Agendado com sucesso! ✅`
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
            card.className = "card-agendamento novo"
            card.innerHTML = `
            <img id="calendario" src="Calendario.png"><p><strong>${formatarData(d.data)}</strong> às <strong>${d.horario}</strong></p>
            <button class="btncancelar" data-id="${documento.id}"><img id="imglixeira" src="Lixeira.png">Cancelar</button>
            `;
            lista.appendChild(card);
            setTimeout(()=> {
                card.classList.remove("novo");
            },10);
        }));
        document.querySelectorAll(".btncancelar").forEach((btn) => {
            btn.addEventListener("click" , async () => {
                const card = btn.closest(".card-agendamento");
                card.classList.add("removendo");

                setTimeout(async()=>{
                await deleteDoc(doc(db , "agendamentos" , btn.dataset.id));
                carregaragendamentos();
            });
            });
        });

    } catch (error) {
        lista.innerHTML = "<p>Erro ao carregar agendamentos.</p>";
        console.error(error);
    }

    }


document.getElementById("btnvoltar").addEventListener("click", () => {
    window.location.href = "index.html"
    })

["servico" , "data" , "horariosel"].forEach((id) => {
        document.getElementById(id).addEventListener("change" , () => {
            conf.textContent = "";
            conf.style.color = "";
        });
    });



