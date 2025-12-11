// ---------------------- CACHE ----------------------
function salvarNoCache(chave, dados) {
    let texto = JSON.stringify(dados);
    localStorage.setItem(chave, texto);
}

function carregarDoCache(chave) {
    let texto = localStorage.getItem(chave);

    if (texto === null) {
        return null;
    }

    return JSON.parse(texto);
}

let listaOriginal = [];
// ---------- exibir personagens ------
function exibirPersonagem(lista) {

    const divPerso = document.querySelector('.info');
    divPerso.innerHTML = "";

    lista.forEach(people => {

        let card = document.createElement("div");
        card.classList.add("informacao-panel");

        card.innerHTML = `
            <h2>${people.name}</h2>

            <div class="info">
                <p><strong>Altura:</strong> ${people.height} cm</p>
                <p><strong>Peso:</strong> ${people.mass} kg</p>
            </div>

            <button class="btn-more" name="${people.name}">
                Ver mais
            </button>
        `;

        card.querySelector(".btn-more").addEventListener("click", () => {
            abrirModal(people);
        });

        divPerso.appendChild(card);
    });
}
// ---------- BUSCA ----------
const campoBusca = document.getElementById("campoBusca");

campoBusca.addEventListener("input", () => {
    const termo = campoBusca.value.toLowerCase().trim();

    if (termo === "") {
        exibirPersonagem(listaOriginal);
        return;
    }

    const filtrados = listaOriginal.filter(p =>
        p.name.toLowerCase().includes(termo)
    );

    exibirPersonagem(filtrados);
});



// ---------------------- MODAL ----------------------
async function abrirModal(people) {

    document.getElementById("modalName").textContent =
        people.name || "Nome desconhecido";

    document.getElementById("modalHeight").textContent =
        people.height || "Altura desconhecida";

    document.getElementById("modalMass").textContent =
        people.mass || "Peso desconhecido";

    document.getElementById("modalHair").textContent =
        people.hair_color || "Cor desconhecida";

    document.getElementById("modalSkin").textContent =
        people.skin_color || "Cor desconhecida";

    document.getElementById("modalEyes").textContent =
        people.eye_color || "Cor desconhecida";

    document.getElementById("modalBirth").textContent =
        people.birth_year || "Ano desconhecido";

    document.getElementById("modalGender").textContent =
        people.gender || "Gênero desconhecido";

    // Planeta
    if (people.homeworld) {
        let resp = await fetch(people.homeworld);
        let planeta = await resp.json();
        document.getElementById("modalPlanet").textContent = planeta.name;
    } else {
        document.getElementById("modalPlanet").textContent = "Desconhecido";
    }

    // Filmes
    if (people.films.length === 0) {
        document.getElementById("modalFilmes").textContent = "Sem filmes";
    } else {
        document.getElementById("modalFilmes").innerHTML = "";
        for (let url of people.films) {
            let resp = await fetch(url);
            let filme = await resp.json();

            let p = document.createElement("p");
            p.textContent = filme.title;
            document.getElementById("modalFilmes").appendChild(p);
        }
    }

    document.getElementById("modalOverlay").classList.add("active");
}


// ---------------------- FECHAR MODAL ----------------------
document.querySelector(".modal-close").addEventListener("click", () => {
    document.getElementById("modalOverlay").classList.remove("active");
});

document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") {
        document.getElementById("modalOverlay").classList.remove("active");
    }
});


let proximaPagina = null;
let paginaAnterior = null;

// ---- OBTER PERSONAGENS ----------
async function obterPersonagens(url) {

    let dadosCache = carregarDoCache(url);

    if (dadosCache !== null) {
        listaOriginal = dadosCache.results;
        exibirPersonagem(dadosCache.results);

        proximaPagina = dadosCache.next;
        paginaAnterior = dadosCache.previous;

        document.getElementById("btnNext").disabled = (proximaPagina === null);
        document.getElementById("btnPrev").disabled = (paginaAnterior === null);
        return;
    }

    let resposta = await fetch(url);
    let json = await resposta.json();

    salvarNoCache(url, json);

    listaOriginal = json.results;
    exibirPersonagem(json.results);

    proximaPagina = json.next;
    paginaAnterior = json.previous;

    document.getElementById("btnNext").disabled = (proximaPagina === null);
    document.getElementById("btnPrev").disabled = (paginaAnterior === null);
}


document.getElementById("btnNext").addEventListener("click", () => {
    if (proximaPagina) obterPersonagens(proximaPagina);
});

document.getElementById("btnPrev").addEventListener("click", () => {
    if (paginaAnterior) obterPersonagens(paginaAnterior);
});



window.addEventListener("load", () => {
    obterPersonagens("https://swapi.dev/api/people/");
});
