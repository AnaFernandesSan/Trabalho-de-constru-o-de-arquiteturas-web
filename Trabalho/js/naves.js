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
function exibirNaves(lista) {
    const divNaves = document.querySelector('.info');
    divNaves.innerHTML = "";

    lista.forEach(naves => {

        let card = document.createElement("div");
        card.classList.add("informacao-panel");

        card.innerHTML = `
            <h2>${naves.name}</h2>

            <div class="info">
                <p><strong>Nome:</strong> ${naves.name}</p>
                <p><strong>Modelo:</strong> ${naves.model}</p>
            </div>

            <button class="btn-more" name="${naves.name}">
                Ver mais
            </button>
        `;

        card.querySelector(".btn-more").addEventListener("click", () => {
            abrirModal(naves);
        });

        divNaves.appendChild(card);
    });
}

// ---------- BUSCA ----------
const campoBusca = document.getElementById("campoBusca");

campoBusca.addEventListener("input", () => {
    const termo = campoBusca.value.toLowerCase().trim();

    if (termo === "") {
        exibirNaves(listaOriginal);
        return;
    }

    const filtrados = listaOriginal.filter(nave =>
        nave.name.toLowerCase().includes(termo)
    );

    exibirNaves(filtrados);
});

// ---------- DADOS DO MODAL ----------
async function abrirModal(nave) {

    if (nave.name !== "") {
        document.getElementById("modalName").textContent = nave.name;
    } else {
        document.getElementById("modalName").textContent = "Nome indisponível";
    }

    if (nave.manufacturer !== "") {
        document.getElementById("modalManufacturer").textContent = nave.manufacturer;
    } else {
        document.getElementById("modalManufacturer").textContent = "Fabricante indisponível";
    }

    if (nave.cost_in_credits !== "") {
        document.getElementById("modalCost").textContent = nave.cost_in_credits;
    } else {
        document.getElementById("modalCost").textContent = "Custo indisponível";
    }

    if (nave.length !== "") {
        document.getElementById("modalLenght").textContent = nave.length;
    } else {
        document.getElementById("modalLenght").textContent = "Tamanho desconhecido";
    }

    if (nave.max_atmosphering_speed !== "") {
        document.getElementById("modalSpeed").textContent = nave.max_atmosphering_speed;
    } else {
        document.getElementById("modalSpeed").textContent = "Velocidade desconhecida";
    }

    if (nave.crew !== "") {
        document.getElementById("modalCrew").textContent = nave.crew;
    } else {
        document.getElementById("modalCrew").textContent = "Equipe desconhecida";
    }

    if (nave.passengers !== "") {
        document.getElementById("modalPassengers").textContent = nave.passengers;
    } else {
        document.getElementById("modalPassengers").textContent = "Passageiros desconhecidos";
    }

    if (nave.cargo_capacity !== "") {
        document.getElementById("modalCargo").textContent = nave.cargo_capacity;
    } else {
        document.getElementById("modalCargo").textContent = "Capacidade de carga desconhecida";
    }

    if (nave.consumables !== "") {
        document.getElementById("modalConsul").textContent = nave.consumables;
    } else {
        document.getElementById("modalConsul").textContent = "Consumíveis desconhecidos";
    }

    if (nave.hyperdrive_rating !== "") {
        document.getElementById("modalMotor").textContent = nave.hyperdrive_rating;
    } else {
        document.getElementById("modalMotor").textContent = "Classificação desconhecida";
    }

    if (nave.MGLT !== "") {
        document.getElementById("modalMglt").textContent = nave.MGLT;
    } else {
        document.getElementById("modalMglt").textContent = "MGLT desconhecido";
    }

    if (nave.starship_class !== "") {
        document.getElementById("modalClasse").textContent = nave.starship_class;
    } else {
        document.getElementById("modalClasse").textContent = "Classe desconhecida";
    }

    if (nave.pilots.length === 0) {
        document.getElementById("modalPiloto").textContent = "Pilotos desconhecidos";
    } else {
        document.getElementById("modalPiloto").innerHTML = "";

        for (let p of nave.pilots) {
            let resp = await fetch(p);
            let piloto = await resp.json();

            let el = document.createElement("p");
            el.textContent = piloto.name;
            document.getElementById("modalPiloto").appendChild(el);
        }
    }

    if (nave.films.length === 0) {
        document.getElementById("modalFilmes").textContent = "Sem filmes registrados";
    } else {
        document.getElementById("modalFilmes").innerHTML = "";

        for (let url of nave.films) {
            let resp = await fetch(url);
            let filme = await resp.json();

            let p = document.createElement("p");
            p.textContent = filme.title;
            document.getElementById("modalFilmes").appendChild(p);
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



// ---------------------- PAGINAÇÃO ----------------------
let proximaPagina = null;
let paginaAnterior = null;

// ---------- obter naves ----------
async function obterNaves(url) {

    let dadosCache = carregarDoCache(url);

    if (dadosCache !== null) {
        listaOriginal = dadosCache.results;    
        exibirNaves(dadosCache.results);

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
    exibirNaves(json.results);

    proximaPagina = json.next;
    paginaAnterior = json.previous;

    document.getElementById("btnNext").disabled = (proximaPagina === null);
    document.getElementById("btnPrev").disabled = (paginaAnterior === null);
}

document.getElementById("btnNext").addEventListener("click", () => {
    if (proximaPagina) obterNaves(proximaPagina);
});

document.getElementById("btnPrev").addEventListener("click", () => {
    if (paginaAnterior) obterNaves(paginaAnterior);
});

window.addEventListener("load", () => {
    obterNaves("https://swapi.dev/api/starships/");
});
