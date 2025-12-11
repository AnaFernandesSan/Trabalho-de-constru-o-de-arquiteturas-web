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
let listaCompleta = [];

// ---------------------- EXIBIR LISTA ----------------------
function exibirEspecies(lista) {
    listaCompleta = lista;

    const divEspecie = document.querySelector('.info');
    divEspecie.innerHTML = "";

    lista.forEach(especie => {

        let card = document.createElement("div");
        card.classList.add("informacao-panel");

        card.innerHTML = `
            <h2>${especie.name}</h2>

            <div class="info">
                <p><strong>Nome:</strong> ${especie.name}</p>
                <p><strong>Classificação:</strong> ${especie.classification}</p>
            </div>

            <button class="btn-more" name="${especie.name}">
                Ver mais
            </button>
        `;

        card.querySelector(".btn-more").addEventListener("click", () => {
            abrirModal(especie);
        });

        divEspecie.appendChild(card);
    });
}

// -------------------- BUSCA ----------------------
const campoBusca = document.getElementById("campoBusca");

campoBusca.addEventListener("input", () => {
    const termo = campoBusca.value.toLowerCase();


    if (termo.trim() === "") {
        exibirEspecies(listaOriginal);
        return;
    }

    const filtrados = listaOriginal.filter(especie =>
        especie.name.toLowerCase().includes(termo)
    );

    exibirEspecies(filtrados);
});


// ---------------------- MODAL ----------------------
async function abrirModal(especie) {

    document.getElementById("modalName").textContent =
        especie.name || "Nome indisponível";

    document.getElementById("modalDesignation").textContent =
        especie.designation || "Designação indisponível";

    document.getElementById("modalAverage_height").textContent =
        especie.average_height || "Altura indisponível";

    document.getElementById("modalSkin").textContent =
        especie.skin_colors.length ? especie.skin_colors : "Tom de pele desconhecido";

    document.getElementById("modalHair").textContent =
        especie.hair_colors.length ? especie.hair_colors : "Cor de cabelo desconhecido";

    document.getElementById("modalEye").textContent =
        especie.eye_colors.length ? especie.eye_colors : "Cor de olhos desconhecido";

    document.getElementById("modalAverage_life").textContent =
        especie.average_lifespan.length ? especie.average_lifespan : "Tempo de vida desconhecido";


    if (!especie.homeworld.length) {
        document.getElementById("modalHomeworld").textContent = "Planeta mãe desconhecido";
    } else {
        document.getElementById("modalHomeworld").innerHTML = "";
        let resp = await fetch(especie.homeworld);
        let planeta = await resp.json();

        let p = document.createElement("p");
        p.textContent = planeta.name;
        document.getElementById("modalHomeworld").appendChild(p);
    }


    document.getElementById("modalLanguage").textContent =
        especie.language.length ? especie.language : "Idioma desconhecido";



    if (!especie.people.length) {
        document.getElementById("modalPeople").textContent = "Sem personagens registrados";
    } else {
        document.getElementById("modalPeople").innerHTML = "";

        for (let url of especie.people) {
            let resp = await fetch(url);
            let pessoa = await resp.json();

            let p = document.createElement("p");
            p.textContent = pessoa.name;
            document.getElementById("modalPeople").appendChild(p);
        }
    }


    if (!especie.films.length) {
        document.getElementById("modalFilmes").textContent = "Sem filmes registrados";
    } else {
        document.getElementById("modalFilmes").innerHTML = "";

        for (let url of especie.films) {
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



// ---------------------- OBTER ESPÉCIES ----------------------
let proximaPagina = null;
let paginaAnterior = null;

async function obterEspecies(url) {

    let dadosCache = carregarDoCache(url);

    if (dadosCache !== null) {
        listaOriginal = dadosCache.results;
        exibirEspecies(dadosCache.results);

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
    exibirEspecies(json.results);

    proximaPagina = json.next;
    paginaAnterior = json.previous;

    document.getElementById("btnNext").disabled = (proximaPagina === null);
    document.getElementById("btnPrev").disabled = (paginaAnterior === null);
}



document.getElementById("btnNext").addEventListener("click", () => {
    if (proximaPagina) obterEspecies(proximaPagina);
});

document.getElementById("btnPrev").addEventListener("click", () => {
    if (paginaAnterior) obterEspecies(paginaAnterior);
});



window.addEventListener("load", () => {
    obterEspecies("https://swapi.dev/api/species/");
});
