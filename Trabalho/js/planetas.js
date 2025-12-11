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
// ------- exibir planeta ------------

function exibirPlaneta(lista) {
    const divPlanet = document.querySelector('.info');
    divPlanet.innerHTML = "";

    lista.forEach(planeta => {

        let card = document.createElement("div");
        card.classList.add("informacao-panel");

        card.innerHTML = `
            <h2>${planeta.name}</h2>

            <div class="info">
                <p><strong>Periodo de rotação:</strong> ${planeta.rotation_period}</p>
                <p><strong>Periodo de orbita:</strong> ${planeta.orbital_period}</p>
            </div>

            <button class="btn-more" name="${planeta.name}">
                Ver mais
            </button>

        `;

        card.querySelector(".btn-more").addEventListener("click", () => {
            abrirModal(planeta);
        });


        divPlanet.appendChild(card);
    });
}
// ---- Busca ---
const campoBusca = document.getElementById("campoBusca");

campoBusca.addEventListener("input", () => {
    const termo = campoBusca.value.toLowerCase().trim();

    if (termo === "") {
        exibirPlaneta(listaOriginal);
        return;
    }

    const filtrados = listaOriginal.filter(p =>
        p.name.toLowerCase().includes(termo)
    );

    exibirPlaneta(filtrados);
});



// ---------- DADOS DO MODAL ----------
async function abrirModal(planeta) {

    // --------- CAMPOS SIMPLES ----------


    if (planeta.name !== "") {
        document.getElementById("modalName").textContent = planeta.name;
    } else {
        document.getElementById("modalName").textContent = "Nome indisponível";
    }

    if (planeta.rotation_period !== "unknown") {
        document.getElementById("modalRotacao").textContent = planeta.rotation_period;
    } else {
        document.getElementById("modalRotacao").textContent = "Periodo de rotação desconhecido";
    }

    if (planeta.orbital_period !== "unknown") {
        document.getElementById("modalOrbita").textContent = planeta.orbital_period;
    } else {
        document.getElementById("modalOrbita").textContent = "Periodo de orbita desconhecido";
    }

    if (planeta.diameter !== "unknown") {
        document.getElementById("modalDiametro").textContent = planeta.diameter;
    } else {
        document.getElementById("modalDiametro").textContent = "Diametro desconhecido";
    }

    if (planeta.climate !== "unknown") {
        document.getElementById("modalClima").textContent = planeta.climate;
    } else {
        document.getElementById("modalClima").textContent = "Clima desconhecido";
    }

    if (planeta.gravity !== "unknown") {
        document.getElementById("modalGravidade").textContent = planeta.gravity;
    } else {
        document.getElementById("modalGravidade").textContent = "Gravidade desconhecido";
    }

    if (planeta.terrain !== "unknown") {
        document.getElementById("modalTerreno").textContent = planeta.terrain;
    } else {
        document.getElementById("modalTerreno").textContent = "Terreno desconhecido";
    }

    if (planeta.surface_water !== "unknown") {
        document.getElementById("modalAgua").textContent = planeta.surface_water;
    } else {
        document.getElementById("modalAgua").textContent = "Água superficial desconhecida";
    }

    if (planeta.population !== "unknown") {
        document.getElementById("modalPopulacao").textContent = planeta.population;
    } else {
        document.getElementById("modalPopulacao").textContent = "População desconhecido";
    }


    if (planeta.residents.length === 0) {
        document.getElementById("modalMoradores").textContent = "Sem moradores registrados";
    } else {
        document.getElementById("modalMoradores").innerHTML = "";

        for (var i = 0; i < planeta.residents.length; i++) {
            var resp = await fetch(planeta.residents[i]);
            var pessoa = await resp.json();

            var p = document.createElement("p");
            p.textContent = pessoa.name;
            document.getElementById("modalMoradores").appendChild(p);
        }
    }
    var filmesDiv = document.getElementById("modalFilmes");
    filmesDiv.innerHTML = "";

    if (planeta.films.length === 0) {
        filmesDiv.textContent = "Sem filmes registrados";
    } else {
        for (var i = 0; i < planeta.films.length; i++) {
            var resp = await fetch(planeta.films[i]);
            var filme = await resp.json();

            var p = document.createElement("p");
            p.textContent = filme.title;
            filmesDiv.appendChild(p);
        }
    }

    document.getElementById("modalOverlay").classList.add("active");
}

// ---------- FECHAR MODAL ----------
document.querySelector(".modal-close").addEventListener("click", () => {
    document.getElementById("modalOverlay").classList.remove("active");
});

document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") {
        document.getElementById("modalOverlay").classList.remove("active");
    }
});

// ---------- OBTER PERSONAGEM ----------

let proximaPagina = null;
let paginaAnterior = null;

async function obterPlaneta(url) {
    let dadosCache = carregarDoCache(url);

    if (dadosCache !== null) {
        listaOriginal = dadosCache.results;
        exibirPlaneta(dadosCache.results);

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
    exibirPlaneta(json.results);

    proximaPagina = json.next;
    paginaAnterior = json.previous;

    document.getElementById("btnNext").disabled = (proximaPagina === null);
    document.getElementById("btnPrev").disabled = (paginaAnterior === null);

}

document.getElementById("btnNext").addEventListener("click", () => {
    if (proximaPagina) obterPlaneta(proximaPagina);
});

document.getElementById("btnPrev").addEventListener("click", () => {
    if (paginaAnterior) obterPlaneta(paginaAnterior);
});

window.addEventListener("load", () => {
    obterPlaneta("https://swapi.dev/api/planets/");
});

