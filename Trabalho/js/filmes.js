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
//  ---------- exibir filmes ---------------
function exibirFilme(lista) {

    const divFilme = document.querySelector('.info');
    divFilme.innerHTML = "";

    lista.forEach(filme => {

        let card = document.createElement("div");
        card.classList.add("informacao-panel");

        card.innerHTML = `
            <h2>${filme.title}</h2>

            <div class="info">
                <p><strong>Episódio:</strong> ${filme.episode_id}</p>
                <p><strong>Sinopse:</strong> ${filme.opening_crawl}</p>
            </div>

            <button class="btn-more" name="${filme.title}">
                Ver mais
            </button>
        `;

        card.querySelector(".btn-more").addEventListener("click", () => {
            abrirModal(filme);
        });

        divFilme.appendChild(card);
    });
}
// ---------- CAMPO DE BUSCA ----------
const campoBusca = document.getElementById("campoBusca");

campoBusca.addEventListener("input", () => {
    const termo = campoBusca.value.toLowerCase();

    if (termo.trim() === "") {
        exibirFilme(listaOriginal); 
        return;
    }

    const filtrados = listaOriginal.filter(filme =>
        filme.title.toLowerCase().includes(termo)
    );

    exibirFilme(filtrados);
});

// ---------- DADOS DO MODAL ----------
async function abrirModal(filme) {

    document.getElementById("modalName").textContent = filme.title || "Título indisponível";

    document.getElementById("modalDiretor").textContent =
        filme.director?.length ? filme.director : "Diretor desconhecido";

    document.getElementById("modalProdutor").textContent =
        filme.producer?.length ? filme.producer : "Produtor desconhecido";

    document.getElementById("modalLancamento").textContent =
        filme.release_date?.length ? filme.release_date : "Data desconhecida";


    if (filme.characters.length === 0) {
        document.getElementById("modalPersonagens").textContent = "Sem personagens registrados";
    } else {
        document.getElementById("modalPersonagens").innerHTML = "";
        for (let url of filme.characters) {
            let resp = await fetch(url);
            let pessoa = await resp.json();

            let p = document.createElement("p");
            p.textContent = pessoa.name;
            document.getElementById("modalPersonagens").appendChild(p);
        }
    }


    if (filme.planets.length === 0) {
        document.getElementById("modalPlanetas").textContent = "Sem planetas registrados";
    } else {
        document.getElementById("modalPlanetas").innerHTML = "";
        for (let url of filme.planets) {
            let resp = await fetch(url);
            let planeta = await resp.json();

            let p = document.createElement("p");
            p.textContent = planeta.name;
            document.getElementById("modalPlanetas").appendChild(p);
        }
    }


    if (filme.starships.length === 0) {
        document.getElementById("modalNave").textContent = "Sem naves registradas";
    } else {
        document.getElementById("modalNave").innerHTML = "";
        for (let url of filme.starships) {
            let resp = await fetch(url);
            let nave = await resp.json();

            let p = document.createElement("p");
            p.textContent = nave.name;
            document.getElementById("modalNave").appendChild(p);
        }
    }


    if (filme.vehicles.length === 0) {
        document.getElementById("modalVeiculos").textContent = "Sem veículos registrados";
    } else {
        document.getElementById("modalVeiculos").innerHTML = "";
        for (let url of filme.vehicles) {
            let resp = await fetch(url);
            let veiculo = await resp.json();

            let p = document.createElement("p");
            p.textContent = veiculo.name;
            document.getElementById("modalVeiculos").appendChild(p);
        }
    }


    if (filme.species.length === 0) {
        document.getElementById("modalEspecies").textContent = "Sem espécies registradas";
    } else {
        document.getElementById("modalEspecies").innerHTML = "";
        for (let url of filme.species) {
            let resp = await fetch(url);
            let especie = await resp.json();

            let p = document.createElement("p");
            p.textContent = especie.name;
            document.getElementById("modalEspecies").appendChild(p);
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


let proximaPagina = null;
let paginaAnterior = null;

// ---------- OBTER FILME ----------
async function obterfilme(url) {

    let dadosCache = carregarDoCache(url);

    if (dadosCache !== null) {
        listaOriginal = dadosCache.results;
        exibirFilme(dadosCache.results);

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
    exibirFilme(json.results);

    proximaPagina = json.next;
    paginaAnterior = json.previous;

    document.getElementById("btnNext").disabled = (proximaPagina === null);
    document.getElementById("btnPrev").disabled = (paginaAnterior === null);
}




// ---------- BOTÕES ----------
document.getElementById("btnNext").addEventListener("click", () => {
    if (proximaPagina) obterfilme(proximaPagina);
});

document.getElementById("btnPrev").addEventListener("click", () => {
    if (paginaAnterior) obterfilme(paginaAnterior);
});

window.addEventListener("load", () => {
    obterfilme("https://swapi.dev/api/films/");
});
