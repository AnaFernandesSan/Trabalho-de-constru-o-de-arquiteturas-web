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
// ------- exibir Naves ------------
function exibirVeiculos(lista) {
    const divVeiculo = document.querySelector('.info');
    divVeiculo.innerHTML = "";

    lista.forEach(Veiculo => {

        let card = document.createElement("div");
        card.classList.add("informacao-panel");

        card.innerHTML = `
            <h2>${Veiculo.name}</h2>

            <div class="info">
                <p><strong>Nome:</strong> ${Veiculo.name}</p>
                <p><strong>Modelo:</strong> ${Veiculo.model}</p>
            </div>

            <button class="btn-more" name="${Veiculo.name}">
                Ver mais
            </button>

        `;

        card.querySelector(".btn-more").addEventListener("click", () => {
            abrirModal(Veiculo);
        });


        divVeiculo.appendChild(card);
    });
}
// ---- Busca ---
const campoBusca = document.getElementById("campoBusca");

campoBusca.addEventListener("input", () => {
    const termo = campoBusca.value.toLowerCase().trim();

    if (termo === "") {
        exibirVeiculos(listaOriginal);
        return;
    }

    const filtrados = listaOriginal.filter(p =>
        p.name.toLowerCase().includes(termo)
    );

    exibirVeiculos(filtrados);
});



// ---------- DADOS DO MODAL ----------
async function abrirModal(veiculo) {

    if (veiculo.name !== "") {
        document.getElementById("modalName").textContent = veiculo.name;
    } else {
        document.getElementById("modalName").textContent = "Nome indisponível";
    }

    if (veiculo.manufacturer !== "") {
        document.getElementById("modalManufacturer").textContent = veiculo.manufacturer;
    } else {
        document.getElementById("modalManufacturer").textContent = "Fabricante indisponível";
    }

    if (veiculo.cost_in_credits !== "") {
        document.getElementById("modalCost").textContent = veiculo.cost_in_credits;
    } else {
        document.getElementById("modalCost").textContent = "Custo indisponível";
    }

    if (veiculo.length !== "") {
        document.getElementById("modalLenght").textContent = veiculo.length;
    } else {
        document.getElementById("modalLenght").textContent = "Tamanho desconhecido";
    }

    if (veiculo.max_atmosphering_speed !== " ") {
        document.getElementById("modalSpeed").textContent = veiculo.max_atmosphering_speed;
    } else {
        document.getElementById("modalSpeed").textContent = "Velocidade desconhecida";
    }

    if (veiculo.crew !== "") {
        document.getElementById("modalCrew").textContent = veiculo.crew;
    } else {
        document.getElementById("modalCrew").textContent = "Equipe desconhecida";
    }

    if (veiculo.passengers !== " ") {
        document.getElementById("modalPassengers").textContent = veiculo.passengers;
    } else {
        document.getElementById("modalPassengers").textContent = "Passageiros desconhecido";
    }

    if (veiculo.cargo_capacity !== " ") {
        document.getElementById("modalCargo").textContent = veiculo.cargo_capacity;
    } else {
        document.getElementById("modalCargo").textContent = "Capacidade de carga desconhecido";
    }
    if (veiculo.consumables !== " ") {
        document.getElementById("modalConsul").textContent = veiculo.consumables;
    } else {
        document.getElementById("modalConsul").textContent = "Consumiveis desconhecido";
    }

    if (veiculo.vehicle_class !== " ") {
        document.getElementById("modalClasse").textContent = veiculo.vehicle_class;
    } else {
        document.getElementById("modalClasse").textContent = "Classe desconhecido";
    }


    if (veiculo.pilots.length === 0) {
        document.getElementById("modalPiloto").textContent = "Pilotos desconhecido";
    } else {
        document.getElementById("modalPiloto").innerHTML = "";

        let resp = await fetch(veiculo.pilots);
        let piloto = await resp.json();

        let p = document.createElement("p");
        p.textContent = piloto.name;

        document.getElementById("modalPiloto").appendChild(p);
    }


    if (veiculo.films.length === 0) {
        document.getElementById("modalFilmes").textContent = "Sem veiculos registrados";
    } else {
        document.getElementById("modalFilmes").innerHTML = "";

        for (var i = 0; i < veiculo.films.length; i++) {
            var resp = await fetch(veiculo.films[i]);
            var veiculos = await resp.json();

            var p = document.createElement("p");
            p.textContent = veiculos.title;
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

// ---------- OBTER especie   ----------

let proximaPagina = null;

let paginaAnterior = null;
async function obterNaves(url) {

 let dadosCache = carregarDoCache(url);

    if (dadosCache !== null) {
        listaOriginal = dadosCache.results;
        exibirVeiculos(dadosCache.results);

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
    exibirVeiculos(json.results);

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
    obterNaves("https://swapi.dev/api/vehicles/");
});

