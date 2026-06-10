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